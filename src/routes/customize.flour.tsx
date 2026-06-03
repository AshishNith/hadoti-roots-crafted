import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { formatINR } from "@/lib/data";
import { Button } from "@/components/ui/HFButton";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { Wheat, Check, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/customize/flour")({
  head: () => ({ meta: [{ title: "Build Your Custom Flour Blend — Hadoti Farms" }] }),
  component: FlourCustomizer,
});

const grains = [
  { id: "wheat", name: "Sharbati Wheat", surcharge: 0, desc: "Premium regional wheat grown in Kota. Rich in protein, contains high-quality gluten for extra soft, fluffy chapatis.", protein: 12, carbs: 72, fiber: 3, calories: 340 },
  { id: "corn", name: "Maize / Corn (Makki)", surcharge: 10, desc: "100% pesticide-free regional maize. Naturally gluten-free, rich in beta-carotene and antioxidants. Adds sweet flavor and a rustic, crispy texture.", protein: 9, carbs: 74, fiber: 7, calories: 360 },
  { id: "jowar", name: "Sorghum (Jowar)", surcharge: 15, desc: "Traditional Hadoti jowar. Gluten-free, highly digestible, low glycemic index (GI), excellent for insulin sensitivity and steady energy.", protein: 10, carbs: 70, fiber: 10, calories: 350 },
  { id: "bajra", name: "Pearl Millet (Bajra)", surcharge: 12, desc: "Native millet packed with iron, zinc, and magnesium. Provides natural body warmth and metabolic support. Perfect for winter parathas.", protein: 11, carbs: 68, fiber: 9, calories: 360 },
  { id: "ragi", name: "Finger Millet (Ragi)", surcharge: 20, desc: "Organic ragi from Jhalawar. An exceptional calcium powerhouse, gluten-free, low-GI. Ideal for bone strength and natural weight control.", protein: 7, carbs: 73, fiber: 11, calories: 330 },
  { id: "chana", name: "Chickpea (Chana / Besan)", surcharge: 25, desc: "High-protein roasted Bengal gram. Low glycemic index, high lysine, adds a nutty aroma and excellent binding strength to multi-grain dough.", protein: 22, carbs: 58, fiber: 12, calories: 370 },
  { id: "oats", name: "Oats", surcharge: 30, desc: "Whole oat groats milled slow. Loaded with beta-glucan soluble fiber, which actively supports heart health, digestion, and controls appetite.", protein: 13, carbs: 66, fiber: 10, calories: 390 }
] as const;

type GrainId = typeof grains[number]["id"];

const presets = [
  { id: "wheat_100", label: "100% Sharbati Wheat", values: { wheat: 100, corn: 0, jowar: 0, bajra: 0, ragi: 0, chana: 0, oats: 0 } },
  { id: "diabetic", label: "Diabetic Friendly (Low-GI)", values: { wheat: 50, corn: 0, jowar: 25, bajra: 0, ragi: 0, chana: 15, oats: 10 } },
  { id: "gluten_free", label: "Gluten-Free Blend", values: { wheat: 0, corn: 0, jowar: 40, bajra: 0, ragi: 25, chana: 20, oats: 15 } },
  { id: "high_protein", label: "High Protein Blend", values: { wheat: 40, corn: 0, jowar: 0, bajra: 0, ragi: 10, chana: 30, oats: 20 } },
  { id: "weight_loss", label: "Weight Loss (High Fiber)", values: { wheat: 30, corn: 0, jowar: 25, bajra: 15, ragi: 0, chana: 0, oats: 30 } }
] as const;

const grindOptions = [
  { id: "fine", label: "Fine Ground", desc: "Soft chapatis & rotis" },
  { id: "medium", label: "Chakki Coarse", desc: "Rustic rotis & parathas" },
  { id: "coarse", label: "Coarse", desc: "Traditional dal baati & choorma" }
] as const;

const bags = [
  { id: "standard", label: "Standard Pouch", extra: 0 },
  { id: "gift", label: "Gift Wrap", extra: 50 },
  { id: "cloth", label: "Reusable Cloth Bag", extra: 30 }
] as const;

const packs = [
  { id: "1kg", label: "1kg Pack", weightKg: 1 },
  { id: "3kg", label: "3kg Pack", weightKg: 3 },
  { id: "5kg", label: "5kg Pack", weightKg: 5 }
] as const;

