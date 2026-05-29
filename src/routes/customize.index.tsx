import { createFileRoute, Link } from "@tanstack/react-router";
import { Wheat, Flame, Package, Gift } from "lucide-react";

export const Route = createFileRoute("/customize/")({
  head: () => ({
    meta: [
      { title: "Customize — Hadoti Farms" },
      { name: "description", content: "Build a dal mix, masala blend, ration box or gift hamper, your way." },
    ],
  }),
  component: CustomizeIndex,
});

const tiles = [
  { to: "/customize/dal-mix", icon: Wheat, title: "Dal Mix", tag: "3 steps", desc: "Pick up to six dals. Set grind. Name your blend." },
  { to: "/customize/masala", icon: Flame, title: "Masala Blender", tag: "Quick", desc: "Dial in heat, add-ons, ground to order." },
  { to: "/product/custom-flour-blend", icon: Wheat, title: "Custom Flour Blend", tag: "Tailored nutrition", desc: "Calibrate gluten, carbs, and seed booster shots." },
  { to: "/customize/ration-box", icon: Package, title: "Monthly Ration Box", tag: "Subscribe & save", desc: "A month of staples, built around you." },
  { to: "/customize/gift-hamper", icon: Gift, title: "Gift Hamper", tag: "Wrapped in jute", desc: "Curate a festival box for someone." },
];

function CustomizeIndex() {
  return (
    <section className="pt-40 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-6">Customize</div>
        <h1 className="font-display text-6xl md:text-8xl leading-[1] max-w-3xl">
          Every order, <span className="italic">your way.</span>
        </h1>
        <p className="mt-6 max-w-xl text-[color:var(--muted-foreground)]">
          Choose what you want to build. Each customizer takes under three minutes.
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiles.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group border border-[color:var(--border)] hover:border-[color:var(--ink)] bg-[color:var(--cream)] p-10 flex flex-col gap-10 min-h-[300px] transition-colors"
            >
              <div className="flex items-center justify-between">
                <t.icon size={28} className="text-[color:var(--earth)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                  {t.tag}
                </span>
              </div>
              <div className="mt-auto">
                <h2 className="font-display text-4xl md:text-5xl">{t.title}</h2>
                <p className="mt-3 text-[color:var(--muted-foreground)] max-w-sm">{t.desc}</p>
                <div className="mt-6 overflow-hidden h-5">
                  <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)] translate-y-5 group-hover:translate-y-0 transition-transform duration-500">
                    Start →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
