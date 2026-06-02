import { createFileRoute, Link } from "@tanstack/react-router";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { AlertTriangle, HeartPulse, Activity, BookOpen, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Health & Medical Disclaimer — Hadoti Farms" },
      { name: "description", content: "Review our health disclaimers, allergen notifications, and medical advisory disclaimers for specialized food items." },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <>
      <section className="relative h-[45vh] bg-[color:var(--ink)] text-white overflow-hidden flex items-end pb-12">
        <GrainOverlay opacity={0.15} />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-4">
            Health Disclosures
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-none">
            Health & Allergen <span className="italic text-[color:var(--gold)]">Disclaimer</span>
          </h1>
        </div>
      </section>

      <section className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick Summary Left Sticky Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 bg-[color:var(--cream)] border border-[color:var(--border)] p-6 md:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wider border-b border-[color:var(--border)] pb-4 text-[color:var(--ink)]">
              Disclaimer Specs
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <AlertTriangle className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Allergen Warning</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Processed in facilities handling wheat (gluten), barley, soy, chickpeas, and trace nuts.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <HeartPulse className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">No Medical Advice</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Specialty products (like low-GI flour blends) are not medical cures or drug treatments.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Activity className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Physician Advisory</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Consult your licensed doctor prior to altering your metabolic or allergen dietary habits.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[color:var(--border)]">
              <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
                Need molecular residue analytics or certified gluten testing parameters for specific lots?
              </p>
              <Link to="/contact" className="story-link font-mono text-[10px] uppercase tracking-wider mt-4 inline-flex items-center gap-2">
                <BookOpen size={12} /> Contact Food Safety Unit →
              </Link>
            </div>
          </div>

          {/* Detailed Content Right Column */}
          <div className="lg:col-span-8 bg-[color:var(--bg)] border border-[color:var(--border)] p-8 md:p-12 space-y-10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)]">
                Regulatory Disclosure
              </span>
              <h2 className="font-display text-4xl mt-3 text-[color:var(--ink)]">
                Cultivating absolute clarity and consumer health safety.
              </h2>
              <p className="mt-4 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Hadoti Farms is committed to delivering traditional, stone-ground flours, pulses, and organic spices. However, because agricultural grains carry inherent allergen footprints and nutritional variables, we maintain these absolute medical and chemical disclaimers to ensure safe, transparent usage of our agricultural goods.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-6">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">1. Shared Facility Allergen Advisory</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Our stone-milled flours are ground utilizing traditional emery stones at our facility in Kota, Rajasthan. 
                <br /><br />
                - **Allergen Presence**: Although we run complete cleaning sweeps and mechanical vacuum cycles between milling production blocks, we operate shared equipment. Grains processed in this facility include **wheat (gluten), barley (jowar), chickpeas (chana), and millet (bajra)**.
                <br />
                - **Trace Risk**: All packaged flours and grains may contain highly molecular trace elements of airborne gluten, soy, seeds, or nuts.
                <br />
                - **Severe Allergies Warning**: If you have celiac disease, severe gluten intolerance, or life-threatening peanut/soy allergies, we strongly advise you to exercise extreme caution or consult a specialist prior to consumable intake.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">2. No Medical or Clinical Advice</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Any statements, descriptions, or visual infographics regarding the health properties of crops sold on the Site (including, but not limited to, the low glycemic index of **low-GI flour mixes for diabetics**, digestible fibers in ancient grains, or pure organic trace minerals in our masalas) have not been evaluated by clinical regulatory drug authorities.
                <br /><br />
                - Our products are nutritional whole foods sourced direct from Rajasthan farms. They are **not intended to diagnose, treat, cure, mitigate, or prevent any disease, metabolic condition, or pathological state.**
                <br />
                - The copy and graphics contained on the Site do not constitute medical advice, clinical diagnoses, or professional nutritional therapy guidelines.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">3. Mandatory Physician Consultation</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Your biological requirements are unique. Prior to starting any specialized dietary regimen, carbohydrate restrictions, or substituting whole grains for diabetic insulin controls:
                <br /><br />
                - You must consult a licensed physician, certified clinical dietitian, or primary care doctor.
                <br />
                - You assume full responsibility for confirming that agricultural whole grains, high-fiber flours, or intense spices align safely with your metabolic requirements, allergies, and ongoing pharmaceutical prescriptions.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">4. Product Variations & Natural Variables</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Hadoti Farms flours are completely natural, chemical-free, and unbleached. Unlike mass-manufactured flours that contain synthetic chemical softeners and moisture stabilizers, our crops fluctuate naturally based on rain cycles, black cotton soil moisture content, and summer temperatures in Bundi and Kota. Consequently, slight variations in dough elasticity, natural color, grain texture, and baking characteristics may occur across seasonal harvests.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
