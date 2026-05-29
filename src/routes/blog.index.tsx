import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { blogPosts } from "@/lib/data";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: [{ title: "Journal — Hadoti Farms" }] }),
  component: BlogIndex,
});

const tabs = ["All", "Recipe", "Farm Story", "Seasonal Guide"];

function BlogIndex() {
  const [tab, setTab] = useState("All");
  const filtered = tab === "All" ? blogPosts : blogPosts.filter((p) => p.type === tab);
  const [featured, ...rest] = filtered;
  return (
    <section className="pt-40 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-4">Journal</div>
        <h1 className="font-display text-6xl md:text-8xl leading-[1]">
          Recipes, fields, <span className="italic">seasons.</span>
        </h1>

        <div className="mt-12 flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-mono text-[11px] uppercase tracking-[0.22em] px-4 py-2 border ${tab === t ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]" : "border-[color:var(--border)]"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {featured && (
          <Link to="/blog/$slug" params={{ slug: featured.slug }} className="block mt-16 group">
            <div className="zoom-frame relative h-[420px] md:h-[560px]" style={{ background: "linear-gradient(160deg,#8b5e3c,#1c1812)" }}>
              <div className="absolute inset-0 flex items-end p-10 md:p-16">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold)]">{featured.type}</div>
                  <h2 className="font-display italic text-4xl md:text-7xl text-white max-w-3xl mt-3">{featured.title}</h2>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {rest.map((p, i) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className={`group ${i === 1 ? "md:mt-16" : ""}`}
            >
              <div className="zoom-frame relative aspect-[4/3]" style={{ background: `linear-gradient(160deg,#${i % 2 ? "6b7f5e" : "8b5e3c"},#1c1812)` }} />
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--earth)]">{p.type} · {p.date}</div>
              <h3 className="font-display text-2xl mt-2">{p.title}</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-2">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
