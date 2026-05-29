import { Link } from "@tanstack/react-router";

const cats = [
  { to: "/shop/dals", title: "Dals & Pulses", tag: "Heritage Varieties", image: "/images/panchratan_dal.png" },
  { to: "/shop/masalas", title: "Masalas", tag: "Single Origin", image: "/images/masala_blend.png" },
  { to: "/shop/ration", title: "Ration Boxes", tag: "Monthly Staples", image: "/images/ration_box.png" },
  { to: "/shop/hampers", title: "Gift Hampers", tag: "Festive", image: "/images/gift_hamper.png" },
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
  image,
  className = "",
  large,
  wide,
}: {
  to: string;
  title: string;
  tag: string;
  image: string;
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
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70 group-hover:from-black/10 group-hover:to-black/60 transition-colors duration-500" />
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