function FlourCustomizer() {
  const [step, setStep] = useState(0);
  const [amounts, setAmounts] = useState<Record<GrainId, number>>({
    wheat: 100,
    corn: 0,
    jowar: 0,
    bajra: 0,
    ragi: 0,
    chana: 0,
    oats: 0,
  });
  const [hoveredGrain, setHoveredGrain] = useState<GrainId>("wheat");
  const [grind, setGrind] = useState<typeof grindOptions[number]["id"]>("fine");
  const [bag, setBag] = useState<typeof bags[number]["id"]>("standard");
  const [packSize, setPackSize] = useState<typeof packs[number]["id"]>("3kg");
  const [name, setName] = useState("");
  const stepRef = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);

  useLayoutEffect(() => {
    if (!stepRef.current) return;
    gsap.fromTo(
      stepRef.current,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [step]);

  const totalPct = Object.values(amounts).reduce((sum, val) => sum + val, 0);

  // Dynamic calculations
  let basePricePerKg = 130; // standard Sharbati Wheat base rate
  let surchargeSum = 0;
  grains.forEach((g) => {
    surchargeSum += ((amounts[g.id] ?? 0) / 100) * g.surcharge;
  });
  const finalPricePerKg = basePricePerKg + surchargeSum;
  const activePack = packs.find((p) => p.id === packSize) ?? packs[1];
  const packagingExtra = bags.find((b) => b.id === bag)?.extra ?? 0;
  const price = Math.round(finalPricePerKg * activePack.weightKg + packagingExtra);

  // Dynamic nutrition profile
  let proteinPct = 0;
  let carbsPct = 0;
  let fiberPct = 0;
  let caloriesSum = 0;
  let hasGluten = false;

  grains.forEach((g) => {
    const pct = amounts[g.id] ?? 0;
    proteinPct += (pct / 100) * g.protein;
    carbsPct += (pct / 100) * g.carbs;
    fiberPct += (pct / 100) * g.fiber;
    caloriesSum += (pct / 100) * g.calories;
    if (g.id === "wheat" && pct > 0) {
      hasGluten = true;
    }
  });

  const getNutrition = () => ({
    protein: Math.round(proteinPct * 10) / 10,
    carbs: Math.round(carbsPct * 10) / 10,
    fiber: Math.round(fiberPct * 10) / 10,
    calories: Math.round(caloriesSum),
    gluten: hasGluten,
  });

  const nutri = getNutrition();

  const handlePresetSelect = (presetValues: Record<GrainId, number>) => {
    setAmounts({ ...presetValues });
  };

  const handleAdjustValue = (id: GrainId, val: number) => {
    const currentVal = amounts[id] ?? 0;
    const proposedVal = Math.max(0, Math.min(100, val));
    const difference = proposedVal - currentVal;

    if (totalPct + difference <= 100) {
      setAmounts((prev) => ({ ...prev, [id]: proposedVal }));
    } else {
      // If exceeds 100%, dynamically adjust other non-zero grains to keep total at 100%
      const newAmounts = { ...amounts, [id]: proposedVal };
      const overflow = (totalPct + difference) - 100;
      
      // Distribute subtraction across other non-selected, non-zero grains
      const otherGrains = grains.filter(g => g.id !== id && newAmounts[g.id] > 0);
      if (otherGrains.length > 0) {
        let remainingReduction = overflow;
        const totalOther = otherGrains.reduce((sum, g) => sum + newAmounts[g.id], 0);

        otherGrains.forEach(g => {
          const share = Math.round((newAmounts[g.id] / totalOther) * overflow);
          newAmounts[g.id] = Math.max(0, newAmounts[g.id] - share);
          remainingReduction -= share;
        });

        // Cleanup rounding residues
        if (remainingReduction !== 0) {
          const firstNonZero = otherGrains.find(g => newAmounts[g.id] > 0);
          if (firstNonZero) {
            newAmounts[firstNonZero.id] = Math.max(0, newAmounts[firstNonZero.id] - remainingReduction);
          }
        }
        setAmounts(newAmounts);
      } else {
        toast.error("Total mix cannot exceed 100%. Reduce other grains first.");
      }
    }
  };

  const goNext = () => {
    if (step === 0) {
      if (totalPct !== 100) {
        toast.error(`Please adjust ratios to equal exactly 100% (currently ${totalPct}%).`);
        return;
      }
    }
    setStep((s) => Math.min(2, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const onAdd = () => {
    if (totalPct !== 100) {
      toast.error(`Total percentage must equal exactly 100% (currently ${totalPct}%).`);
      return;
    }

    const grainBreakdown = grains
      .filter((g) => (amounts[g.id] ?? 0) > 0)
      .map((g) => `${amounts[g.id]}% ${g.name}`)
      .join(", ");

    const grindLabel = grindOptions.find((g) => g.id === grind)?.label;
    const bagLabel = bags.find((b) => b.id === bag)?.label;

    add({
      id: `custom-flour-${Date.now()}`,
      name: name.trim() || "Custom Flour Blend",
      price,
      weight: packSize,
      qty: 1,
      customization: `${grainBreakdown} · Grind: ${grindLabel} · Package: ${bagLabel}`,
      image: "/images/jowar_atta.png",
    });

    toast.success("Added Custom Flour Blend to cart!");
  };

  const hoveredGrainData = grains.find((g) => g.id === hoveredGrain) ?? grains[0];

  return (
    <section className="pt-32 pb-32 min-h-screen bg-[color:var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-6">
          <Link to="/customize" className="story-link">Customize</Link> / Custom Flour Blend
        </nav>
        <h1 className="font-display text-5xl md:text-7xl leading-[1] text-[color:var(--ink)]">
          Build your <span className="italic text-[color:var(--earth)]">flour blend.</span>
        </h1>

        {/* Stepper Status */}
        <div className="mt-10 flex items-center gap-6 max-w-md">
          {["Pick Grains", "Grind & Style", "Pack & Name"].map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs transition-colors duration-300 ${
                  step >= i
                    ? "bg-[color:var(--earth)] border-[color:var(--earth)] text-white"
                    : "border-[color:var(--border)] text-[color:var(--muted-foreground)]"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                  step === i ? "text-[color:var(--ink)] font-bold" : "text-[color:var(--muted-foreground)]"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Builder Content Area */}
        <div ref={stepRef} className="mt-14">
          {step === 0 && (
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Mix Sliders */}
              <div className="lg:col-span-7 space-y-8 bg-white border border-[color:var(--border)] p-8 rounded-sm shadow-sm">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)] mb-4">
                    Preset Health Blends
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((p) => {
                      const isMatching = Object.keys(p.values).every(
                        (key) => amounts[key as GrainId] === p.values[key as GrainId]
                      );
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePresetSelect(p.values)}
                          className={`font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-2.5 border rounded-sm transition-all duration-300 cursor-pointer ${
                            isMatching
                              ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]"
                              : "border-[color:var(--border)] hover:border-[color:var(--ink)] hover:bg-[color:var(--cream)]"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-[color:var(--border)] pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)]">
                      Calibrate Ingredients
                    </h3>
                    <div
                      className={`font-mono text-xs uppercase tracking-[0.15em] px-3 py-1 border ${
                        totalPct === 100
                          ? "text-emerald-700 bg-emerald-50 border-emerald-300"
                          : "text-red-700 bg-red-50 border-red-300"
                      }`}
                    >
                      Total: {totalPct}% / 100%
                    </div>
                  </div>

                  <div className="space-y-6">
                    {grains.map((g) => {
                      const pct = amounts[g.id] ?? 0;
                      return (
                        <div
                          key={g.id}
                          onMouseEnter={() => setHoveredGrain(g.id)}
                          onClick={() => setHoveredGrain(g.id)}
                          className={`p-4 border rounded-sm transition-all duration-200 cursor-pointer ${
                            hoveredGrain === g.id
                              ? "border-[color:var(--earth)] bg-[color:var(--cream)]/40"
                              : "border-transparent hover:border-[color:var(--border)]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-display font-medium text-base text-[color:var(--ink)]">
                                {g.name}
                              </span>
                              {g.surcharge > 0 && (
                                <span className="font-mono text-[9px] text-[color:var(--earth)] ml-2 border border-[color:var(--earth)]/30 px-1.5 py-0.5 rounded-sm">
                                  +{formatINR(g.surcharge)}/kg
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdjustValue(g.id, pct - 5);
                                }}
                                className="w-6 h-6 border border-[color:var(--ink)] flex items-center justify-center hover:bg-[color:var(--ink)] hover:text-white transition-colors cursor-pointer rounded-full"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="font-mono text-sm font-bold w-8 text-center">{pct}%</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdjustValue(g.id, pct + 5);
                                }}
                                className="w-6 h-6 border border-[color:var(--ink)] flex items-center justify-center hover:bg-[color:var(--ink)] hover:text-white transition-colors cursor-pointer rounded-full"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={pct}
                            onChange={(e) => handleAdjustValue(g.id, parseInt(e.target.value))}
                            className="w-full accent-[color:var(--earth)] cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Nutrition Label & Descriptions */}
              <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-36">
                {/* Ingredient details panel */}
                <div className="bg-white border border-[color:var(--border)] p-6 rounded-sm shadow-sm">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] mb-2">
                    Ingredient Detail (Hover to inspect)
                  </div>
                  <h4 className="font-display text-2xl text-[color:var(--earth)] mb-2">
                    {hoveredGrainData.name}
                  </h4>
                  <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed mb-4">
                    {hoveredGrainData.desc}
                  </p>
                  <div className="grid grid-cols-3 gap-2 border-t border-[color:var(--border)] pt-4 text-center font-mono text-[10px] uppercase tracking-[0.1em]">
                    <div>
                      <span className="block text-[color:var(--muted-foreground)] mb-1">Protein</span>
                      <strong className="text-xs font-bold text-[color:var(--ink)]">{hoveredGrainData.protein}%</strong>
                    </div>
                    <div>
                      <span className="block text-[color:var(--muted-foreground)] mb-1">Carbs</span>
                      <strong className="text-xs font-bold text-[color:var(--ink)]">{hoveredGrainData.carbs}%</strong>
                    </div>
                    <div>
                      <span className="block text-[color:var(--muted-foreground)] mb-1">Fiber</span>
                      <strong className="text-xs font-bold text-[color:var(--ink)]">{hoveredGrainData.fiber}%</strong>
                    </div>
                  </div>
                </div>

                {/* FDA Nutrition Facts Label */}
                <div className="border-[3px] border-black p-5 bg-white text-black font-sans shadow-md max-w-sm mx-auto">
                  <h2 className="font-sans text-3xl font-extrabold leading-none tracking-tight">Nutrition Facts</h2>
                  <div className="border-b-4 border-black my-1"></div>
                  <div className="text-xs font-semibold">1 serving per container</div>
                  <div className="flex justify-between font-bold text-sm">
                    <span>Serving size</span>
                    <span>100g</span>
                  </div>
                  <div className="border-b-[8px] border-black my-1"></div>
                  <div className="flex justify-between items-end leading-none">
                    <div>
                      <span className="text-[9px] font-bold block">Amount per serving</span>
                      <span className="text-2xl font-extrabold">Calories</span>
                    </div>
                    <span className="text-4xl font-extrabold leading-none">{nutri.calories}</span>
                  </div>
                  <div className="border-b-4 border-black my-1"></div>
                  <div className="text-right text-[10px] font-bold">% Daily Value*</div>

                  <div className="border-t border-gray-300 py-1 flex justify-between text-sm">
                    <span><strong>Total Carbohydrates</strong> {nutri.carbs}g</span>
                    <span><strong>{Math.round((nutri.carbs / 300) * 100)}%</strong></span>
                  </div>
                  {/* Carbohydrates Progress Bar */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${nutri.carbs}%` }} />
                  </div>

                  <div className="border-t border-gray-300 py-1 pl-4 flex justify-between text-sm">
                    <span>Dietary Fiber {nutri.fiber}g</span>
                    <span><strong>{Math.round((nutri.fiber / 28) * 100)}%</strong></span>
                  </div>
                  {/* Fiber Progress Bar */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${Math.min(100, nutri.fiber * 4.5)}%` }} />
                  </div>

                  <div className="border-t border-gray-300 py-1 flex justify-between text-sm">
                    <span><strong>Protein</strong> {nutri.protein}g</span>
                    <span><strong>{Math.round((nutri.protein / 50) * 100)}%</strong></span>
                  </div>
                  {/* Protein Progress Bar */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${Math.min(100, nutri.protein * 4.5)}%` }} />
                  </div>

                  <div className="border-t-[8px] border-black my-1"></div>
                  <div className="text-[9px] leading-tight text-gray-500">
                    * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                  </div>
                  <div className="mt-4 border-t border-dashed border-gray-400 pt-3 text-center">
                    {nutri.gluten ? (
                      <span className="inline-block text-[10px] font-bold font-mono uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded border border-red-200">
                        Contains Gluten
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
                        Gluten-Free
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-2xl mx-auto bg-white border border-[color:var(--border)] p-10 rounded-sm shadow-sm space-y-10">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)] mb-4">
                  Select Grind Texture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {grindOptions.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGrind(g.id)}
                      className={`text-left p-4 border rounded-sm flex flex-col justify-between min-h-[110px] transition-all duration-300 cursor-pointer ${
                        grind === g.id
                          ? "border-[color:var(--earth)] bg-[color:var(--cream)] shadow-sm"
                          : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                      }`}
                    >
                      <span className="font-display font-medium text-lg leading-tight">{g.label}</span>
                      <span className="text-[10px] text-[color:var(--muted-foreground)] leading-tight mt-1">
                        {g.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[color:var(--border)] pt-8">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)] mb-4">
                  Select Packaging Style
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {bags.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBag(b.id)}
                      className={`text-left p-4 border rounded-sm flex flex-col justify-between min-h-[110px] transition-all duration-300 cursor-pointer ${
                        bag === b.id
                          ? "border-[color:var(--earth)] bg-[color:var(--cream)] shadow-sm"
                          : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                      }`}
                    >
                      <span className="font-display font-medium text-lg leading-tight">{b.label}</span>
                      <span className="text-[10px] text-[color:var(--earth)] font-mono mt-1 font-semibold">
                        {b.extra > 0 ? `+${formatINR(b.extra)}` : "Included"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-xl mx-auto bg-white border border-[color:var(--border)] p-10 rounded-sm shadow-sm space-y-8">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)] mb-4">
                  Select Pack Weight
                </h3>
                <div className="flex gap-3">
                  {packs.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPackSize(p.id)}
                      className={`flex-1 font-mono text-xs uppercase tracking-[0.15em] px-4 py-3 border rounded-sm text-center transition-all cursor-pointer ${
                        packSize === p.id
                          ? "bg-[color:var(--earth)] text-white border-[color:var(--earth)] shadow-sm"
                          : "border-[color:var(--ink)] hover:bg-[color:var(--cream)]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[color:var(--border)] pt-8">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)] mb-4">
                  Name Your Custom Blend
                </h3>
                <input
                  type="text"
                  placeholder="e.g. Sharma Family Special"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[color:var(--cream)] border border-[color:var(--border)] p-4 font-display text-lg outline-none focus:border-[color:var(--ink)] transition-colors rounded-sm"
                />
                <p className="font-mono text-[9px] text-[color:var(--muted-foreground)] tracking-wide mt-2">
                  This custom formulation name will be printed on the pouch label at our Kota mill.
                </p>
              </div>

              {/* Dynamic Price Summary */}
              <div className="bg-[color:var(--cream)]/60 border border-[color:var(--border)] p-6 rounded-sm space-y-4">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)]">
                  Order Summary
                </h4>
                <div className="space-y-2 text-xs font-mono text-[color:var(--muted-foreground)]">
                  <div className="flex justify-between">
                    <span>Base Blend Price ({activePack.weightKg}kg)</span>
                    <span>{formatINR(Math.round(finalPricePerKg * activePack.weightKg))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging Extra ({bags.find((b) => b.id === bag)?.label})</span>
                    <span>{formatINR(packagingExtra)}</span>
                  </div>
                  <div className="flex justify-between border-t border-[color:var(--border)] pt-3 text-sm text-[color:var(--ink)] font-bold">
                    <span>Final Dynamic Price</span>
                    <span>{formatINR(price)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Navigation Controls */}
        <div className="mt-14 flex items-center justify-between border-t border-[color:var(--border)] pt-8 max-w-2xl mx-auto">
          {step > 0 ? (
            <button
              onClick={goBack}
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 2 ? (
            <button
              onClick={goNext}
              disabled={step === 0 && totalPct !== 100}
              className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer py-3.5 px-6 border ${
                step === 0 && totalPct !== 100
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-white"
              }`}
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <Button onClick={onAdd} className="px-8 py-4">
              Add to Cart · {formatINR(price)}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
