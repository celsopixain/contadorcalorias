import { useState } from 'react';
import type { Food } from '../types';
import { buildTrigramIndex, searchFoods, searchWithIndex } from '../utils/search';

interface Props {
  foods: Food[];
}

interface Result {
  query: string;
  linearMs: number;
  indexedMs: number;
  speedup: number;
  results: number;
}

const QUERIES = ['chicken', 'milk', 'beef*raw', 'chick*breast', 'a*'];
const RUNS = 300;

export default function BenchmarkPanel({ foods }: Props) {
  const [rows, setRows] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);

  function run() {
    setRunning(true);

    // Defer to next tick so the UI can update before blocking
    setTimeout(() => {
      const index = buildTrigramIndex(foods);
      const results: Result[] = QUERIES.map((query) => {
        // Warm up
        searchFoods(foods, query);
        searchWithIndex(index, query);

        const t0 = performance.now();
        for (let i = 0; i < RUNS; i++) searchFoods(foods, query);
        const linearMs = (performance.now() - t0) / RUNS;

        const t1 = performance.now();
        for (let i = 0; i < RUNS; i++) searchWithIndex(index, query);
        const indexedMs = (performance.now() - t1) / RUNS;

        return {
          query,
          linearMs,
          indexedMs,
          speedup: linearMs / indexedMs,
          results: searchWithIndex(index, query).length,
        };
      });

      setRows(results);
      setRunning(false);
    }, 10);
  }

  return (
    <div
      className="mt-6 rounded-2xl p-5"
      style={{ border: '1.5px dashed var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-muted)' }}
          >
            Benchmark — Fase 4
          </span>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--color-muted)' }}>
            Busca linear vs. índice de trigramas ({foods.length.toLocaleString('pt-BR')} alimentos, {RUNS} execuções por query)
          </p>
        </div>
        <button
          onClick={run}
          disabled={running}
          className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {running ? 'Rodando...' : 'Rodar'}
        </button>
      </div>

      {rows.length > 0 && (
        <table className="w-full text-xs" style={{ fontFamily: 'var(--font-body)' }}>
          <thead>
            <tr style={{ color: 'var(--color-muted)' }}>
              <th className="pb-2 text-left font-medium">Query</th>
              <th className="pb-2 text-right font-medium">Linear (ms)</th>
              <th className="pb-2 text-right font-medium">Indexado (ms)</th>
              <th className="pb-2 text-right font-medium">Speedup</th>
              <th className="pb-2 text-right font-medium">Resultados</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.query} style={{ borderTop: '1px solid var(--color-border)' }}>
                <td className="py-1.5">
                  <code
                    className="rounded px-1"
                    style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    {r.query}
                  </code>
                </td>
                <td className="py-1.5 text-right tabular-nums" style={{ color: 'var(--color-muted)' }}>
                  {r.linearMs.toFixed(3)}
                </td>
                <td className="py-1.5 text-right tabular-nums" style={{ color: 'var(--color-accent)' }}>
                  {r.indexedMs.toFixed(3)}
                </td>
                <td
                  className="py-1.5 text-right font-semibold tabular-nums"
                  style={{ color: r.speedup >= 2 ? 'var(--color-primary)' : 'var(--color-muted)' }}
                >
                  {r.speedup.toFixed(1)}×
                </td>
                <td className="py-1.5 text-right tabular-nums" style={{ color: 'var(--color-muted)' }}>
                  {r.results}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
