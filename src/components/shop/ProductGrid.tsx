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
          style={{ backgroundImage: `url(${product.image || imageFor(product.slug)})` }}
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
        {product.stock !== undefined && product.stock <= 0 ? (
          <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/90 bg-[color:var(--destructive)] px-2.5 py-1 z-10">
            Out of Stock
          </div>
        ) : product.stock !== undefined && product.stock <= 3 ? (
          <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.22em] text-black bg-[color:var(--gold)] px-2.5 py-1 z-10 animate-pulse">
            Low Stock
          </div>
        ) : null}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-[color:var(--muted-foreground)] line-clamp-2 max-w-xs">
            {product.shortDesc}
          </p>
        </div>
        <div className="text-right shrink-0">
          {product.originalPrice && product.originalPrice > product.price ? (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="font-mono text-xs line-through text-[color:var(--muted-foreground)]">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="font-mono text-sm font-medium text-[color:var(--ink)]">
                  {formatINR(product.price)}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-emerald-700 font-semibold mt-0.5">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          ) : (
            <div className="font-mono text-sm">{formatINR(product.price)}</div>
          )}
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
