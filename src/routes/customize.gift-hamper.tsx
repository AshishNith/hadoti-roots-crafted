import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/HFButton";
import { formatINR } from "@/lib/data";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/customize/gift-hamper")({
  head: () => ({ meta: [{ title: "Build a Gift Hamper — Hadoti Farms" }] }),
  component: HamperBuilder,
});

const themes = [
  { id: "festive", label: "Festive", desc: "Diwali, Holi, Raksha Bandhan." },
  { id: "wellness", label: "Wellness", desc: "Sprouts, kulthi, jowar." },
  { id: "corporate", label: "Corporate", desc: "Sleek jute, debossed logo." },
];
const sizes = [
  { id: "petite", label: "Petite", price: 999 },
  { id: "classic", label: "Classic", price: 1499 },
  { id: "grand", label: "Grand", price: 2499 },
];

function HamperBuilder() {
  const [theme, setTheme] = useState(themes[0]);
  const [size, setSize] = useState(sizes[1]);
  const [note, setNote] = useState("");
  const add = useCart((s) => s.add);

  const onAdd = () => {
    add({
      id: `hamper-${Date.now()}`,
      name: `${theme.label} Gift Hamper · ${size.label}`,
      price: size.price,
      weight: "Gift Box",
      qty: 1,
      customization: note ? `Note: "${note}"` : undefined,
      image: "/images/gift_hamper.png",
    });
    toast.success("Hamper added to cart");
  };

  return (
    <section className="pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-6">
          <Link to="/customize" className="story-link">Customize</Link> / Gift Hamper
        </nav>
        <h1 className="font-display text-5xl md:text-7xl leading-[1]">
          Wrapped in <span className="italic text-[color:var(--earth)]">jute.</span>
        </h1>

        <div className="mt-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Theme</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button key={t.id} onClick={() => setTheme(t)} className={`text-left p-5 border ${theme.id === t.id ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}>
                    <div className="font-display text-2xl">{t.label}</div>
                    <div className="text-xs text-[color:var(--muted-foreground)] mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Size</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {sizes.map((s) => (
                  <button key={s.id} onClick={() => setSize(s)} className={`text-left p-5 border ${size.id === s.id ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}>
                    <div className="font-display text-2xl">{s.label}</div>
                    <div className="font-display text-xl mt-2">{formatINR(s.price)}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Handwritten note</div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="From our kitchen to yours..."
                className="w-full bg-transparent border border-[color:var(--ink)] p-4 font-display italic text-xl outline-none focus:border-[color:var(--earth)] transition-colors"
              />
            </div>
          </div>
          <aside className="lg:sticky lg:top-32 lg:self-start border border-[color:var(--border)] bg-[color:var(--cream)] p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-4">Summary</div>
            <div className="font-display text-3xl">{theme.label} · {size.label}</div>
            {note && <p className="font-display italic mt-4 text-[color:var(--ink)]/70">"{note}"</p>}
            <div className="mt-6 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em]">Total</span>
              <span className="font-display text-3xl">{formatINR(size.price)}</span>
            </div>
            <Button className="mt-6 w-full" onClick={onAdd}>Add to Cart</Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
