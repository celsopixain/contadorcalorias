# Contador de Calorias

**🚀 Demo:** https://contador-calorias-chi.vercel.app

App client-side de contagem de calorias baseado na base de dados oficial do USDA (MyPyramid Food Raw Data). Busca instantânea entre mais de 2.000 alimentos com suporte a wildcards e paginação incremental — sem backend, sem banco de dados remoto.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Estilo | Tailwind CSS 4 |
| Dados | JSON estático (`public/foods.json`) |
| ETL | Node.js + `xlsx` (Excel → JSON) |

---

## Funcionalidades

- **Busca por substring** — case-insensitive, resultado instantâneo
- **Wildcard `*`** — ex: `chick*breast` retorna "Chicken breast grilled", etc.
- **Contador de resultados** — exibe o total encontrado ao lado da lista
- **Paginação incremental** — 25 itens por vez, botão "Carregar mais"
- **Avisos contextuais** — campo vazio, nenhum resultado encontrado, erro de carregamento
- **Índice de trigramas** — busca 4–14× mais rápida que varredura linear para queries ≥ 3 chars
- **Painel de benchmark** (dev only) — compara busca linear vs. indexada no browser

---

## Início rápido

```bash
# 1. Instalar dependências
npm install

# 2. Baixar o dataset do USDA
#    https://catalog.data.gov/dataset/mypyramid-food-raw-data
#    Baixe o arquivo Food_Display_Table.xlsx

# 3. Gerar public/foods.json
node scripts/convert.js Food_Display_Table.xlsx

# 4. Rodar em desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`.

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção (`tsc` + Vite) |
| `npm run preview` | Preview do build de produção |
| `npm run typecheck` | Checagem de tipos sem emitir arquivos |
| `node scripts/convert.js <arquivo.xlsx>` | Gera `public/foods.json` a partir do Excel do USDA |

---

## Estrutura do projeto

```
contadorCalorias/
├── scripts/
│   └── convert.js          # ETL: Excel do USDA → public/foods.json
│
├── public/
│   └── foods.json          # Dataset gerado (2.014 alimentos)
│
└── src/
    ├── types.ts             # Interface Food
    ├── App.tsx              # Componente raiz
    │
    ├── components/
    │   ├── SearchPanel.tsx  # Input + botões Pesquisar/Limpar
    │   ├── ResultList.tsx   # Lista paginada + contador de resultados
    │   ├── ResultItem.tsx   # Item individual
    │   ├── StatusMessage.tsx# Avisos (warning, error, info)
    │   └── BenchmarkPanel.tsx # Comparativo de performance (dev only)
    │
    ├── hooks/
    │   ├── useFoods.ts      # Carrega foods.json via fetch
    │   └── useSearch.ts     # Busca, paginação e estado de query
    │
    └── utils/
        ├── search.ts        # Busca linear, índice de trigramas, benchmark
        └── format.ts        # Formatação de calorias e porções
```

---

## ETL — pipeline de dados

O script `scripts/convert.js` lê o Excel do USDA com a lib `xlsx`, normaliza cada linha e grava `public/foods.json`:

- Descarta linhas sem nome ou com calorias inválidas (< 0 ou NaN)
- Formata a porção como `"<quantidade> <unidade>"` (ex: `"1 cup"`)
- Arredonda calorias para inteiro
- Ordena alfabeticamente por nome

Campos gerados por item: `id`, `code`, `name`, `portion`, `calories`.

---

## Otimização de busca (Fase 4)

A busca usa um **índice invertido de trigramas** construído em memória na primeira renderização (`useMemo`). Para cada alimento, todos os substrings de 3 caracteres do nome são indexados. Na query:

1. A query é dividida nos segmentos separados por `*`
2. Para cada segmento ≥ 3 chars, as posting lists dos trigramas são intersectadas
3. Os candidatos sobreviventes são verificados com a regex original (elimina falsos positivos)
4. Queries com segmentos curtos demais fazem fallback para varredura linear

**Resultados medidos** (2.014 alimentos, Chrome, 300 execuções):

| Query | Linear (ms/q) | Indexado (ms/q) | Speedup |
|-------|--------------|-----------------|---------|
| `chicken` | 0.042 | 0.009 | 4.7× |
| `milk` | 0.039 | 0.008 | 4.9× |
| `chick*breast` | 0.044 | 0.004 | 11.0× |
| `beef*raw` | 0.041 | 0.003 | 13.7× |
| `a*` | 0.040 | 0.037 | 1.1× ← fallback |

---

## Dados

**Fonte:** [USDA MyPyramid Food Raw Data](https://catalog.data.gov/dataset/mypyramid-food-raw-data)

O arquivo `public/foods.json` gerado contém 2.014 itens válidos. Itens com o mesmo nome representam o mesmo alimento em porções diferentes (comportamento esperado do dataset USDA).
