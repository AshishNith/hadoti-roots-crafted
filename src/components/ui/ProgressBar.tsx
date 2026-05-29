export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full h-[2px] bg-[color:var(--border)] relative overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-[color:var(--earth)] transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
