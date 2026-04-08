interface Props {
  type: 'warning' | 'error' | 'info';
  message: string;
}

const styles: Record<Props['type'], { bg: string; border: string; color: string; dot: string }> = {
  warning: {
    bg: '#fefce8',
    border: '#fde68a',
    color: '#92400e',
    dot: '#f59e0b',
  },
  error: {
    bg: '#fef2f2',
    border: '#fecaca',
    color: '#991b1b',
    dot: '#ef4444',
  },
  info: {
    bg: '#eef3e5',
    border: '#c6dba0',
    color: '#2d5016',
    dot: '#8fb83a',
  },
};

export default function StatusMessage({ type, message }: Props) {
  const s = styles[type];
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm animate-fade-in"
      style={{
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontFamily: 'var(--font-body)',
      }}
    >
      <span
        className="mt-1 h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: s.dot }}
      />
      {message}
    </div>
  );
}
