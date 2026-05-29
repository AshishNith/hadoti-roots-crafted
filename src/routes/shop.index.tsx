import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getProducts } from "@/lib/api-client";
import { ProductGrid } from "@/components/shop/ProductGrid";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — Hadoti Farms" },
      { name: "description", content: "Browse pesticide-free dals, masalas, ration boxes and gift hampers." },
    ],
  }),
  loader: async () => {
    const items = await getProducts();
    return { items };
  },
  component: ShopIndex,
});

const cats = [
  { id: "all", label: "All" },
  { id: "dals", label: "Dals" },
  { id: "masalas", label: "Masalas" },
  { id: "ration", label: "Ration" },
  { id: "hampers", label: "Hampers" },
  { id: "grains", label: "Grains" },
] as const;

function ShopIndex() {
  const { items: allProducts } = Route.useLoaderData();
  const [cat, setCat] = useState<(typeof cats)[number]["id"]>("all");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  let items = cat === "all" ? allProducts : allProducts.filter((p) => p.category === cat);
  if (sort === "low") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "high") items = [...items].sort((a, b) => b.price - a.price);

  return (
    <section className="pt-40 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-6">
          <Link to="/" className="story-link">Home</Link> / Shop
        </nav>
        <h1 className="font-display text-6xl md:text-8xl leading-[1]">
          The <span className="italic text-[color:var(--earth)]">pantry.</span>
        </h1>
        <p className="mt-6 max-w-xl text-[color:var(--muted-foreground)]">
          Every product traceable. Every blend customizable. Sourced direct from Kota, Bundi and Jhalawar.
        </p>

        <div className="mt-12 mb-16 flex flex-wrap items-center justify-between gap-6 border-y border-[color:var(--border)] py-5">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`font-mono text-[11px] uppercase tracking-[0.22em] px-4 py-2 border transition-colors ${
                  cat === c.id
                    ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]"
                    : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="font-mono text-xs uppercase tracking-[0.18em] bg-transparent border-b border-[color:var(--ink)] py-2 pr-6 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="low">Price · Low to High</option>
            <option value="high">Price · High to Low</option>
          </select>
        </div>

        <ProductGrid items={items} />
      </div>
    </section>
  );
}
