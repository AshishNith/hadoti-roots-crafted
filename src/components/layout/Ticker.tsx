interface TickerProps {
  items: string[];
  className?: string;
  textClassName?: string;
  dotClassName?: string;
}

export function Ticker({ 
  items, 
  className = "border-y border-white/10 py-4", 
  textClassName = "text-white/70", 
  dotClassName = "text-[color:var(--gold)]" 
}: TickerProps) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="ticker-track">
        {row.map((item, i) => (
          <span
            key={i}
            className={`font-mono text-xs uppercase tracking-[0.3em] px-8 flex items-center gap-8 shrink-0 whitespace-nowrap ${textClassName}`}
          >
            {item}
            <span className={dotClassName}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

