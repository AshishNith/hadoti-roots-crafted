import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getProducts } from "@/lib/api-client";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { dalOptions } from "@/lib/data";

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
  const [selectedDal, setSelectedDal] = useState<string | null>(null);

  let items = cat === "all" 
    ? allProducts 
    : cat === "dals" && selectedDal 
    ? allProducts.filter((p) => 
        p.category === "dals" && 
        (selectedDal === "panchratan" 
          ? p.slug === "hadoti-panchratan-dal" 
          : p.slug.includes(selectedDal))
      )
    : allProducts.filter((p) => p.category === cat);
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
            {cats.map((c) => {
              if (c.id === "dals") {
                const activeDalName = selectedDal === "panchratan"
                  ? "Panchtantra"
                  : dalOptions.find((d) => d.id === selectedDal)?.name;
                return (
                  <div key={c.id} className="relative group">
                    <button
                      onClick={() => {
                        setCat("dals");
                        setSelectedDal(null);
                      }}
                      className={`font-mono text-[11px] uppercase tracking-[0.22em] px-4 py-2 border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        cat === "dals"
                          ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]"
                          : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                      }`}
                    >
                      <span>{activeDalName ? `Dals: ${activeDalName}` : "Dals"}</span>
                      <span className="text-[8px] transition-transform duration-200 group-hover:rotate-180">▼</span>
                    </button>
                    <div className="absolute left-0 top-full pt-1 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-[color:var(--cream)] border border-[color:var(--ink)] py-2 shadow-xl">
                        <button
                          onClick={() => {
                            setCat("dals");
                            setSelectedDal(null);
                          }}
                          className="w-full text-left font-mono text-[10px] uppercase tracking-[0.18em] px-4 py-2 hover:bg-[color:var(--ink)] hover:text-white transition-colors cursor-pointer"
                        >
                          All Dals
                        </button>
                        <button
                          onClick={() => {
                            setCat("dals");
                            setSelectedDal("panchratan");
                          }}
                          className={`w-full text-left font-mono text-[10px] uppercase tracking-[0.18em] px-4 py-2 hover:bg-[color:var(--ink)] hover:text-white transition-colors cursor-pointer ${
                            selectedDal === "panchratan" ? "text-[color:var(--earth)] font-bold" : ""
                          }`}
                        >
                          Panchtantra Dal
                        </button>
                        {dalOptions.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              setCat("dals");
                              setSelectedDal(d.id);
                            }}
                            className={`w-full text-left font-mono text-[10px] uppercase tracking-[0.18em] px-4 py-2 hover:bg-[color:var(--ink)] hover:text-white transition-colors cursor-pointer ${
                              selectedDal === d.id ? "text-[color:var(--earth)] font-bold" : ""
                            }`}
                          >
                            {d.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setCat(c.id);
                    setSelectedDal(null);
                  }}
                  className={`font-mono text-[11px] uppercase tracking-[0.22em] px-4 py-2 border transition-colors cursor-pointer ${
                    cat === c.id
                      ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]"
                      : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
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
