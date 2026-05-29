import { Link } from "@tanstack/react-router";
import { products, formatINR, imageFor, type Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="zoom-frame relative h-[360px] md:h-[420px] bg-[color:var(--cream)]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageFor(product.slug)})` }}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        <div className="absolute inset-0 flex items-end p-6">
          <div className="font-display italic text-6xl text-white/15 leading-none truncate">
            {product.name.split(" ")[0]}
          </div>
        </div>
        {product.customizable && (
          <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/90 bg-[color:var(--ink)]/40 backdrop-blur px-2 py-1">
            Customizable
          </div>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-[color:var(--muted-foreground)] line-clamp-2 max-w-xs">
            {product.shortDesc}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-sm">{formatINR(product.price)}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)] mt-1">
            {product.weight}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ items = products }: { items?: Product[] }) {
  return (
    <div className="grid gap-x-6 gap-y-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
