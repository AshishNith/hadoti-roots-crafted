import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { formatINR, type DalOption } from "@/lib/data";
import { getDalOptions } from "@/lib/api-client";
import { BlendDonutChart } from "@/components/customizer/BlendDonutChart";
import { Button } from "@/components/ui/HFButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/customize/dal-mix")({
  head: () => ({ meta: [{ title: "Build Your Dal Mix — Hadoti Farms" }] }),
  loader: async () => {
    const options = await getDalOptions();
    return { options };
  },
  component: DalMixBuilder,
});

const grindOptions = [
  { id: "whole", label: "Whole Grain", desc: "Slow-cooked dishes." },
  { id: "split", label: "Split", desc: "Everyday dal." },
  { id: "coarse", label: "Coarse", desc: "Khichdi, dosa batter." },
  { id: "fine", label: "Fine", desc: "Soups, bhajiyas." },
];
const coatings = ["None", "Turmeric", "Castor Oil"];
const packs = ["500g", "1kg", "2kg"];
const bags = [
  { id: "standard", label: "Standard Pouch", extra: 0 },
  { id: "gift", label: "Gift Wrap", extra: 50 },
  { id: "cloth", label: "Reusable Cloth Bag", extra: 30 },
];

function DalMixBuilder() {
  const { options: dalOptions } = Route.useLoaderData() as { options: DalOption[] };
  const [step, setStep] = useState(0);
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [grind, setGrind] = useState("split");
  const [wash, setWash] = useState<"pre" | "un">("pre");
  const [coating, setCoating] = useState("None");
  const [pack, setPack] = useState("500g");
  const [bag, setBag] = useState("standard");
  const [name, setName] = useState("");
  const stepRef = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);

  useLayoutEffect(() => {
    if (!stepRef.current) return;
    gsap.fromTo(
      stepRef.current,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
    );
  }, [step]);

  const slices = dalOptions
    .filter((d) => (amounts[d.id] ?? 0) > 0)
    .map((d) => ({ id: d.id, label: d.name, value: amounts[d.id] ?? 0 }));
  const total = slices.reduce((s, x) => s + x.value, 0);
  const target = pack === "500g" ? 500 : pack === "1kg" ? 1000 : 2000;
  const extra = bags.find((b) => b.id === bag)?.extra ?? 0;
  const basePrice = Math.round(target * 0.32);
  const price = basePrice + extra;

  const setAmt = (id: string, v: number) =>
    setAmounts((a) => ({ ...a, [id]: Math.max(0, v) }));

  const goNext = () => setStep((s) => Math.min(2, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const onAdd = () => {
    const summary = slices.map((s) => `${Math.round((s.value / total) * 100)}% ${s.label}`).join(", ");
    add({
      id: `custom-dal-${Date.now()}`,
      name: name || "Custom Dal Mix",
      price,
      weight: pack,
      qty: 1,
      customization: `${summary} · ${grind}`,
    });
    toast.success("Your blend has been added");
  };

  return (
    <section className="pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-6">
          <Link to="/customize" className="story-link">Customize</Link> / Dal Mix
        </nav>
        <h1 className="font-display text-5xl md:text-7xl leading-[1]">
          Build your <span className="italic text-[color:var(--earth)]">dal mix.</span>
        </h1>

        {/* Stepper */}
        <div className="mt-12 flex items-center gap-6 max-w-md">
          {["Pick Dals", "Grind & Process", "Pack & Name"].map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs ${
                  step >= i ? "bg-[color:var(--earth)] border-[color:var(--earth)] text-white" : "border-[color:var(--border)]"
                }`}
              >
                {i + 1}
              </div>
              <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${step === i ? "text-[color:var(--ink)]" : "text-[color:var(--muted-foreground)]"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 max-w-md">
          <ProgressBar value={step + 1} max={3} />
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 overflow-hidden">
            <div ref={stepRef} key={step}>
              {step === 0 && (
                <div>
                  <p className="font-display italic text-2xl text-[color:var(--muted-foreground)] mb-8 max-w-xl">
                    Pick your dals. Aim for roughly {target}g total.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {dalOptions.map((d) => {
                      const v = amounts[d.id] ?? 0;
                      return (
                        <div
                          key={d.id}
                          className={`border p-5 transition-colors ${v > 0 ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="font-display text-2xl">{d.name}</div>
                              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">{d.desc}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                aria-label={`Decrease ${d.name}`}
                                onClick={() => setAmt(d.id, v - 25)}
                                className="w-8 h-8 border border-[color:var(--ink)] flex items-center justify-center hover:bg-[color:var(--ink)] hover:text-white transition-colors"
                              >
                                −
                              </button>
                              <span className="font-mono text-xs w-12 text-center">{v}g</span>
                              <button
                                aria-label={`Increase ${d.name}`}
                                onClick={() => setAmt(d.id, v + 25)}
                                className="w-8 h-8 border border-[color:var(--ink)] flex items-center justify-center hover:bg-[color:var(--ink)] hover:text-white transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-12">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Grind level</div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {grindOptions.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setGrind(g.id)}
                          className={`text-left p-5 border ${grind === g.id ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}
                        >
                          <div className="font-display text-xl">{g.label}</div>
                          <div className="text-xs text-[color:var(--muted-foreground)] mt-1">{g.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Wash</div>
                    <div className="flex gap-2">
                      {[["pre", "Pre-washed"], ["un", "Unwashed"]].map(([id, l]) => (
                        <button
                          key={id}
                          onClick={() => setWash(id as "pre" | "un")}
                          className={`font-mono text-xs uppercase tracking-[0.18em] px-5 py-3 border ${wash === id ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]" : "border-[color:var(--ink)]"}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Traditional coating</div>
                    <div className="flex flex-wrap gap-2">
                      {coatings.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCoating(c)}
                          className={`font-mono text-xs uppercase tracking-[0.18em] px-5 py-3 border ${coating === c ? "bg-[color:var(--earth)] text-white border-[color:var(--earth)]" : "border-[color:var(--ink)]"}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-12">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Pack size</div>
                    <div className="flex gap-2">
                      {packs.map((p) => (
                        <button
                          key={p}
                          onClick={() => setPack(p)}
                          className={`font-mono text-xs uppercase tracking-[0.18em] px-5 py-3 border ${pack === p ? "bg-[color:var(--earth)] text-white border-[color:var(--earth)]" : "border-[color:var(--ink)]"}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Bag style</div>
                    <div className="space-y-2">
                      {bags.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setBag(b.id)}
                          className={`w-full text-left flex items-center justify-between p-4 border ${bag === b.id ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}
                        >
                          <span>{b.label}</span>
                          <span className="font-mono text-xs text-[color:var(--muted-foreground)]">
                            {b.extra ? `+${formatINR(b.extra)}` : "Included"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4">Name your blend</div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="The Sunday Dal"
                      className="w-full bg-transparent border-b border-[color:var(--ink)] py-3 font-display italic text-2xl outline-none focus:border-[color:var(--earth)] transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-16 flex items-center justify-between">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="story-link font-mono text-xs uppercase tracking-[0.2em] disabled:opacity-30 disabled:no-underline"
              >
                ← Back
              </button>
              {step < 2 ? (
                <Button onClick={goNext} disabled={step === 0 && total === 0}>
                  Continue →
                </Button>
              ) : (
                <Button onClick={onAdd} disabled={total === 0}>
                  Add to Cart · {formatINR(price)}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-32 lg:self-start border border-[color:var(--border)] bg-[color:var(--cream)] p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-4">
              Your blend
            </div>
            {slices.length > 0 ? (
              <BlendDonutChart slices={slices} />
            ) : (
              <div className="font-display italic text-2xl text-[color:var(--muted-foreground)] py-12 text-center">
                Add dals to begin.
              </div>
            )}
            <div className="mt-6 border-t border-[color:var(--border)] pt-4 space-y-2 font-mono text-xs">
              <Row label="Total weight" value={`${total}g`} />
              <Row label="Grind" value={grind} />
              <Row label="Pack" value={pack} />
              <Row label="Bag" value={bag} />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em]">Estimate</span>
              <span className="font-display text-3xl">{formatINR(price)}</span>
            </div>
            {name && (
              <p className="mt-4 font-display italic text-xl text-[color:var(--earth)]">"{name}"</p>
            )}
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
