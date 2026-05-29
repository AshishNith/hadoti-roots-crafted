import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProducts } from "@/lib/api-client";
import { ProductGrid } from "@/components/shop/ProductGrid";

const categoryLabels: Record<string, string> = {
  dals: "Dals & Pulses",
  masalas: "Masalas",
  ration: "Ration Boxes",
  hampers: "Gift Hampers",
  grains: "Grains & Atta",
};

export const Route = createFileRoute("/shop/$category")({
  head: ({ params }) => ({
    meta: [
      { title: `${categoryLabels[params.category] ?? "Shop"} — Hadoti Farms` },
      { name: "description", content: `Shop ${categoryLabels[params.category] ?? "products"} from Hadoti Farms.` },
    ],
  }),
  loader: async ({ params }) => {
    if (!categoryLabels[params.category]) throw notFound();
    const allProducts = await getProducts();
    const items = allProducts.filter((p) => p.category === params.category);
    return { category: params.category, items };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, items } = Route.useLoaderData();
  return (
    <section className="pt-40 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-6">
          <Link to="/" className="story-link">Home</Link> /{" "}
          <Link to="/shop" className="story-link">Shop</Link> / {categoryLabels[category]}
        </nav>
        <h1 className="font-display text-6xl md:text-8xl leading-[1]">
          <span className="italic text-[color:var(--earth)]">{categoryLabels[category]}</span>
        </h1>
        <div className="mt-16">
          <ProductGrid items={items} />
        </div>
      </div>
    </section>
  );
}
