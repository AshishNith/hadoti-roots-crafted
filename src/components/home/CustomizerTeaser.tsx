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
    image: "/images/panchratan_dal.png",
  },
  {
    tag: "Masala Blender",
    title: "Calibrate the heat.",
    bullets: ["Mild · Medium · Bold", "Add-on ingredients", "Ground to order"],
    image: "/images/masala_blend.png",
  },
  {
    tag: "Ration Box Builder",
    title: "Your month, packed.",
    bullets: ["3kg · 5kg · 8kg", "Subscribe & save 8%", "Edit anytime"],
    image: "/images/ration_box.png",
  },
];

export function CustomizerTeaser() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.set("[data-panel]", { opacity: 0, y: 80 });
      gsap.set("[data-teaser-progress]", { transformOrigin: "top", scaleY: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=2200",
          pin: true,
          scrub: 0.6,
        },
      })
        .to("[data-teaser-progress]", { scaleY: 1, ease: "none" }, 0)
        .to("[data-panel='0']", { opacity: 1, y: 0 }, 0)
        .to("[data-panel='0']", { opacity: 0, y: -80 }, 1)
        .to("[data-panel='1']", { opacity: 1, y: 0 }, 1)
        .to("[data-panel='1']", { opacity: 0, y: -80 }, 2)
        .to("[data-panel='2']", { opacity: 1, y: 0 }, 2);
    });

    mm.add("(max-width: 767px)", () => {
      // Reset panel styles for mobile to let them flow naturally
      gsap.set("[data-panel]", { opacity: 1, y: 0, clearProps: "all" });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-screen md:h-screen bg-[color:var(--ink)] text-white overflow-y-auto md:overflow-hidden py-12 md:py-0">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 22s linear infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
      <GrainOverlay opacity={0.12} />
      <div className="relative h-full flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-0">
        {/* Elegant middle dividing progress bar for desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/10 z-10">
          <div 
            data-teaser-progress
            className="absolute top-0 left-0 right-0 w-full bg-gradient-to-b from-[color:var(--gold)] to-[color:var(--earth)] origin-top h-full will-change-transform"
          />
        </div>

        <div className="relative flex items-center px-6 md:px-16 py-6 md:py-16">
          {/* Mobile horizontal progress bar (hidden since animation is disabled on mobile) */}
          <div className="hidden absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
            <div 
              data-teaser-progress-mobile
              className="absolute top-0 bottom-0 left-0 h-full bg-gradient-to-r from-[color:var(--gold)] to-[color:var(--earth)] origin-left w-full will-change-transform"
            />
          </div>
          
          {/* Subtle warm ambient highlight on the left */}
          <div className="absolute left-0 top-0 w-[320px] h-[320px] rounded-full bg-[color:var(--gold)]/5 blur-[100px] pointer-events-none" />
          
          <div className="relative max-w-md">
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

        <div className="relative flex flex-col md:block items-center px-6 md:px-16 py-6 md:py-16 gap-10 md:gap-0">
          {/* Abstract glowing volumetric aura in the background */}
          <div className="absolute right-[-10%] bottom-[-10%] w-[450px] h-[450px] rounded-full bg-[color:var(--gold)]/10 blur-[130px] pointer-events-none" />
          <div className="absolute left-[15%] top-[15%] w-[300px] h-[300px] rounded-full bg-[color:var(--earth)]/12 blur-[100px] pointer-events-none" />

          {panels.map((p, i) => (
            <div
              key={p.tag}
              data-panel={i}
              className="relative md:absolute md:inset-0 px-6 md:px-16 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 border border-white/5 md:border-none bg-white/[0.02] md:bg-transparent p-6 md:p-0 rounded-sm w-full"
            >
              <div className="max-w-xs md:max-w-[280px] lg:max-w-md flex-1">
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

              {/* PREMIUM MOCKUP & GRAPHIC WHEEL */}
              <div className="hidden md:flex flex-1 items-center justify-center relative shrink-0">
                <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center animate-float-slow">
                  
                  {/* Rotating dashed circular wireframe */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-[color:var(--gold)]/20 animate-spin-slow pointer-events-none" />
                  
                  {/* Glowing inner core */}
                  <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-[color:var(--gold)]/15 to-[color:var(--earth)]/5 blur-2xl pointer-events-none" />
                  
                  {/* Glassmorphic card frame */}
                  <div className="absolute w-[72%] h-[72%] rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex items-center justify-center overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.tag} 
                      className="w-[82%] h-[82%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  
                  {/* Floating decorative nodes */}
                  <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-[color:var(--gold)] animate-pulse" />
                  <div className="absolute bottom-10 left-6 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--gold)] opacity-50">
                    Formulating...
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
