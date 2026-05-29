import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";

export function FarmStory() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-parallax-img]", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-5 gap-10 md:gap-16 items-center">
        <div className="md:col-span-2">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--earth)] mb-6">
            Farm to Kitchen
          </div>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.05]">
            We know <span className="italic">where</span> every grain comes from.
          </h2>
          <p className="mt-6 text-[color:var(--muted-foreground)] max-w-md">
            Every sack is traceable to a farmer, a village, a season. Three districts. Four hundred families. One promise.
          </p>
          <div className="mt-10">
            <Link to="/our-farms" className="story-link font-mono text-xs uppercase tracking-[0.2em]">
              Meet our farmers →
            </Link>
          </div>
        </div>
        <div className="md:col-span-3 relative h-[480px] md:h-[600px] overflow-hidden">
          <div
            data-parallax-img
            className="absolute -inset-y-12 inset-x-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(28,26,22,0.1) 0%, rgba(28,26,22,0.4) 100%), url('/images/farm_story.png')",
            }}
          />
          <div className="absolute inset-0 flex items-end p-8">
            <div className="font-display italic text-white/90 text-3xl md:text-4xl max-w-md leading-snug">
              "The black soil here keeps the urad rich. We don't rush it."
              <div className="mt-3 font-body not-italic text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]">
                — Ramesh Gurjar, Bundi
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
