import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/HFButton";
import { GrainOverlay } from "@/components/ui/GrainOverlay";

const panels = [
  {
    tag: "Dal Mix Builder",
    title: "Blend up to 6 dals.",
    bullets: ["Choose your ratios", "Pick grind level", "Name your blend"],
  },
  {
    tag: "Masala Blender",
    title: "Calibrate the heat.",
    bullets: ["Mild · Medium · Bold", "Add-on ingredients", "Ground to order"],
  },
  {
    tag: "Ration Box Builder",
    title: "Your month, packed.",
    bullets: ["3kg · 5kg · 8kg", "Subscribe & save 8%", "Edit anytime"],
  },
];

export function CustomizerTeaser() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-panel]", { opacity: 0, y: 80 });

      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=2200",
          pin: true,
          scrub: 0.6,
        },
      })
        .to("[data-panel='0']", { opacity: 1, y: 0 }, 0)
        .to("[data-panel='0']", { opacity: 0, y: -80 }, 1)
        .to("[data-panel='1']", { opacity: 1, y: 0 }, 1)
        .to("[data-panel='1']", { opacity: 0, y: -80 }, 2)
        .to("[data-panel='2']", { opacity: 1, y: 0 }, 2);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-screen bg-[color:var(--ink)] text-white overflow-hidden">
      <GrainOverlay opacity={0.1} />
      <div className="relative h-full grid md:grid-cols-2">
        <div className="flex items-center px-6 md:px-16 py-16 border-b md:border-b-0 md:border-r border-white/10">
          <div className="max-w-md">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-6">
              Customize
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">
              Every order, <span className="italic text-[color:var(--gold)]">your way.</span>
            </h2>
            <p className="mt-6 text-white/70 max-w-sm">
              Build dal mixes, masala blends and ration boxes that match exactly how you cook.
            </p>
            <div className="mt-10">
              <Link to="/customize"><Button>Start Customizing</Button></Link>
            </div>
          </div>
        </div>

        <div className="relative flex items-center px-6 md:px-16 py-16">
          {panels.map((p, i) => (
            <div
              key={p.tag}
              data-panel={i}
              className="absolute inset-0 px-6 md:px-16 flex items-center"
            >
              <div className="max-w-md">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-6">
                  {p.tag}
                </div>
                <h3 className="font-display text-5xl md:text-6xl leading-[0.95] italic">
                  {p.title}
                </h3>
                <ul className="mt-8 space-y-3">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-white/80">
                      <span className="text-[color:var(--gold)] font-mono mt-1">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
