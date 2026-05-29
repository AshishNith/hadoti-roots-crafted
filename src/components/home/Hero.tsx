import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Button } from "@/components/ui/HFButton";
import { Ticker } from "@/components/layout/Ticker";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lineWords = gsap.utils.toArray<HTMLElement>("[data-word]");
      gsap.set(lineWords, { yPercent: 110, opacity: 0 });
      gsap.set("[data-hero-sub]", { opacity: 0, y: 20 });
      gsap.set("[data-hero-ctas]", { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=1600",
          pin: true,
          scrub: 0.7,
        },
      });
      tl.to("[data-hero-bg]", { scale: 1.15, ease: "none" }, 0);
      tl.to(lineWords, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.15,
        ease: "power3.out",
      }, 0.05);
      tl.to("[data-hero-sub]", { opacity: 1, y: 0, ease: "power2.out" }, 0.7);
      tl.to("[data-hero-ctas]", { opacity: 1, y: 0, ease: "power2.out" }, 0.85);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-[color:var(--ink)] text-white"
    >
      <div
        data-hero-bg
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(28,26,22,0.55) 0%, rgba(28,26,22,0.85) 100%), radial-gradient(circle at 30% 40%, #6b5a3a 0%, #2a241a 60%, #14110d 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <GrainOverlay opacity={0.18} />

      <div className="relative h-full flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10">
            <h1 className="font-display leading-[0.95] text-[14vw] md:text-[10vw] lg:text-[9rem]">
              <span className="block overflow-hidden">
                <span data-word className="inline-block text-[color:var(--gold)]">Grown</span>{" "}
                <span data-word className="inline-block text-[color:var(--gold)]">in</span>
              </span>
              <span className="block overflow-hidden italic">
                <span data-word className="inline-block">Hadoti.</span>
              </span>
            </h1>
            <p
              data-hero-sub
              className="mt-8 max-w-xl text-base md:text-lg text-white/75"
            >
              Pesticide-free staples, custom-blended for your kitchen — sourced direct from 400+ farmers across Kota, Bundi and Jhalawar.
            </p>
            <div data-hero-ctas className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop"><Button>Shop Now</Button></Link>
              <Link to="/customize"><Button variant="light">Build Your Box →</Button></Link>
            </div>
          </div>
        </div>

        <Ticker
          items={[
            "Farm Direct",
            "Hadoti Region",
            "No Pesticides",
            "Custom Orders",
            "400+ Farmers",
            "Stone Ground",
            "Sun Dried",
          ]}
        />
      </div>
    </section>
  );
}
