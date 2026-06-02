import { createFileRoute, Link } from "@tanstack/react-router";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Scale, FileText, Users, HeartHandshake, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Hadoti Farms" },
      { name: "description", content: "Review the Terms of Service governing platform usage, custom milling orders, and direct trade relationships." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <section className="relative h-[45vh] bg-[color:var(--ink)] text-white overflow-hidden flex items-end pb-12">
        <GrainOverlay opacity={0.15} />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-4">
            Legal Framework
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-none">
            Terms & <span className="italic text-[color:var(--gold)]">Conditions</span>
          </h1>
        </div>
      </section>

      <section className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick Summary Left Sticky Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 bg-[color:var(--cream)] border border-[color:var(--border)] p-6 md:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wider border-b border-[color:var(--border)] pb-4 text-[color:var(--ink)]">
              Terms Summary
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <Scale className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Judicial Jurisdiction</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Governed by the laws of India, with exclusive judicial jurisdiction under the courts of Kota, Rajasthan.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <HeartHandshake className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Grower Protection</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    All platform transactions directly fund our 30% above-mandi markup payouts to growers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Users className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Custom-Order Binding</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Custom-milled mixtures are stone-ground specifically for you and cannot be cancelled post-milling.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[color:var(--border)]">
              <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
                Need details regarding physical commercial supply or cooperative licensing contracts?
              </p>
              <Link to="/contact" className="story-link font-mono text-[10px] uppercase tracking-wider mt-4 inline-flex items-center gap-2">
                <FileText size={12} /> Contact Legal Counsel →
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
                The covenant of direct-trade agriculture.
              </h2>
              <p className="mt-4 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Welcome to Hadoti Farms. By accessing or shopping on our digital platform (the "Site"), you agree to abide by these Terms & Conditions. These terms define the relationship between Hadoti Farms ("we", "us", "our") and our customers ("you", "User"), outlining custom grain milling provisions and legal protocols.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-6">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">1. Platform Scope & Services</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Hadoti Farms operates a specialized farm-direct e-commerce catalog linking consumers directly to cooperative harvests in Bundi, Jhalawar, and Kota. We provide:
              </p>
              <ul className="space-y-3 pl-2">
                {[
                  "Sales of standard packaged dals, pulses, whole wheat grains, and organic masalas.",
                  "Interactive blending software allowing users to order custom-percentage multi-grain flours and spice mixes.",
                  "Verified batch-level traceability logs proving chemical-free status.",
                  "A secure farmer registry showing growing families behind every catalog item."
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-xs text-[color:var(--muted-foreground)]">
                    <CheckCircle size={14} className="text-[color:var(--earth)] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">2. Milling Operations & Custom-Orders</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Our core innovation is traditional **stone-grinding** fresh flour to order. When you configure and submit a custom ratio mix, that formula goes straight to the grinding wheels at our Kota mill. Because these items are stone-ground specifically to your customized ratios:
                <br /><br />
                - Custom formulation orders are binding. Once stone-milling has commenced in our facility, the order cannot be cancelled, modified, or refunded except in cases of damage or quality failure.
                <br />
                - Grains and flours are stone-milled in a facility that also handles wheat (gluten), barley (jowar), chickpeas (chana), and may contain trace elements of soy, dairy, or nuts. Users with severe allergies must read our dedicated Health Disclaimer prior to purchasing. By placing an order, you agree to release Hadoti Farms from any allergen liability claims.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">3. Health Warnings & Allergen Liabilities</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Hadoti Farms operates traditional stone milling facilities. While we run dedicated cleaning cycles between milling batches, our equipment is shared across multiple crops.
                <br /><br />
                - **Allergen Exposure**: All flour mixes and packaged grains are processed in workspaces that handle wheat, barley, and soy. Traces of airborne gluten or soy may be present across batches.
                <br />
                - **Health Advisory Disclaimer**: We do not provide clinical or medical advice. Sourced dietary selections, including low-GI flours or wheat-free options, are general nutritional offerings. For specific health regimens, consult a licensed physician. You agree to read and accept our full <Link to="/disclaimer" className="story-link underline text-[color:var(--earth)]">Health & Allergen Disclaimer</Link>, which is legally binding under these Terms.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">4. Transparent Mandi Payouts</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Hadoti Farms works strictly on a direct-to-farmer trade model. We commit to paying our grower cooperatives at least 30% above the local government mandi rates. By purchasing from the Site, you acknowledge that a declared percentage of your transaction goes directly into funding these premium farmer payouts, bypassing predatory middlemen.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">5. Payments & Billing</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Prices listed on our platform are inclusive of GST and local agricultural taxes. We reserve the right to adjust product rates dynamically based on agricultural harvest seasons and raw commodity yields in Rajasthan. Payments are due in full at checkout before milling queues are initialized.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">6. Legal Jurisdiction</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising from or in connection with these terms, our agricultural operations, or platform purchases shall be subject to the exclusive jurisdiction of the courts located in <strong className="text-[color:var(--earth)]">Kota, Rajasthan, India</strong>.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
