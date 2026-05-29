import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { farmers } from "@/lib/data";
import { GrainOverlay } from "@/components/ui/GrainOverlay";

export const Route = createFileRoute("/our-farms")({
  head: () => ({
    meta: [
      { title: "Our Farms — Hadoti Farms" },
      { name: "description", content: "400+ farmers across Kota, Bundi and Jhalawar. Meet the land behind every grain." },
    ],
  }),
  component: OurFarms,
});

const districts = [
  { id: "kota", name: "Kota", x: 32, y: 60, crops: ["Moong", "Chana", "Wheat"] },
  { id: "bundi", name: "Bundi", x: 58, y: 32, crops: ["Urad", "Lal Mirch", "Til"] },
  { id: "jhalawar", name: "Jhalawar", x: 78, y: 72, crops: ["Jowar", "Til", "Maize"] },
];

const timeline = [
  ["01", "Sown", "Heirloom seeds, dryland farming."],
  ["02", "Grown", "No pesticides. Neem and cow-manure cycles."],
  ["03", "Harvested", "By the farmer family, by hand."],
  ["04", "Packed", "Sun-cleaned, stone-milled in Kota."],
  ["05", "Shipped", "Direct to your kitchen in 3 days."],
];

function OurFarms() {
  const [active, setActive] = useState(districts[1]);
  return (
    <>
      <section className="relative h-[90vh] bg-[color:var(--ink)] text-white overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,#3a2f1c 0%,#1c1812 100%)" }} />
        <GrainOverlay opacity={0.16} />
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex items-end pb-24">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-6">Hadoti Region · Rajasthan</div>
            <h1 className="font-display text-7xl md:text-[10rem] leading-[0.92] max-w-5xl">
              The land behind <span className="italic text-[color:var(--gold)]">every grain.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-5xl leading-[1.05] max-w-md">
              Three <span className="italic">districts.</span> One soil story.
            </h2>
            <p className="mt-6 max-w-md text-[color:var(--muted-foreground)]">
              Hadoti's black cotton soil holds water like nowhere else in Rajasthan. It's why our urad tastes the way it does, why our jowar is dense, why our chillies dry the way they do.
            </p>
            <div className="mt-10 space-y-4">
              {districts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActive(d)}
                  className={`w-full text-left flex items-center justify-between border-b border-[color:var(--border)] py-4 transition-colors ${active.id === d.id ? "text-[color:var(--earth)]" : ""}`}
                >
                  <span className="font-display text-3xl">{d.name}</span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">{d.crops.join(" · ")}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative aspect-square w-full max-w-[520px] mx-auto bg-[color:var(--cream)] border border-[color:var(--border)]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M20,30 Q40,15 60,20 T90,40 Q92,60 80,80 Q60,92 35,85 Q15,75 12,55 Q12,40 20,30 Z" fill="var(--bg)" stroke="var(--ink)" strokeWidth="0.4" />
              {districts.map((d) => (
                <g key={d.id} onClick={() => setActive(d)} style={{ cursor: "pointer" }}>
                  <circle cx={d.x} cy={d.y} r={active.id === d.id ? 3 : 1.8} fill="var(--earth)" />
                  <circle cx={d.x} cy={d.y} r={active.id === d.id ? 7 : 4} fill="var(--earth)" opacity={0.2} />
                  <text x={d.x + 5} y={d.y + 1} fontSize="3" fontFamily="Cormorant Garamond" fill="var(--ink)" fontStyle="italic">{d.name}</text>
                </g>
              ))}
            </svg>
            <div className="absolute bottom-6 left-6 right-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
              Hadoti — {active.name} — {active.crops.join(", ")}
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 bg-[color:var(--cream)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h2 className="font-display text-5xl mb-16 max-w-xl">Meet the <span className="italic">growers.</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmers.map((f, i) => (
              <article key={f.name} className="bg-[color:var(--bg)] border border-[color:var(--border)] overflow-hidden">
                <div className="aspect-[4/5] zoom-frame">
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg,#8b${(5 + i).toString(16)}e3c,#2c1d12)` }} />
                </div>
                <div className="p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--earth)]">{f.village}</div>
                  <h3 className="font-display text-2xl mt-1">{f.name}</h3>
                  <div className="font-mono text-[11px] text-[color:var(--muted-foreground)] mt-2">{f.years} yrs · {f.crop}</div>
                  <p className="mt-4 font-display italic text-lg text-[color:var(--ink)]/80">"{f.quote}"</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h2 className="font-display text-5xl mb-16 max-w-xl">From field to <span className="italic">door.</span></h2>
          <ol className="grid md:grid-cols-5 gap-8">
            {timeline.map(([n, t, d]) => (
              <li key={n}>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--earth)]">Step {n}</div>
                <div className="font-display text-3xl mt-2">{t}</div>
                <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-28 bg-[color:var(--cream)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-12">
          {[
            ["Traditional Methods", "Hand-cleaning, stone milling, sun drying. Slow because it matters."],
            ["No Pesticides", "Neem, cow manure, crop rotation. Period."],
            ["Fair Farmer Pay", "We pay 30% above mandi rates and report it publicly."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-display text-3xl">{t}</h3>
              <p className="mt-4 text-[color:var(--muted-foreground)]">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
