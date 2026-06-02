import { createFileRoute, Link } from "@tanstack/react-router";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { RotateCcw, ShieldOff, Coins, MessageCircle, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation — Hadoti Farms" },
      { name: "description", content: "Review our policy on returns, refunds, and cancellations for standard and custom-milled orders." },
    ],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <>
      <section className="relative h-[45vh] bg-[color:var(--ink)] text-white overflow-hidden flex items-end pb-12">
        <GrainOverlay opacity={0.15} />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-4">
            Customer Guarantee
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-none">
            Refunds & <span className="italic text-[color:var(--gold)]">Cancellations</span>
          </h1>
        </div>
      </section>

      <section className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick Summary Left Sticky Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 bg-[color:var(--cream)] border border-[color:var(--border)] p-6 md:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wider border-b border-[color:var(--border)] pb-4 text-[color:var(--ink)]">
              Refund Specs
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <ShieldOff className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Custom Flour Exception</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Custom-milled mixtures are tailor-ground and cannot be refunded once milling begins.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <RotateCcw className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Strict No-Return Rules</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    For safety and hygiene, edible flours and grains are non-returnable. Replacements require unboxing proof.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Coins className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Fast Processing</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Approved refunds are credited directly to your bank account/UPI in 5-7 working days.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[color:var(--border)]">
              <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
                Have a compromised moisture seal, transit split, or missing items in your shipment?
              </p>
              <Link to="/contact" className="story-link font-mono text-[10px] uppercase tracking-wider mt-4 inline-flex items-center gap-2">
                <MessageCircle size={12} /> Contact Purity Support →
              </Link>
            </div>
          </div>

          {/* Detailed Content Right Column */}
          <div className="lg:col-span-8 bg-[color:var(--bg)] border border-[color:var(--border)] p-8 md:p-12 space-y-10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)]">
                Purity Guarantee
              </span>
              <h2 className="font-display text-4xl mt-3 text-[color:var(--ink)]">
                Our pledge to quality and fair agricultural exchange.
              </h2>
              <p className="mt-4 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Because Hadoti Farms harvests are processed, stone-ground, and shipped directly from Kota, Rajasthan, without artificial stabilizers, we strictly monitor our quality controls. If any product falls short of our standards, we pledge to resolve it swiftly.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-6">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">1. Cancellations & The Milling Queue</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Our stone-grinding schedule is synced dynamically to incoming checkout flows.
              </p>
              <ul className="space-y-3 pl-2">
                {[
                  "Standard Staple Orders: Cancellations are accepted within 2 hours of checkout before packing commences.",
                  "Custom-Milled Grains: Once custom-milling starts at our facilities, cancellations are not possible.",
                  "Custom Flours & Blended Spices: Because customized orders are ground specifically to user-selected percentage configurations, they are custom-made items and cannot be cancelled or returned once ground."
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-xs text-[color:var(--muted-foreground)]">
                    <CheckCircle size={14} className="text-[color:var(--earth)] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">2. Strict Edible Non-Returnable Policy</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                For hygiene, purity, and consumer safety reasons, **all edible products—including whole grains, customized flours, stone-ground masalas, and pulses—cannot be returned or exchanged once delivered.** We maintain a strict zero-return policy on all food items to guarantee that cross-contamination cannot occur inside our regional shipping cycles.
                <br /><br />
                <strong>Exceptions for Replacements or Store Credits:</strong>
                <br />
                Refund or replacement claims are only accepted under these three narrow conditions:
                <br /><br />
                1. **Transit Damage**: The hermetic moisture seal or outer packaging was punctured, torn, or ruptured prior to delivery.
                <br />
                2. **Pest Infestation**: Active agricultural pests are detected immediately upon opening the vacuum package.
                <br />
                3. **Fulfillment Defect**: An incorrect product variant, flour blend ratio, or grain was shipped.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">3. Unboxing Proof & Claim Timelines</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                To claim a replacement or store credit under the exceptions listed above, you must submit verified proof of the damage:
                <br /><br />
                - **Verification Required**: You must provide a clear **unboxing video** or high-resolution photograph showing the ruptured package or pest issue immediately upon opening.
                <br />
                - **Timeline**: Your proof must be submitted via our support coordinates within **24 to 48 hours** of delivery. Claims submitted after 48 hours or without a continuous unboxing video will not be processed.
                <br />
                - **Refund Processing**: Once approved, refunds are credited directly to your original payment source (UPI, Netbanking, Credit Card) in **5 to 7 working days**.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">4. Quality Audit Commitment</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Every return claim is treated as a quality audit. If a crop batch exhibits premature spoilage, we immediately halt distribution of that specific grower co-operative lot, conduct laboratory testing at our Kota accredited facility, and verify that pesticide-free protocols were maintained perfectly by the farming family. Your feedback directly shapes our cooperative standards.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
