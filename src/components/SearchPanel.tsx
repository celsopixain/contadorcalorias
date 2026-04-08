interface Props {
  query: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function SearchPanel({ query, onChange, onSearch, onClear }: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onSearch();
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="ex: frango, ma*, leite integral..."
        className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{
          backgroundColor: '#f0ebe0',
          border: '1.5px solid var(--color-border)',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary-light)';
          e.currentTarget.style.backgroundColor = '#fff';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.backgroundColor = '#f0ebe0';
        }}
      />
      <button
        onClick={onSearch}
        className="rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all active:scale-95"
        style={{
          backgroundColor: 'var(--color-primary)',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.02em',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-light)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
      >
        Pesquisar
      </button>
      <button
        onClick={onClear}
        className="rounded-xl px-4 py-3 text-sm font-medium transition-all active:scale-95"
        style={{
          border: '1.5px solid var(--color-border)',
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-body)',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary-light)';
          e.currentTarget.style.color = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.color = 'var(--color-muted)';
        }}
      >
        Limpar
      </button>
    </div>
  );
}
