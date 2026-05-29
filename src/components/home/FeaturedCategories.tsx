import { Link } from "@tanstack/react-router";

const cats = [
  { to: "/shop/dals", title: "Dals & Pulses", tag: "Heritage Varieties", bg: "linear-gradient(180deg,#7a5a3a 0%,#3a2a1a 100%)" },
  { to: "/shop/masalas", title: "Masalas", tag: "Single Origin", bg: "linear-gradient(180deg,#a85a3a 0%,#5a2a1a 100%)" },
  { to: "/shop/ration", title: "Ration Boxes", tag: "Monthly Staples", bg: "linear-gradient(180deg,#8b8554 0%,#3d3a24 100%)" },
  { to: "/shop/hampers", title: "Gift Hampers", tag: "Festive", bg: "linear-gradient(180deg,#5e7250 0%,#2a3424 100%)" },
];

export function FeaturedCategories() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-28">
      <div className="flex items-end justify-between mb-12">
        <h2 className="font-display text-5xl md:text-6xl max-w-xl leading-[1.05]">
          Built for everyday <span className="italic text-[color:var(--earth)]">cooking.</span>
        </h2>
        <Link to="/shop" className="story-link font-mono text-xs uppercase tracking-[0.2em] hidden md:inline-block">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[640px]">
        <CategoryCard className="md:row-span-2 md:h-full" {...cats[0]} large />
        <CategoryCard {...cats[1]} />
        <CategoryCard {...cats[2]} />
        <CategoryCard className="md:col-span-2" {...cats[3]} wide />
      </div>
    </section>
  );
}

function CategoryCard({
  to,
  title,
  tag,
  bg,
  className = "",
  large,
  wide,
}: {
  to: string;
  title: string;
  tag: string;
  bg: string;
  className?: string;
  large?: boolean;
  wide?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden zoom-frame ${className} ${
        large ? "min-h-[420px]" : wide ? "min-h-[260px]" : "min-h-[300px]"
      }`}
    >
      <div className="absolute inset-0" style={{ background: bg }} />
      <div className="absolute inset-0 bg-[color:var(--ink)]/30 group-hover:bg-[color:var(--ink)]/10 transition-colors duration-500" />
      <div className="relative h-full p-8 flex flex-col justify-between text-white">
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/80">{tag}</div>
        <div>
          <h3 className={`font-display ${large ? "text-6xl" : "text-4xl"} leading-none`}>
            {title}
          </h3>
          <div className="mt-4 overflow-hidden h-6">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
