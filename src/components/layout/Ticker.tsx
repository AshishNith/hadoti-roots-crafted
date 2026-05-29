export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/10 py-4">
      <div className="ticker-track">
        {row.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/70 px-8 flex items-center gap-8"
          >
            {item}
            <span className="text-[color:var(--gold)]">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
