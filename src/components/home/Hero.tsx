import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Button } from "@/components/ui/HFButton";
import { Ticker } from "@/components/layout/Ticker";

const HERO_IMAGES = [
  "/images/hero_field_bg.png",
  "/images/hero_chillies_bg.png",
  "/images/hero_mill_bg.png",
  "/images/hero_farmer_bg.png",
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial position of Step 2 (starts hidden and shifted down)
      gsap.set("[data-hero-step2]", { opacity: 0, y: 45 });

      // 2. Entrance animation on page load (skipped if page is already scrolled to prevent conflicts)
      const lineWords = gsap.utils.toArray<HTMLElement>("[data-word]");
      const isScrolled = typeof window !== "undefined" && window.scrollY > 10;

      if (isScrolled) {
        // Immediately fully reveal Step 1 if user scrolled or reloaded down
        gsap.set(lineWords, { yPercent: 0, opacity: 1 });
        gsap.set("[data-hero-sub]", { opacity: 1, y: 0 });
        gsap.set("[data-hero-ctas]", { opacity: 1, y: 0 });
      } else {
        // Otherwise, play the elegant entrance transition
        gsap.set(lineWords, { yPercent: 110, opacity: 0 });
        gsap.set("[data-hero-sub]", { opacity: 0, y: 20 });
        gsap.set("[data-hero-ctas]", { opacity: 0, y: 20 });

        const entryTl = gsap.timeline();
        entryTl.to(lineWords, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: "power4.out",
        }, 0.1)
          .to("[data-hero-sub]", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.6")
          .to("[data-hero-ctas]", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.6");
      }

      // 3. Scroll-linked timeline with pinning and scrubbing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=1800",
          pin: true,
          scrub: 0.8,
        },
      });

      // Background zoom throughout the scroll
      tl.to("[data-hero-bg]", { scale: 1.15, ease: "none" }, 0);

      // Step 1 content fades out and moves up as we scroll
      tl.to("[data-hero-step1]", { opacity: 0, y: -65, ease: "power1.inOut" }, 0.05);
      tl.set("[data-hero-ctas]", { pointerEvents: "none" }, 0.05);

      // Step 2 content fades in and moves up
      tl.to("[data-hero-step2]", { opacity: 1, y: 0, ease: "power1.inOut" }, 0.55);
      tl.set("[data-hero-step2-ctas]", { pointerEvents: "auto" }, 0.55);

      // Step 2 content fades out at the very end
      tl.to("[data-hero-step2]", { opacity: 0, y: -45, ease: "power1.in" }, 1.1);
      tl.set("[data-hero-step2-ctas]", { pointerEvents: "none" }, 1.1);
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
        className="absolute inset-0 will-change-transform overflow-hidden"
      >
        {HERO_IMAGES.map((img, index) => {
          const isActive = index === currentImageIndex;
          return (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 animate-kenburns z-10" : "opacity-0 z-0"
                }`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(28,26,22,0.55) 0%, rgba(28,26,22,0.85) 100%), url(${img})`,
              }}
            />
          );
        })}
      </div>
      <GrainOverlay opacity={0.18} />

      <div className="relative h-full flex flex-col justify-between py-12">
        <div className="flex-1 flex items-center relative">
          {/* Step 1 Content: Fully visible on mount */}
          <div data-hero-step1 className="relative max-w-[1400px] mx-auto w-full px-6 lg:px-10">
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

          {/* Step 2 Content: Appears as you scroll */}
          <div data-hero-step2 className="absolute inset-0 flex flex-col justify-center px-6 lg:px-10 max-w-[1400px] mx-auto w-full pointer-events-none opacity-0">
            <h2 className="font-display leading-[0.95] text-[9vw] md:text-[7vw] lg:text-[6rem]">
              <span className="block">Pure black soil.</span>
              <span className="block italic text-[color:var(--gold)]">Zero pesticides.</span>
            </h2>
            <p className="mt-8 max-w-xl text-base md:text-lg text-white/75">
              Every grain is stone-ground the slow way and dried under the open Rajasthani sun. Pure, traceable, direct from our families to yours.
            </p>
            <div data-hero-step2-ctas className="mt-10 flex flex-wrap gap-4 pointer-events-none">
              <Link to="/our-farms"><Button>Meet Our Farmers</Button></Link>
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
