import { createFileRoute, Link } from "@tanstack/react-router";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Shield, Lock, EyeOff, Mail, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Hadoti Farms" },
      { name: "description", content: "Learn how Hadoti Farms protects your personal data, custom milling recipes, and grower trade privacy." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <section className="relative h-[45vh] bg-[color:var(--ink)] text-white overflow-hidden flex items-end pb-12">
        <GrainOverlay opacity={0.15} />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-4">
            Security & Trust
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-none">
            Privacy <span className="italic text-[color:var(--gold)]">Policy</span>
          </h1>
        </div>
      </section>

      <section className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick Summary Left Sticky Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 bg-[color:var(--cream)] border border-[color:var(--border)] p-6 md:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wider border-b border-[color:var(--border)] pb-4 text-[color:var(--ink)]">
              Privacy Highlights
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <Lock className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Recipe Confidentiality</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Your custom flour mixes and spice customizer ratios remain 100% private to your account.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Shield className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Zero Sell Guarantee</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    We never sell or trade your data. Your contact details are shared strictly for shipping logs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <EyeOff className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Secure Transactions</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Payments are direct, encrypted, and processed safely using certified Indian gateways.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[color:var(--border)]">
              <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
                Have questions about your data or agricultural traceability records?
              </p>
              <Link to="/contact" className="story-link font-mono text-[10px] uppercase tracking-wider mt-4 inline-flex items-center gap-2">
                <Mail size={12} /> Contact DPO Officer →
              </Link>
            </div>
          </div>

          {/* Detailed Content Right Column */}
          <div className="lg:col-span-8 bg-[color:var(--bg)] border border-[color:var(--border)] p-8 md:p-12 space-y-10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)]">
                Last Updated: June 2026
              </span>
              <h2 className="font-display text-4xl mt-3 text-[color:var(--ink)]">
                Protecting the roots of our digital ecosystem.
              </h2>
              <p className="mt-4 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                At Hadoti Farms, we believe that transparency is paramount. That's true not only for the grains grown in our Bundi, Jhalawar, and Kota fields but also for the data you share on our platform. This Policy describes how we collect, store, and process your personal credentials, order sheets, and customized recipe blends.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-6">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">1. Information We Collect</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                To serve you fresh, stone-ground staples directly from Kota, we collect data across these touchpoints:
              </p>
              <ul className="space-y-3 pl-2">
                {[
                  "Account Details: Name, email address, phone coordinates, and shipping logs.",
                  "Custom Formulations: Ratios, ingredients, and names of custom flour mixtures (Aata customizer) and spice mixes.",
                  "Fulfillment Logs: Exact purchase transactions and delivery addresses for secure shipping dispatch.",
                  "Grower Network Logs: Publicly declared premium mandi payout tracking to maintain 30% markup transparency."
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-xs text-[color:var(--muted-foreground)]">
                    <CheckCircle size={14} className="text-[color:var(--earth)] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">2. How We Protect Custom Formulations</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Hadoti Farms respects your culinary preferences. If you use our **Custom Flour Customizer** or **Masala Blender**, the unique formulas (e.g. 70% Sharbati Wheat, 20% Black Chickpea, 10% Barley) are stored as encrypted configuration files in our databases. Our production staff at the Kota facility receive the formulas anonymously on automated milling queues (marked only by a secure batch ID) to prevent any leakage of your private culinary combinations.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">3. Logistics & Third-Party Shipping</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                We work with premium courier aggregators to ship freshly milled packages directly from Rajasthan. Shipping coordinates are shared strictly under secure APIs with shipping partners (e.g., Delhivery, Blue Dart, Professional Couriers). These partners are legally bound to destroy your address logs after successful delivery verification.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">4. Farmer Network Integrity</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Our grower network encompasses over 400+ family farms in Kota, Bundi, and Jhalawar. To protect our agricultural community from corporate exploitation or unfair direct solicitation, exact spatial plot coordinates and family identity data are managed under high security. Only village-level grows and certified crop testings are published in our public traceability logs.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">5. Your Legal Rights & Choices</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                You hold full control over your digital footprint on Hadoti Farms. At any time, you can request full extraction of your purchase sheets, permanent erasure of custom recipe formulas, or account termination by getting in touch with our DPO at <strong className="text-[color:var(--earth)]">purity@hadotifarms.com</strong>.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
