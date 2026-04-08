import type { Food } from '../types';
import ResultItem from './ResultItem';

interface Props {
  results: Food[];
  totalCount: number;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ResultList({ results, totalCount, hasMore, onLoadMore }: Props) {
  return (
    <div className="animate-fade-in">
      {/* Result count header */}
      <div
        className="mb-3 flex items-center justify-between"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
          Resultados
        </span>
        <span
          className="rounded-full px-3 py-0.5 text-xs font-semibold"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
          }}
        >
          {totalCount.toLocaleString('pt-BR')} encontrados
        </span>
      </div>

      {/* List */}
      <ul
        className="max-h-105 overflow-y-auto rounded-xl"
        style={{
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        {results.map((food) => (
          <ResultItem key={food.id} food={food} />
        ))}
      </ul>

      {/* Load more */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          className="mt-3 w-full rounded-xl py-3 text-sm font-medium transition-all active:scale-[0.98]"
          style={{
            border: '1.5px dashed var(--color-border)',
            color: 'var(--color-primary-light)',
            fontFamily: 'var(--font-body)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary-light)';
            e.currentTarget.style.backgroundColor = '#eef3e5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Carregar mais &darr;
        </button>
      )}
    </div>
  );
}
