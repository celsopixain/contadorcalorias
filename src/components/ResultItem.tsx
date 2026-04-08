import type { Food } from '../types';
import { formatCalories } from '../utils/format';

interface Props {
  food: Food;
}

export default function ResultItem({ food }: Props) {
  return (
    <li
      className="result-item flex items-center justify-between gap-4 px-4 py-3 transition-colors"
      style={{
        borderBottom: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
      }}
    >
      <span
        className="flex-1 text-sm"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
      >
        {food.name}
      </span>

      <span
        className="shrink-0 rounded-full px-2 py-0.5 text-xs"
        style={{
          backgroundColor: '#eef3e5',
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
        }}
      >
        {food.portion}
      </span>

      <span
        className="w-24 shrink-0 text-right text-sm font-semibold tabular-nums"
        style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
      >
        {formatCalories(food.calories)}
      </span>
    </li>
  );
}
