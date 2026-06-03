import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";
import { products as backupProducts, formatINR, imageFor } from "@/lib/data";
import { getProducts } from "@/lib/api-client";

export function BestsellerScroll() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(backupProducts);

  useEffect(() => {
    getProducts().then((res) => {
      if (res && res.length > 0) {
        setData(res);
      }
    });
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tr = track.current!;
      const distance = tr.scrollWidth - window.innerWidth + 80;
      gsap.to(tr, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + distance,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });

    mm.add("(max-width: 767px)", () => {
      // Clean up properties so native CSS touch scrolling operates smoothly
      gsap.set(track.current, { clearProps: "all" });
    });

    return () => mm.revert();
  }, [data]);

  const items = data.slice(0, 6);

  return (
    <section ref={root} className="relative bg-[color:var(--bg)] py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-12 flex items-end justify-between">
        <h2 className="font-display text-5xl md:text-6xl leading-[1] max-w-md">
          Most <span className="italic text-[color:var(--earth)]">loved.</span>
        </h2>
        <p className="hidden md:block max-w-xs text-sm text-[color:var(--muted-foreground)]">
          The products our kitchens keep reordering — scroll to browse.
        </p>
      </div>

      <div ref={track} className="flex gap-6 pl-6 lg:pl-10 overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 scrollbar-none snap-x snap-mandatory will-change-transform">
        {items.map((p, i) => (
          <Link
            key={p.slug}
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="group relative shrink-0 w-[290px] sm:w-[320px] md:w-[380px] snap-start"
          >
            <div className="relative h-[420px] zoom-frame">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${p.image || imageFor(p.slug)})` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-end p-6">
                <div className="font-display italic text-7xl text-white/15 leading-none">
                  {p.name.split(" ")[0]}
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl leading-tight">{p.name}</h3>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                  {p.weight}
                </div>
              </div>
              <div className="font-mono text-sm whitespace-nowrap">{formatINR(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
