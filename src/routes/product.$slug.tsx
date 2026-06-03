import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { formatINR, imageFor } from "@/lib/data";
import { getProductBySlug, getProductReviews, createProductReview } from "@/lib/api-client";
import { Button } from "@/components/ui/HFButton";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
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
  const [tab, setTab] = useState<"desc" | "nutri" | "farm">("desc");
  const add = useCart((s) => s.add);

  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (user && user.displayName) {
      setReviewName(user.displayName);
    } else {
      setReviewName("");
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    async function loadReviews() {
      setReviewsLoading(true);
      try {
        const data = await getProductReviews(product.slug);
        if (active) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        if (active) {
          setReviewsLoading(false);
        }
      }
    }
    loadReviews();
    return () => {
      active = false;
    };
  }, [product.slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review.");
      setTimeout(() => {
        window.location.href = `/account?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 1500);
      return;
    }
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmittingReview(true);
    try {
      const newReview = await createProductReview({
        productSlug: product.slug,
        userUid: user.uid,
        userName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      toast.success("Review submitted successfully!");
      setReviews((prev) => [newReview, ...prev]);
      setReviewComment("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, pct };
  });

  const [gluten, setGluten] = useState<"free" | "low" | "regular">("regular");
  const [carbs, setCarbs] = useState<"low" | "medium" | "fiber">("medium");
  const [boosters, setBoosters] = useState<string[]>([]);
  const [grind, setGrind] = useState<"fine" | "medium" | "coarse">("fine");
  const [dalGrind, setDalGrind] = useState<"whole" | "split">("split");

  const weights = product.weight === "Gift Box"
    ? []
    : product.customizable === "grain" || product.customizable === "single-flour"
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

  let originalPrice = product.originalPrice 
    ? (defaultWeightG && selectedWeightG
      ? Math.round((product.originalPrice / defaultWeightG) * selectedWeightG)
      : product.originalPrice)
    : 0;

  if (product.customizable === "grain") {
    const weightKg = selectedWeightG ? selectedWeightG / 1000 : 1;
    const selectedGlutenSurcharge = glutenOptions.find((g) => g.id === gluten)?.surcharge ?? 0;
    const selectedCarbSurcharge = carbOptions.find((c) => c.id === carbs)?.surcharge ?? 0;
    const boostersCost = boosterOptions
      .filter((b) => boosters.includes(b.id))
      .reduce((sum, b) => sum + b.price, 0);

    price = Math.round((product.price + selectedGlutenSurcharge + selectedCarbSurcharge) * weightKg + boostersCost);
    if (product.originalPrice) {
      originalPrice = Math.round((product.originalPrice + selectedGlutenSurcharge + selectedCarbSurcharge) * weightKg + boostersCost);
    }
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
    } else if (product.customizable === "single-dal") {
      customizationStr = `Grind: ${dalGrind === "whole" ? "Whole" : "Split"}`;
      itemId = `${product.slug}-${weight}-${dalGrind}`;
    } else if (product.customizable === "single-flour") {
      const gStyle = grindStyles.find((o) => o.id === grind)?.label;
      customizationStr = `Grind: ${gStyle}`;
      itemId = `${product.slug}-${weight}-${grind}`;
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

            {product.customizable === "grain" ? (
              <div className="mt-8 border-t border-[color:var(--border)] pt-8 space-y-6">
                <div className="bg-[color:var(--cream)] border border-[color:var(--ink)] p-6 rounded-sm">
                  <h3 className="font-display text-xl mb-2">Build Your Custom Blend</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
                    This specialty flour is ground-to-order at our Kota mill. Choose from Sharbati Wheat, Maize, Jowar, Ragi, Bajra, Oats, and Chana to create your family's perfect blend. Calibrate protein, carbs, and fiber in real-time.
                  </p>
                  <Link
                    to="/customize/flour"
                    className="mt-6 w-full inline-block bg-[color:var(--ink)] text-white text-center font-mono text-xs uppercase tracking-[0.2em] py-4 hover:bg-[color:var(--earth)] transition-colors cursor-pointer"
                  >
                    Customize Your Flour Blend →
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {weights.length > 0 && (
                  <div className="mt-8">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3">Weight</div>
                    <div className="flex flex-wrap gap-2">
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

                {product.customizable === "single-dal" && (
                  <div className="mt-8 border-t border-[color:var(--border)] pt-8 space-y-6 animate-fade-in">
                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4 text-[color:var(--earth)]">
                        Grind Texture
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "whole", label: "Whole" },
                          { id: "split", label: "Split" },
                        ].map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setDalGrind(g.id as "whole" | "split")}
                            className={`flex-1 font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2.5 border rounded-sm text-center transition-all cursor-pointer ${
                              dalGrind === g.id
                                ? "bg-[color:var(--earth)] text-white border-[color:var(--earth)]"
                                : "border-[color:var(--ink)] hover:bg-[color:var(--cream)]"
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {product.customizable === "single-flour" && (
                  <div className="mt-8 border-t border-[color:var(--border)] pt-8 space-y-6 animate-fade-in">
                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] mb-4 text-[color:var(--earth)]">
                        Grind Style
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                      <p className="font-mono text-[9px] text-[color:var(--muted-foreground)] mt-2 text-center">
                        {grindStyles.find((g) => g.id === grind)?.desc}
                      </p>
                    </div>
                  </div>
                )}

                {/* Stock status indicator */}
                <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                    product.stock === undefined || product.stock > 3 
                      ? "bg-[color:var(--sage)]" 
                      : product.stock > 0 
                        ? "bg-[color:var(--gold)] animate-pulse" 
                        : "bg-[color:var(--destructive)]"
                  }`} />
                  <span className={
                    product.stock === undefined || product.stock > 3 
                      ? "text-[color:var(--muted-foreground)]" 
                      : product.stock > 0 
                        ? "text-[color:var(--gold)] font-bold" 
                        : "text-[color:var(--destructive)] font-bold"
                  }>
                    {product.stock === undefined 
                      ? "In Stock" 
                      : product.stock > 0 
                        ? product.stock <= 3 
                          ? `Only ${product.stock} left in stock - order soon!` 
                          : "In Stock" 
                        : "Out of Stock"}
                  </span>
                </div>

                <div className="mt-10 flex items-end justify-between">
                  <div className="flex flex-col items-start gap-1">
                    {originalPrice > price && (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base line-through text-[color:var(--muted-foreground)]">
                          {formatINR(originalPrice)}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.1em] text-emerald-700 font-medium">
                          ({Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF)
                        </span>
                      </div>
                    )}
                    <div className="font-display text-4xl">{formatINR(price)}</div>
                  </div>
                  <QuantityControl value={qty} onChange={setQty} />
                </div>

                <Button 
                  className="mt-6 w-full" 
                  onClick={onAdd}
                  disabled={product.stock !== undefined && product.stock <= 0}
                >
                  {product.stock !== undefined && product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </>
            )}

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[color:var(--border)] pt-6">
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
          <div className="flex gap-8 border-b border-[color:var(--border)] overflow-x-auto scrollbar-none whitespace-nowrap">
            {[
              ["desc", "Description"],
              ["nutri", "Nutrition"],
              ["farm", "Farm Source"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id as typeof tab)}
                className={`font-mono text-xs uppercase tracking-[0.2em] pb-4 -mb-px border-b-2 shrink-0 ${
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
          </div>
        </div>

        {/* Dedicated Customer Reviews Section */}
        <div className="mt-24 border-t border-[color:var(--border)] pt-16">
          <div className="mb-12 text-left">
            <h2 className="font-display text-4xl md:text-5xl">
              Customer <span className="italic text-[color:var(--earth)]">Reviews</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-12 gap-12 mt-4 items-start text-left">
            {/* Summary & Reviews List */}
            <div className="md:col-span-7 space-y-8">
              {/* Summary Section */}
              <div className="border border-[color:var(--border)] bg-[color:var(--cream)] p-6 rounded-sm flex flex-col sm:flex-row justify-between items-center sm:items-stretch gap-6">
                {/* Average rating */}
                <div className="flex flex-col justify-center items-center sm:items-start shrink-0">
                  <span className="font-display text-6xl font-medium text-[color:var(--ink)]">
                    {avgRating ?? "0.0"}
                  </span>
                  <div className="flex items-center gap-0.5 text-[color:var(--gold)] mt-2">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starVal = idx + 1;
                      const ratingNum = avgRating ? parseFloat(avgRating) : 0;
                      const isFull = ratingNum >= starVal;
                      return (
                        <Star
                          key={idx}
                          size={18}
                          fill={isFull ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={isFull ? 0 : 1}
                          className={isFull ? "text-[color:var(--gold)]" : "text-[color:var(--muted-foreground)]"}
                        />
                      );
                    })}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--muted-foreground)] mt-3">
                    Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>

                {/* Distribution bars */}
                <div className="flex-1 space-y-2 max-w-xs w-full flex flex-col justify-center">
                  {distribution.map(({ stars, count, pct }) => (
                    <div key={stars} className="flex items-center gap-3 text-xs font-mono text-[color:var(--muted-foreground)]">
                      <span className="w-8 text-right">{stars} ★</span>
                      <div className="flex-grow h-2 bg-[color:var(--bg)] border border-[color:var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[color:var(--earth)] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-left">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--earth)] border-b border-[color:var(--border)] pb-2">
                  Recent Reviews ({reviews.length})
                </h3>
                {reviewsLoading ? (
                  <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] animate-pulse">
                    Loading reviews...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-12 text-center font-display italic text-lg text-[color:var(--muted-foreground)] border border-dashed border-[color:var(--border)] rounded-sm">
                    No reviews yet. Be the first to share your thoughts on this product.
                  </div>
                ) : (
                  <div className="divide-y divide-[color:var(--border)]">
                    {reviews.map((r, i) => (
                      <div key={r._id || i} className={`${i > 0 ? "pt-6" : ""} pb-6 space-y-3`}>
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-xs uppercase tracking-[0.15em] text-[color:var(--ink)] font-bold">
                            {r.userName}
                          </div>
                          <div className="font-mono text-[10px] text-[color:var(--muted-foreground)]">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }) : "Just now"}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-[color:var(--gold)]">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              size={12}
                              fill={idx < r.rating ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth={idx < r.rating ? 0 : 1}
                              className={idx < r.rating ? "text-[color:var(--gold)]" : "text-[color:var(--border)]"}
                            />
                          ))}
                        </div>
                        <p className="font-body text-sm leading-relaxed text-[color:var(--ink)]/90">
                          {r.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Review Form */}
            <div className="md:col-span-5 md:sticky md:top-36">
              <div className="border border-[color:var(--border)] bg-[color:var(--cream)] p-6 rounded-sm">
                <h3 className="font-display text-2xl mb-4 text-[color:var(--ink)]">
                  Write a Review
                </h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {!user && (
                    <div className="font-mono text-[10px] text-[color:var(--earth)] bg-[color:var(--earth)]/5 border border-[color:var(--earth)]/20 p-3 leading-relaxed rounded-sm text-center">
                      Note: You must be signed in to submit a review. Clicking submit will redirect you to the login page.
                    </div>
                  )}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-sm px-4 py-2.5 font-body text-sm text-[color:var(--ink)] focus:outline-none focus:border-[color:var(--earth)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] mb-2">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const ratingVal = idx + 1;
                        const isFilled = ratingVal <= reviewRating;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setReviewRating(ratingVal)}
                            className="p-1 -ml-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                          >
                            <Star
                              size={22}
                              fill={isFilled ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth={isFilled ? 0 : 1}
                              className={isFilled ? "text-[color:var(--gold)]" : "text-[color:var(--muted-foreground)]"}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] mb-2">
                      Comments
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-sm px-4 py-2.5 font-body text-sm text-[color:var(--ink)] focus:outline-none focus:border-[color:var(--earth)] transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full justify-center"
                    disabled={submittingReview}
                  >
                    {submittingReview 
                      ? "Submitting..." 
                      : user 
                      ? "Submit Review" 
                      : "Sign In to Submit Review"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
