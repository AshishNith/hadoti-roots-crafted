import { useState } from "react";
import { GrainOverlay } from "@/components/ui/GrainOverlay";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="relative bg-[color:var(--ink)] text-white py-28 overflow-hidden">
      <GrainOverlay opacity={0.14} />
      <div className="relative max-w-[1100px] mx-auto px-6 lg:px-10 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-6">
          Newsletter
        </div>
        <h2 className="font-display text-5xl md:text-7xl leading-[1] max-w-3xl mx-auto">
          Seasonal drops. <span className="italic text-[color:var(--gold)]">Farm updates.</span> First access.
        </h2>
        {done ? (
          <p className="mt-12 font-display italic text-2xl text-[color:var(--gold)]">
            Welcome to the harvest list.
          </p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
            className="mt-12 max-w-xl mx-auto flex border-b border-white/30 focus-within:border-[color:var(--gold)] transition-colors"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent py-4 px-2 outline-none font-body text-base placeholder:text-white/40"
            />
            <button
              type="submit"
              className="font-mono text-xs uppercase tracking-[0.22em] px-6 py-4 text-[color:var(--gold)] hover:text-white transition-colors"
            >
              Join →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
