import { useMemo } from "react";

type Slice = { id: string; label: string; value: number; color: string };

const colors = ["#8B5E3C", "#6B7F5E", "#C9A84C", "#a85a3a", "#7d8b6a", "#5e7250", "#b08456", "#3d4530"];

export function BlendDonutChart({
  slices,
  size = 220,
  thickness = 30,
}: {
  slices: { id: string; label: string; value: number }[];
  size?: number;
  thickness?: number;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  const segments: Slice[] = useMemo(() => {
    let acc = 0;
    return slices.map((s, i) => {
      const seg = { ...s, color: colors[i % colors.length] };
      acc += s.value;
      return seg;
    });
  }, [slices]);

  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} stroke="var(--border)" strokeWidth={thickness} fill="none" />
        {segments.map((s) => {
          const len = (s.value / total) * c;
          const dasharray = `${len} ${c - len}`;
          const dashoffset = -offset;
          offset += len;
          return (
            <circle
              key={s.id}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease" }}
            />
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" className="font-display" fontSize={28} fill="var(--ink)">
          {total}g
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontFamily="Space Mono" fontSize={10} fill="var(--muted-foreground)" letterSpacing="2">
          TOTAL
        </text>
      </svg>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {segments.map((s) => (
          <li key={s.id} className="flex items-center gap-2 font-mono text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
            <span className="capitalize">{s.label}</span>
            <span className="ml-auto text-[color:var(--muted-foreground)]">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
