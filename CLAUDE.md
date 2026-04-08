# CLAUDE.md — Calorie Counter App

## Descrição

App de contagem de calorias baseado na base de dados oficial do USDA (MyPyramid Food Raw Data).
O usuário busca alimentos pelo nome e vê calorias, porção e descrição. O projeto envolve
um pipeline de ETL (Excel/CSV → JSON) e uma UI de busca client-side, sem backend.

Nível de complexidade: **3 — Avançado**

---

## Stack

| Camada      | Tecnologia                        |
|-------------|-----------------------------------|
| Frontend    | React 18 + TypeScript             |
| Build       | Vite                              |
| Estilo      | Tailwind CSS                      |
| Dados       | JSON estático (`foods.json`)      |
| ETL         | Script Node.js (sem dependências) |
| Bônus BD    | `sql.js` (SQLite no browser)      |

---

## Fases de Desenvolvimento

### Fase 1 — ETL de Dados
Transformar o CSV bruto do USDA em JSON utilizável pela aplicação.

- Baixar o CSV do MyPyramid (link no `Calorie-Counter-App.md`)
- Escrever `scripts/convert.js` para parsear o CSV e gerar `public/foods.json`
- Campos gerados: `id`, `description`, `portion`, `calories`
- Limpar e normalizar dados inconsistentes (calorias nulas, descrições vazias)

### Fase 2 — MVP da UI
Interface funcional com busca e listagem de resultados.

- Setup do projeto: Vite + React + TypeScript + Tailwind
- Carregar `foods.json` ao iniciar via `fetch`
- Painel com: input de texto, botão Search, botão Clear
- Busca por substring (case-insensitive) na descrição
- Listagem limitada a 25 itens: nome, porção, calorias
- Mensagens de aviso: campo vazio, sem resultados

### Fase 3 — Bônus UX
Melhorias de usabilidade sobre o MVP.

- Contador de resultados totais ao lado da lista
- Suporte a wildcard `*` nos termos de busca
- Botão "Ver mais" para paginação incremental (+ 25 por clique)

### Fase 4 — Otimização de Busca
Substituir busca linear por estrutura mais eficiente.

- Implementar índice invertido em memória ou integrar `sql.js`
- Comparar performance (tempo de busca) entre a implementação simples e a otimizada
- Documentar resultados no código

---

## Estrutura de Pastas

```
contadorCalorias/
├── CLAUDE.md
├── Calorie-Counter-App.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── index.html
│
├── scripts/
│   └── convert.js          # ETL: CSV do USDA → foods.json
│
├── public/
│   └── foods.json          # Gerado pelo script ETL
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types.ts             # Tipos globais (Food, SearchResult, etc.)
    │
    ├── components/
    │   ├── SearchPanel.tsx  # Input + botões
    │   ├── ResultList.tsx   # Lista de resultados + paginação
    │   ├── ResultItem.tsx   # Item individual da lista
    │   └── StatusMessage.tsx # Avisos e erros
    │
    ├── hooks/
    │   ├── useFoods.ts      # Carrega e expõe foods.json
    │   └── useSearch.ts     # Lógica de busca e paginação
    │
    └── utils/
        ├── search.ts        # Funções de busca (substring, wildcard)
        └── format.ts        # Formatação de calorias e porções
```

---

## Comandos

```bash
# Instalar dependências
npm install

# Gerar foods.json a partir do CSV do USDA
node scripts/convert.js <caminho/para/arquivo.csv>

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Checar tipos TypeScript
npm run typecheck

# Lint
npm run lint
```

---

## Convenções de Código

### TypeScript
- Todos os arquivos em `.tsx` (componentes) ou `.ts` (lógica pura)
- Sem `any` — usar tipos explícitos ou `unknown` quando necessário
- Tipos globais ficam em `src/types.ts`; tipos locais ficam no próprio arquivo

### Componentes React
- Functional components com arrow functions
- Props tipadas com `interface` (não `type`)
- Um componente por arquivo; nome do arquivo = nome do componente

### Hooks
- Prefixo `use` obrigatório
- Cada hook tem responsabilidade única (busca, carregamento de dados, etc.)
- Sem efeitos colaterais fora de `useEffect`

### Estilo (Tailwind)
- Classes utilitárias direto no JSX, sem CSS customizado salvo necessidade real
- Variantes responsivas apenas quando necessário
- Sem inline `style={}`

### Nomenclatura
- Componentes: `PascalCase`
- Hooks e funções: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Arquivos de componente: `PascalCase.tsx`
- Arquivos de lógica: `camelCase.ts`

### Commits
- Mensagens em inglês, imperativo presente: `add search wildcard support`
- Escopo por fase: `feat(phase-2)`, `fix(etl)`, `refactor(search)`

### Geral
- Sem comentários óbvios — só comentar lógica não trivial
- Funções puras em `utils/` não devem ter efeitos colaterais
- Limite de 25 resultados e tamanho de página devem ser constantes nomeadas, não magic numbers
