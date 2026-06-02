import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Star } from "lucide-react";
import { testimonials as backupTestimonials } from "@/lib/data";
import { getTestimonials } from "@/lib/api-client";
import { gsap } from "@/lib/gsap";

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [data, setData] = useState(backupTestimonials);

  useEffect(() => {
    getTestimonials().then((res) => {
      if (res && res.length > 0) {
        setData(res);
      }
    });
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header elements
      gsap.fromTo(
        "[data-testimonial-header] > *",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.12, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-testimonial-header]",
            start: "top 85%",
          }
        }
      );

      // Animate testimonial cards staggered
      gsap.fromTo(
        "[data-testimonial-card]",
        { opacity: 0, y: 65 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.18,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-testimonials-grid]",
            start: "top 80%",
          }
        }
      );
    }, root);
    return () => ctx.revert();
  }, [data]);

  return (
    <section ref={root} className="py-28 bg-[color:var(--cream)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div data-testimonial-header className="mb-16 max-w-2xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--earth)] mb-4">
            Kitchens
          </div>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.05]">
            What kitchens are <span className="italic">saying.</span>
          </h2>
        </div>
        
        <div data-testimonials-grid className="grid md:grid-cols-12 gap-6">
          {data.map((t, i) => {
            const span = i === 0 ? "md:col-span-5 md:mt-0" : i === 1 ? "md:col-span-4 md:mt-16" : "md:col-span-3 md:mt-8";
            return (
              <article
                key={t.name}
                data-testimonial-card
                className={`${span} border border-[color:var(--border)] bg-[color:var(--bg)] p-8 shadow-sm hover:shadow-[0_22px_45px_-10px_rgba(0,0,0,0.08)] hover:border-[color:var(--earth)] hover:-translate-y-2 transition-all duration-500 cursor-default relative overflow-hidden group`}
              >
                {/* Elegant giant quote mark in the background */}
                <span className="absolute top-2 right-4 font-display text-[9rem] text-[color:var(--gold)]/10 select-none leading-none pointer-events-none group-hover:scale-110 group-hover:text-[color:var(--earth)]/10 transition-all duration-700">“</span>
                
                <div className="flex gap-1 text-[color:var(--gold)] mb-6 relative z-10">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={14} 
                      fill="currentColor" 
                      strokeWidth={0} 
                      className="group-hover:scale-110 transition-transform duration-300"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    />
                  ))}
                </div>
                
                <p className="font-display italic text-2xl leading-snug text-[color:var(--ink)] relative z-10">
                  "{t.quote}"
                </p>
                
                <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] relative z-10 group-hover:text-[color:var(--earth)] transition-colors duration-300">
                  {t.name} · {t.city}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
