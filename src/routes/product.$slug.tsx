import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { products, formatINR, imageFor } from "@/lib/data";
import { Button } from "@/components/ui/HFButton";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: p ? `${p.name} — Hadoti Farms` : "Product — Hadoti Farms" },
        { name: "description", content: p?.shortDesc ?? "Hadoti Farms" },
      ],
    };
  },
  loader: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  component: ProductPage,
});

const parseWeightToG = (wStr: string): number | null => {
  const match = wStr.match(/^(\d+(?:\.\d+)?)\s*(g|kg)$/i);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  return unit === "kg" ? num * 1000 : num;
};

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [weight, setWeight] = useState(product.weight);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "nutri" | "farm" | "rev">("desc");
  const add = useCart((s) => s.add);

  const weights = product.weight === "Gift Box"
    ? []
    : product.category === "masalas"
      ? ["100g", "250g", "500g"]
      : product.category === "ration"
        ? ["3kg", "5kg", "8kg"]
        : ["250g", "500g", "1kg"];

  const defaultWeightG = parseWeightToG(product.weight);
  const selectedWeightG = parseWeightToG(weight);

  const price = defaultWeightG && selectedWeightG
    ? Math.round((product.price / defaultWeightG) * selectedWeightG)
    : product.price;

  const onAdd = () => {
    add({
      id: `${product.slug}-${weight}`,
      name: product.name,
      price,
      weight,
      qty,
      customization: product.customizable ? "Standard blend" : undefined,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-8">
          <Link to="/shop" className="story-link">Shop</Link> / {product.name}
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div>
            <div className="aspect-square w-full zoom-frame relative bg-[color:var(--cream)]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${imageFor(product.slug)})` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display italic text-[8rem] text-white/15 leading-none px-8 text-center">
                  {product.name.split(" ")[0]}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square cursor-pointer"
                  style={{
                    background: `linear-gradient(${160 + i * 20}deg,#a8895c,#3a2517)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sticky panel */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-3">
              {product.category}
            </div>
            <h1 className="font-display text-5xl md:text-6xl leading-[1]">{product.name}</h1>
            <p className="mt-5 text-[color:var(--muted-foreground)] max-w-md">{product.shortDesc}</p>

            {weights.length > 0 && (
              <div className="mt-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3">Weight</div>
                <div className="flex gap-2">
                  {weights.map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`font-mono text-xs uppercase tracking-[0.18em] px-5 py-2 border ${
                        weight === w
                          ? "bg-[color:var(--earth)] text-white border-[color:var(--earth)]"
                          : "border-[color:var(--ink)]"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.customizable === "dal" && (
              <Link
                to="/customize/dal-mix"
                className="mt-6 inline-block story-link font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)]"
              >
                Customize this blend →
              </Link>
            )}
            {product.customizable === "masala" && (
              <Link
                to="/customize/masala"
                className="mt-6 inline-block story-link font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)]"
              >
                Build your masala →
              </Link>
            )}

            <div className="mt-10 flex items-end justify-between">
              <div className="font-display text-4xl">{formatINR(price)}</div>
              <QuantityControl value={qty} onChange={setQty} />
            </div>

            <Button className="mt-6 w-full" onClick={onAdd}>
              Add to Cart
            </Button>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[color:var(--border)] pt-6">
              {["Farm Direct", "No Pesticides", "Ships in 3 days"].map((t) => (
                <div key={t} className="font-mono text-[10px] uppercase tracking-[0.18em] text-center text-[color:var(--muted-foreground)]">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-32">
          <div className="flex gap-8 border-b border-[color:var(--border)]">
            {[
              ["desc", "Description"],
              ["nutri", "Nutrition"],
              ["farm", "Farm Source"],
              ["rev", "Reviews"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id as typeof tab)}
                className={`font-mono text-xs uppercase tracking-[0.2em] pb-4 -mb-px border-b-2 ${
                  tab === id ? "border-[color:var(--earth)] text-[color:var(--ink)]" : "border-transparent text-[color:var(--muted-foreground)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="py-10 max-w-3xl font-display text-2xl italic leading-relaxed text-[color:var(--ink)]/80">
            {tab === "desc" && <p>{product.shortDesc} Slow-cleaned by hand, packed in jute-lined kraft, shipped within three days of order.</p>}
            {tab === "nutri" && <p>High in plant protein, naturally gluten-free, no additives or preservatives. Detailed nutrition panel inside the pack.</p>}
            {tab === "farm" && <p>Sourced from farmer collectives across Bundi and Kota — every batch traceable to its season and field.</p>}
            {tab === "rev" && <p>4.9 ★ across 248 reviews. "Tastes like home." — Aarti M., Bengaluru.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
