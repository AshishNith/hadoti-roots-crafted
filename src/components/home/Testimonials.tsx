import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { testimonials as backupTestimonials } from "@/lib/data";
import { getTestimonials } from "@/lib/api-client";

export function Testimonials() {
  const [data, setData] = useState(backupTestimonials);

  useEffect(() => {
    getTestimonials().then((res) => {
      if (res && res.length > 0) {
        setData(res);
      }
    });
  }, []);

  return (
    <section className="py-28 bg-[color:var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-16 max-w-2xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--earth)] mb-4">
            Kitchens
          </div>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.05]">
            What kitchens are <span className="italic">saying.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-12 gap-6">
          {data.map((t, i) => {
            const span = i === 0 ? "md:col-span-5 md:mt-0" : i === 1 ? "md:col-span-4 md:mt-16" : "md:col-span-3 md:mt-8";
            return (
              <article
                key={t.name}
                className={`${span} border border-[color:var(--border)] bg-[color:var(--bg)] p-8`}
              >
                <div className="flex gap-1 text-[color:var(--gold)] mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="font-display italic text-2xl leading-snug text-[color:var(--ink)]">
                  "{t.quote}"
                </p>
                <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
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
