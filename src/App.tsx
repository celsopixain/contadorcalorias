import { useFoods } from './hooks/useFoods';
import { useSearch } from './hooks/useSearch';
import SearchPanel from './components/SearchPanel';
import ResultList from './components/ResultList';
import StatusMessage from './components/StatusMessage';

export default function App() {
  const { foods, status } = useFoods();
  const {
    query,
    setQuery,
    search,
    clear,
    visibleResults,
    totalResults,
    hasMore,
    loadMore,
    searched,
  } = useSearch(foods);

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <header className="mb-12 animate-fade-up">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="inline-block h-px flex-1"
              style={{ backgroundColor: 'var(--color-border)' }}
            />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
            >
              Base de Dados USDA MyPyramid
            </span>
            <span
              className="inline-block h-px flex-1"
              style={{ backgroundColor: 'var(--color-border)' }}
            />
          </div>

          <h1
            className="text-5xl leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
              fontWeight: 900,
            }}
          >
            Contador de Calorias
          </h1>
          <p
            className="mt-2 text-base font-light"
            style={{ color: 'var(--color-muted)' }}
          >
            Pesquise entre {foods.length > 0 ? foods.length.toLocaleString('pt-BR') : '2.000+'} alimentos.
            Use <code className="rounded px-1 text-sm" style={{ backgroundColor: 'var(--color-border)' }}>*</code> como curinga.
          </p>
        </header>

        {/* Main card */}
        <main
          className="rounded-2xl p-6 shadow-sm animate-fade-up"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            animationDelay: '0.1s',
          }}
        >
          {status === 'loading' && (
            <StatusMessage type="info" message="Carregando base de dados de alimentos..." />
          )}

          {status === 'error' && (
            <StatusMessage
              type="error"
              message="Falha ao carregar os dados. Verifique se foods.json está na pasta public."
            />
          )}

          {status === 'ready' && (
            <div className="flex flex-col gap-5">
              <SearchPanel
                query={query}
                onChange={setQuery}
                onSearch={search}
                onClear={clear}
              />

              {searched && totalResults === 0 && (
                <StatusMessage
                  type="warning"
                  message={`Nenhum alimento encontrado para "${query}". Tente outro termo ou use * como curinga.`}
                />
              )}

              {!searched && (
                <p
                  className="py-8 text-center text-sm"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Digite um alimento acima e pressione Enter ou Pesquisar.
                </p>
              )}

              {searched && totalResults > 0 && (
                <ResultList
                  results={visibleResults}
                  totalCount={totalResults}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                />
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className="mt-8 text-center text-xs"
          style={{ color: 'var(--color-muted)' }}
        >
          Fonte dos dados: Departamento de Agricultura dos EUA — MyPyramid Food Raw Data
        </footer>
      </div>
    </div>
  );
}
