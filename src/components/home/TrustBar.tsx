import { Leaf, Sprout, Settings2, Package } from "lucide-react";

const items = [
  { icon: Leaf, label: "Farm Direct" },
  { icon: Sprout, label: "Pesticide Free" },
  { icon: Settings2, label: "Custom Orders" },
  { icon: Package, label: "Eco Packaged" },
];

export function TrustBar() {
  return (
    <section className="bg-[color:var(--cream)] border-y border-[color:var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3 justify-center md:justify-start">
            <it.icon size={16} className="text-[color:var(--earth)]" />
            <span className="font-mono uppercase text-[11px] tracking-[0.22em] text-[color:var(--ink)]">
              {it.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
