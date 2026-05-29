import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";
import { products, formatINR } from "@/lib/data";

const palette = [
  "linear-gradient(160deg,#a8895c,#5a4128)",
  "linear-gradient(160deg,#c5a47a,#6e4f2e)",
  "linear-gradient(160deg,#7d8b6a,#3d4530)",
  "linear-gradient(160deg,#b35b3a,#5a2415)",
  "linear-gradient(160deg,#c98e3a,#5e3f15)",
  "linear-gradient(160deg,#8a7a5a,#3a3024)",
];

export function BestsellerScroll() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
    }, root);
    return () => ctx.revert();
  }, []);

  const items = products.slice(0, 6);

  return (
    <section ref={root} className="relative bg-[color:var(--bg)] py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-12 flex items-end justify-between">
        <h2 className="font-display text-5xl md:text-6xl leading-[1] max-w-md">
          Most <span className="italic text-[color:var(--earth)]">loved.</span>
        </h2>
        <p className="hidden md:block max-w-xs text-sm text-[color:var(--muted-foreground)]">
          The products our kitchens keep reordering — scroll to browse.
        </p>
      </div>

      <div ref={track} className="flex gap-6 pl-6 lg:pl-10 will-change-transform">
        {items.map((p, i) => (
          <Link
            key={p.slug}
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="group relative shrink-0 w-[320px] md:w-[380px]"
          >
            <div className="relative h-[420px] zoom-frame">
              <div
                className="absolute inset-0"
                style={{ background: palette[i % palette.length] }}
              />
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
