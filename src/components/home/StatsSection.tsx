import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { stats as backupStats } from "@/lib/data";
import { getStats } from "@/lib/api-client";

export function StatsSection() {
  const root = useRef<HTMLElement>(null);
  const [data, setData] = useState(backupStats);

  useEffect(() => {
    getStats().then((res) => {
      if (res && res.length > 0) {
        setData(res);
      }
    });
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-count]");
      targets.forEach((el) => {
        const end = Number(el.dataset.count || "0");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString("en-IN");
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [data]);

  return (
    <section ref={root} className="py-28 border-y border-[color:var(--border)] bg-[color:var(--bg)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
        {data.map((s) => (
          <div key={s.label}>
            <div className="font-display text-6xl md:text-8xl text-[color:var(--earth)] leading-none">
              <span data-count={s.value}>0</span>
              <span>{s.suffix}</span>
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
