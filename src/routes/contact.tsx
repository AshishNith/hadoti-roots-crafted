import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/HFButton";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Hadoti Farms" }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <section className="pt-40 pb-32">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-4">Contact</div>
          <h1 className="font-display text-6xl md:text-7xl leading-[1]">Write to <span className="italic">us.</span></h1>
          <div className="mt-12 space-y-6 font-mono text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-1">Office</div>
              <div>Hadoti Farms, Industrial Area<br />Kota, Rajasthan 324007</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-1">Email</div>
              <a href="mailto:hello@hadotifarms.in" className="story-link">hello@hadotifarms.in</a>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-1">Phone</div>
              <a href="tel:+919876543210" className="story-link">+91 98765 43210</a>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)] mb-1">Follow Us</div>
              <div className="flex gap-3 mt-1">
                <a href="https://instagram.com/hadotifarms" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--earth)] transition-colors" aria-label="Instagram">Instagram</a>
                <span className="text-[color:var(--muted-foreground)]">·</span>
                <a href="https://facebook.com/hadotifarms" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--earth)] transition-colors" aria-label="Facebook">Facebook</a>
                <span className="text-[color:var(--muted-foreground)]">·</span>
                <a href="https://twitter.com/hadotifarms" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--earth)] transition-colors" aria-label="Twitter">Twitter</a>
              </div>
            </div>
          </div>
        </div>
        <div>
          {sent ? (
            <p className="font-display italic text-3xl text-[color:var(--earth)]">Thanks. We'll write back within a day.</p>
          ) : (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <Field label="Your name" />
              <Field label="Email" type="email" />
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">Message</span>
                <textarea rows={5} required className="mt-1 w-full bg-transparent border-b border-[color:var(--ink)] py-2 outline-none focus:border-[color:var(--earth)] transition-colors resize-none" />
              </label>
              <Button>Send →</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">{label}</span>
      <input type={type} required className="mt-1 w-full bg-transparent border-b border-[color:var(--ink)] py-2 outline-none focus:border-[color:var(--earth)] transition-colors" />
    </label>
  );
}
