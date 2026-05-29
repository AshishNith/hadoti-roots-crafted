import { Minus, Plus } from "lucide-react";

export function QuantityControl({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center border border-[color:var(--ink)]">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="p-2 hover:bg-[color:var(--ink)] hover:text-white transition-colors"
        aria-label="Decrease"
      >
        <Minus size={14} />
      </button>
      <span className="font-mono px-4 text-sm">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="p-2 hover:bg-[color:var(--ink)] hover:text-white transition-colors"
        aria-label="Increase"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
