import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/HFButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatINR } from "@/lib/data";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/customize/ration-box")({
  head: () => ({ meta: [{ title: "Build Your Monthly Box — Hadoti Farms" }] }),
  component: RationBuilder,
});

const sizes = [
  { id: "s", label: "Small", weight: 3, price: 899 },
  { id: "m", label: "Medium", weight: 5, price: 1399 },
  { id: "l", label: "Large", weight: 8, price: 2099 },
];

const plans = [
  { id: "once", label: "One-time delivery", desc: "Standard ration box delivered once.", discount: 0, months: 1 },
  { id: "3month", label: "3-Month Prepaid Plan", desc: "3 deliveries (1 per month). Paid upfront.", discount: 0.05, months: 3 },
  { id: "6month", label: "6-Month Prepaid Plan", desc: "6 deliveries (1 per month). Paid upfront.", discount: 0.10, months: 6 },
  { id: "12month", label: "12-Month Prepaid Plan", desc: "12 deliveries (1 per month). Paid upfront.", discount: 0.15, months: 12 },
];

const catalog = [
  { id: "moong", label: "Moong Dal", cat: "Dals", w: 0.5 },
  { id: "urad", label: "Urad Dal", cat: "Dals", w: 0.5 },
  { id: "toor", label: "Toor Dal", cat: "Dals", w: 0.5 },
  { id: "jowar", label: "Jowar Atta", cat: "Grains", w: 1 },
  { id: "wheat", label: "Wheat Atta", cat: "Grains", w: 1 },
  { id: "rice", label: "Sona Masoori Rice", cat: "Rice", w: 1 },
  { id: "haldi", label: "Haldi Powder", cat: "Masalas", w: 0.1 },
  { id: "mirch", label: "Lal Mirch", cat: "Masalas", w: 0.1 },
];

