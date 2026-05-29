import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/HFButton";
import { formatINR } from "@/lib/data";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/customize/masala")({
  head: () => ({ meta: [{ title: "Build Your Masala — Hadoti Farms" }] }),
  component: MasalaBuilder,
});

const heats = [
  { id: "mild", label: "Mild", desc: "Cumin-led, gentle warmth." },
  { id: "medium", label: "Medium", desc: "Balanced, kitchen default." },
  { id: "bold", label: "Bold", desc: "Mathania chilli forward." },
];
const addons = [
  { id: "kasuri", label: "Kasuri Methi", price: 20 },
  { id: "saunf", label: "Toasted Saunf", price: 15 },
  { id: "anardana", label: "Anardana", price: 25 },
  { id: "blackcardamom", label: "Black Cardamom", price: 35 },
  { id: "stoneflower", label: "Stone Flower (Dagad Phool)", price: 30 },
];

function MasalaBuilder() {
  const [heat, setHeat] = useState("medium");
  const [picked, setPicked] = useState<string[]>([]);
  const [name, setName] = useState("");
  const add = useCart((s) => s.add);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const price = 120 + addons.filter((a) => picked.includes(a.id)).reduce((s, a) => s + a.price, 0);

  const onAdd = () => {
    add({
      id: `custom-masala-${Date.now()}`,
      name: name || "Custom Masala",
      price,
      weight: "100g",
      qty: 1,
      customization: `${heat} · ${picked.length} add-ons`,
      image: "/images/masala_blend.png",
    });
    toast.success("Masala added to cart");
  };

  return (
    <section className="pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-6">
          <Link to="/customize" className="story-link">Customize</Link> / Masala
        </nav>
        <h1 className="font-display text-5xl md:text-7xl leading-[1]">
          Calibrate the <span className="italic text-[color:var(--earth)]">heat.</span>
        </h1>

        <div className="mt-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Spice intensity</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {heats.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHeat(h.id)}
                    className={`text-left p-6 border ${heat === h.id ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}
                  >
                    <div className="font-display text-3xl">{h.label}</div>
                    <div className="text-xs text-[color:var(--muted-foreground)] mt-2">{h.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Add-ons</div>
              <div className="space-y-2">
                {addons.map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-center justify-between p-4 border cursor-pointer ${picked.includes(a.id) ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={picked.includes(a.id)}
                        onChange={() => toggle(a.id)}
                        className="accent-[color:var(--earth)] w-4 h-4"
                      />
                      <span>{a.label}</span>
                    </span>
                    <span className="font-mono text-xs">+{formatINR(a.price)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Name your masala</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Monsoon Garam Masala"
                className="w-full bg-transparent border-b border-[color:var(--ink)] py-3 font-display italic text-2xl outline-none focus:border-[color:var(--earth)] transition-colors"
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start border border-[color:var(--border)] bg-[color:var(--cream)] p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-6">Your blend</div>
            <div className="font-display italic text-3xl mb-6">{name || "Untitled Masala"}</div>
            <div className="space-y-2 font-mono text-xs">
              <Row label="Heat" value={heat} />
              <Row label="Add-ons" value={String(picked.length)} />
              <Row label="Weight" value="100g" />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em]">Estimate</span>
              <span className="font-display text-3xl">{formatINR(price)}</span>
            </div>
            <Button className="mt-6 w-full" onClick={onAdd}>Add to Cart</Button>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between capitalize">
      <span className="text-[color:var(--muted-foreground)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
