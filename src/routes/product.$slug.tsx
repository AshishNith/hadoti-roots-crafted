import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatINR, imageFor } from "@/lib/data";
import { getProductBySlug } from "@/lib/api-client";
import { Button } from "@/components/ui/HFButton";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  head: ({ loaderData }) => {
    const p = (loaderData as any)?.product;
    return {
      meta: [
        { title: p ? `${p.name} — Hadoti Farms` : "Product — Hadoti Farms" },
        { name: "description", content: p?.shortDesc ?? "Hadoti Farms" },
      ],
    };
  },
  loader: async ({ params }) => {
    try {
      const p = await getProductBySlug(params.slug);
      if (!p) throw notFound();
      return { product: p };
    } catch (e) {
      throw notFound();
    }
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

const glutenOptions = [
  { id: "regular", label: "Regular", desc: "100% Sharbati Wheat", surcharge: 0 },
  { id: "low", label: "Low-Gluten", desc: "Wheat blended with Jowar & Oats", surcharge: 15 },
  { id: "free", label: "Gluten-Free", desc: "Jowar, Ragi & Bengal Gram blend", surcharge: 30 },
] as const;

const carbOptions = [
  { id: "medium", label: "Balanced", desc: "Standard traditional recipe", surcharge: 0 },
  { id: "low", label: "Low-Carb", desc: "With defatted Soya & Almond flour", surcharge: 40 },
  { id: "fiber", label: "High-Fiber", desc: "With wheat bran & oat bran", surcharge: 10 },
] as const;

const boosterOptions = [
  { id: "flax", name: "Flax Seeds", price: 20, desc: "Rich in Omega-3" },
  { id: "chia", name: "Chia Seeds", price: 25, desc: "High fiber & calcium" },
  { id: "methi", name: "Methi Powder", price: 15, desc: "Blood sugar support" },
  { id: "moringa", name: "Moringa Powder", price: 20, desc: "Immunity boost" },
] as const;

const grindStyles = [
  { id: "fine", label: "Fine Ground", desc: "Soft chapatis & rotis" },
  { id: "medium", label: "Chakki Coarse", desc: "Rustic rotis & parathas" },
  { id: "coarse", label: "Coarse", desc: "Traditional dal baati & choorma" },
] as const;

function ProductPage() {
  const { product } = Route.useLoaderData() as any;
  const [weight, setWeight] = useState(product.weight);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "nutri" | "farm" | "rev">("desc");
  const add = useCart((s) => s.add);

  const [gluten, setGluten] = useState<"free" | "low" | "regular">("regular");
  const [carbs, setCarbs] = useState<"low" | "medium" | "fiber">("medium");
  const [boosters, setBoosters] = useState<string[]>([]);
  const [grind, setGrind] = useState<"fine" | "medium" | "coarse">("fine");

  const weights = product.weight === "Gift Box"
    ? []
    : product.customizable === "grain"
      ? ["1kg", "3kg", "5kg"]
      : product.category === "masalas"
        ? ["100g", "250g", "500g"]
        : product.category === "ration"
          ? ["3kg", "5kg", "8kg"]
          : ["250g", "500g", "1kg"];

  const defaultWeightG = parseWeightToG(product.weight);
  const selectedWeightG = parseWeightToG(weight);

  let price = defaultWeightG && selectedWeightG
    ? Math.round((product.price / defaultWeightG) * selectedWeightG)
    : product.price;

  if (product.customizable === "grain") {
    const weightKg = selectedWeightG ? selectedWeightG / 1000 : 1;
    const selectedGlutenSurcharge = glutenOptions.find((g) => g.id === gluten)?.surcharge ?? 0;
    const selectedCarbSurcharge = carbOptions.find((c) => c.id === carbs)?.surcharge ?? 0;
    const boostersCost = boosterOptions
      .filter((b) => boosters.includes(b.id))
      .reduce((sum, b) => sum + b.price, 0);

    price = Math.round((product.price + selectedGlutenSurcharge + selectedCarbSurcharge) * weightKg + boostersCost);
  }

  const getNutritionProfile = () => {
    let glutenPct = 100;
    let carbsPct = 70;
    let proteinPct = 12;
    let fiberPct = 8;

    if (gluten === "low") {
      glutenPct = 40;
      carbsPct = 62;
      proteinPct = 14;
      fiberPct = 11;
    } else if (gluten === "free") {
      glutenPct = 0;
      carbsPct = 58;
      proteinPct = 15;
      fiberPct = 12;
    }

    if (carbs === "low") {
      carbsPct = 28;
      proteinPct = 24;
      fiberPct = 12;
      if (gluten === "free") {
        carbsPct = 24;
        proteinPct = 26;
      }
    } else if (carbs === "fiber") {
      carbsPct = 52;
      fiberPct = 19;
      proteinPct = 13;
    }

    boosters.forEach((b) => {
      if (b === "flax") {
        proteinPct += 1.5;
        fiberPct += 2;
        carbsPct -= 0.5;
      }
      if (b === "chia") {
        proteinPct += 1;
        fiberPct += 2.5;
        carbsPct -= 0.5;
      }
      if (b === "methi") {
        fiberPct += 1;
      }
      if (b === "moringa") {
        proteinPct += 0.5;
        fiberPct += 0.5;
      }
    });

    return {
      gluten: glutenPct,
      carbs: carbsPct,
      protein: Math.round(proteinPct),
      fiber: Math.round(fiberPct),
    };
  };

  const nutri = getNutritionProfile();

  const onAdd = () => {
    let customizationStr = undefined;
    let itemId = `${product.slug}-${weight}`;

    if (product.customizable === "grain") {
      const gLabel = glutenOptions.find((o) => o.id === gluten)?.label;
      const cLabel = carbOptions.find((o) => o.id === carbs)?.label;
      const gStyle = grindStyles.find((o) => o.id === grind)?.label;
      const boosterNames = boosters
        .map((b) => boosterOptions.find((o) => o.id === b)?.name)
        .filter(Boolean);

      customizationStr = `Gluten: ${gLabel} · Diet: ${cLabel} · Grind: ${gStyle}${
        boosterNames.length ? ` · Boosters: ${boosterNames.join(", ")}` : ""
      }`;
      itemId = `${product.slug}-${weight}-${gluten}-${carbs}-${grind}-${boosters.join("-")}`;
    } else if (product.customizable) {
      customizationStr = "Standard blend";
    }

    add({
      id: itemId,
      name: product.name,
      price,
      weight,
      qty,
      customization: customizationStr,
      image: product.image || imageFor(product.slug),
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
                style={{ backgroundImage: `url(${product.image || imageFor(product.slug)})` }}
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

            {product.customizable === "grain" && (
              <div className="mt-8 border-t border-[color:var(--border)] pt-8 space-y-8 animate-fade-in">
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4 text-[color:var(--earth)]">
                    1. Gluten Level
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {glutenOptions.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGluten(g.id)}
                        className={`text-left p-3 border rounded-sm flex flex-col justify-between min-h-[95px] transition-all duration-300 cursor-pointer ${
                          gluten === g.id
                            ? "border-[color:var(--earth)] bg-[color:var(--cream)] shadow-sm"
                            : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                        }`}
                      >
                        <span className="font-display text-base leading-tight font-medium">{g.label}</span>
                        <div>
                          <span className="block text-[10px] text-[color:var(--muted-foreground)] leading-tight mt-1">
                            {g.desc}
                          </span>
                          <span className="block text-[10px] font-mono mt-1 text-[color:var(--earth)] font-semibold">
                            {g.surcharge > 0 ? `+${formatINR(g.surcharge)}/kg` : "Included"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4 text-[color:var(--earth)]">
                    2. Diet Focus & Carbs
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {carbOptions.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCarbs(c.id)}
                        className={`text-left p-3 border rounded-sm flex flex-col justify-between min-h-[95px] transition-all duration-300 cursor-pointer ${
                          carbs === c.id
                            ? "border-[color:var(--earth)] bg-[color:var(--cream)] shadow-sm"
                            : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                        }`}
                      >
                        <span className="font-display text-base leading-tight font-medium">{c.label}</span>
                        <div>
                          <span className="block text-[10px] text-[color:var(--muted-foreground)] leading-tight mt-1">
                            {c.desc}
                          </span>
                          <span className="block text-[10px] font-mono mt-1 text-[color:var(--earth)] font-semibold">
                            {c.surcharge > 0 ? `+${formatINR(c.surcharge)}/kg` : "Included"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4 text-[color:var(--earth)]">
                    3. Seed & Herb Boosters
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {boosterOptions.map((b) => {
                      const isPicked = boosters.includes(b.id);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() =>
                            setBoosters((prev) =>
                              isPicked ? prev.filter((id) => id !== b.id) : [...prev, b.id]
                            )
                          }
                          className={`text-left p-3 border rounded-sm flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            isPicked
                              ? "border-[color:var(--earth)] bg-[color:var(--cream)] shadow-sm"
                              : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                          }`}
                        >
                          <div>
                            <span className="font-display text-[15px] block leading-tight font-medium">{b.name}</span>
                            <span className="text-[10px] text-[color:var(--muted-foreground)] block leading-tight mt-0.5">
                              {b.desc}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-[color:var(--earth)] shrink-0 ml-2 font-semibold">
                            +{formatINR(b.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3 text-[color:var(--earth)]">
                    4. Grind Texture
                  </h3>
                  <div className="flex gap-2">
                    {grindStyles.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGrind(g.id)}
                        className={`flex-1 font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2.5 border rounded-sm text-center transition-all cursor-pointer ${
                          grind === g.id
                            ? "bg-[color:var(--earth)] text-white border-[color:var(--earth)]"
                            : "border-[color:var(--ink)] hover:bg-[color:var(--cream)]"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  <p className="font-mono text-[10px] text-[color:var(--muted-foreground)] mt-2 text-center">
                    {grindStyles.find((g) => g.id === grind)?.desc}
                  </p>
                </div>

                {/* Nutritional Composition */}
                <div className="bg-[color:var(--cream)]/60 border border-[color:var(--border)] p-4 rounded-sm">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-[color:var(--earth)] flex justify-between">
                    <span>Est. Nutritional Profile</span>
                    <span className="italic">Based on choices</span>
                  </h4>
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase tracking-[0.1em]">
                        <span>Gluten Index</span>
                        <span className="text-[color:var(--muted-foreground)] font-semibold">
                          {nutri.gluten === 100 ? "High (100%)" : nutri.gluten === 40 ? "Low (40%)" : "Gluten-Free (0%)"}
                        </span>
                      </div>
                      <div className="w-full bg-[color:var(--border)]/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[color:var(--earth)] h-full transition-all duration-500 ease-out"
                          style={{ width: `${nutri.gluten}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase tracking-[0.1em]">
                        <span>Carbohydrates</span>
                        <span className="text-[color:var(--muted-foreground)] font-semibold">{nutri.carbs}%</span>
                      </div>
                      <div className="w-full bg-[color:var(--border)]/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[color:var(--gold)] h-full transition-all duration-500 ease-out"
                          style={{ width: `${nutri.carbs}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase tracking-[0.1em]">
                        <span>Protein</span>
                        <span className="text-[color:var(--muted-foreground)] font-semibold">{nutri.protein}%</span>
                      </div>
                      <div className="w-full bg-[color:var(--border)]/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[color:var(--sage)] h-full transition-all duration-500 ease-out"
                          style={{ width: `${nutri.protein * 3}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase tracking-[0.1em]">
                        <span>Dietary Fiber</span>
                        <span className="text-[color:var(--muted-foreground)] font-semibold">{nutri.fiber}%</span>
                      </div>
                      <div className="w-full bg-[color:var(--border)]/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[color:var(--ink)]/40 h-full transition-all duration-500 ease-out"
                          style={{ width: `${nutri.fiber * 3}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