function RationBuilder() {
  const [step, setStep] = useState(0);
  const [size, setSize] = useState(sizes[0]);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [sub, setSub] = useState<string>("once");
  const add = useCart((s) => s.add);

  const filled = catalog.reduce((s, c) => s + (picks[c.id] ?? 0) * c.w, 0);
  const remaining = Math.max(0, size.weight - filled);
  
  const selectedPlan = plans.find((p) => p.id === sub) || plans[0];
  const finalPrice = Math.round(size.price * selectedPlan.months * (1 - selectedPlan.discount));

  const onAdd = () => {
    const summary = Object.entries(picks)
      .filter(([, n]) => n > 0)
      .map(([id, n]) => `${catalog.find((c) => c.id === id)?.label} ×${n}`)
      .join(", ");
    add({
      id: `ration-${Date.now()}`,
      name: `${size.label} Ration Box`,
      price: finalPrice,
      weight: `${size.weight}kg`,
      qty: 1,
      customization: `${summary || "Empty box"} · ${selectedPlan.label}`,
      image: "/images/ration_box.png",
    });
    toast.success("Box added to cart");
  };

  return (
    <section className="pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-6">
          <Link to="/customize" className="story-link">Customize</Link> / Ration Box
        </nav>
        <h1 className="font-display text-5xl md:text-7xl leading-[1]">
          Your month, <span className="italic text-[color:var(--earth)]">packed.</span>
        </h1>

        <div className="mt-12 max-w-md">
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] mb-2 text-[color:var(--muted-foreground)]">
            <span>Step {step + 1} of 4</span>
            <span>{Math.round(((step + 1) / 4) * 100)}%</span>
          </div>
          <ProgressBar value={step + 1} max={4} />
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {step === 0 && (
              <div>
                <h2 className="font-display text-3xl mb-8">Pick your box size.</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSize(s)}
                      className={`text-left p-6 border ${size.id === s.id ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}
                    >
                      <div className="font-display text-3xl">{s.label}</div>
                      <div className="font-mono text-xs mt-2 text-[color:var(--muted-foreground)]">{s.weight}kg capacity</div>
                      <div className="font-display text-2xl mt-4">{formatINR(s.price)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="font-display text-3xl mb-2">Fill your box.</h2>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] mb-8">
                  {remaining.toFixed(1)}kg remaining of {size.weight}kg
                </p>
                <div className="mb-8"><ProgressBar value={filled} max={size.weight} /></div>
                <div className="space-y-6">
                  {["Dals", "Grains", "Rice", "Masalas"].map((cat) => (
                    <div key={cat}>
                      <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3 text-[color:var(--earth)]">{cat}</div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {catalog.filter((c) => c.cat === cat).map((c) => {
                          const v = picks[c.id] ?? 0;
                          return (
                            <div key={c.id} className="flex items-center justify-between border border-[color:var(--border)] p-4">
                              <div>
                                <div>{c.label}</div>
                                <div className="font-mono text-[10px] text-[color:var(--muted-foreground)]">{c.w}kg unit</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setPicks((p) => ({ ...p, [c.id]: Math.max(0, (p[c.id] ?? 0) - 1) }))} className="w-7 h-7 border border-[color:var(--ink)]">−</button>
                                <span className="font-mono text-xs w-6 text-center">{v}</span>
                                <button onClick={() => setPicks((p) => ({ ...p, [c.id]: (p[c.id] ?? 0) + 1 }))} className="w-7 h-7 border border-[color:var(--ink)]">+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="font-display text-3xl mb-8">Delivery Plan</h2>
                <div className="space-y-4">
                  {plans.map((p) => {
                    const priceForPlan = Math.round(size.price * p.months * (1 - p.discount));
                    const avgMonthly = Math.round(priceForPlan / p.months);
                    const isSelected = sub === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSub(p.id)}
                        className={`w-full text-left p-6 border transition-all duration-200 relative ${
                          isSelected
                            ? "border-[color:var(--earth)] bg-[color:var(--cream)] ring-1 ring-[color:var(--earth)]"
                            : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                        }`}
                      >
                        {p.discount > 0 && (
                          <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.12em] bg-[color:var(--earth)] text-white px-2 py-0.5 rounded-sm">
                            Save {p.discount * 100}%
                          </span>
                        )}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="font-display text-2xl">{p.label}</div>
                            <div className="text-sm text-[color:var(--muted-foreground)] mt-1">{p.desc}</div>
                          </div>
                          <div className="text-right shrink-0">
                            {p.months > 1 ? (
                              <>
                                <div className="font-display text-2xl">{formatINR(priceForPlan)}</div>
                                <div className="font-mono text-[10px] text-[color:var(--muted-foreground)] mt-0.5">
                                  {formatINR(avgMonthly)} / month
                                </div>
                              </>
                            ) : (
                              <div className="font-display text-2xl">{formatINR(priceForPlan)}</div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="font-display text-3xl mb-8">Looks good?</h2>
                <p className="font-display italic text-2xl text-[color:var(--muted-foreground)] max-w-lg">
                  You can edit this box anytime from your account.
                </p>
              </div>
            )}

            <div className="mt-16 flex items-center justify-between">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="story-link font-mono text-xs uppercase tracking-[0.2em] disabled:opacity-30 disabled:no-underline">
                ← Back
              </button>
              {step < 3 ? (
                <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>Continue →</Button>
              ) : (
                <Button onClick={onAdd}>Add to Cart · {formatINR(finalPrice)}</Button>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start border border-[color:var(--border)] bg-[color:var(--cream)] p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-4">Summary</div>
            <div className="font-display text-3xl">{size.label} Box</div>
            <div className="font-mono text-xs text-[color:var(--muted-foreground)] mt-1">{size.weight}kg capacity</div>
            <div className="mt-6 border-t border-[color:var(--border)] pt-4 space-y-2 font-mono text-xs">
              <Row label="Filled" value={`${filled.toFixed(1)}kg`} />
              <Row label="Plan" value={selectedPlan.label} />
              {selectedPlan.months > 1 && (
                <Row label="Avg. Monthly" value={`${formatINR(Math.round(finalPrice / selectedPlan.months))}/mo`} />
              )}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
                {selectedPlan.months > 1 ? "Upfront Total" : "Estimate"}
              </span>
              <span className="font-display text-3xl">{formatINR(finalPrice)}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-[color:var(--muted-foreground)]">{label}</span><span>{value}</span></div>;
}
