import { createFileRoute, Link } from "@tanstack/react-router";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Truck, Calendar, MapPin, Package, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Hadoti Farms" },
      { name: "description", content: "Learn about our fresh-milled shipping schedules, delivery networks across India, and custom moisture packaging." },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <>
      <section className="relative h-[45vh] bg-[color:var(--ink)] text-white overflow-hidden flex items-end pb-12">
        <GrainOverlay opacity={0.15} />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-4">
            Logistics & Delivery
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-none">
            Shipping <span className="italic text-[color:var(--gold)]">Policy</span>
          </h1>
        </div>
      </section>

      <section className="py-20 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick Summary Left Sticky Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 bg-[color:var(--cream)] border border-[color:var(--border)] p-6 md:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wider border-b border-[color:var(--border)] pb-4 text-[color:var(--ink)]">
              Shipping Specs
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <Calendar className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Fresh Milling Time</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Grains are stone-milled to order. Expect 24-48 hours of milling queue before dispatch.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Truck className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Pan-India Transit</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Metros: 3-5 business days. Other regions: 5-7 business days directly from Kota.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Package className="text-[color:var(--earth)] shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-semibold">Moisture Protection</h3>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    Packed in multi-layer moisture-barrier pouches to withstand humid climates.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[color:var(--border)]">
              <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
                Need to expedite a community order or coordinate bulk transport for local store shelves?
              </p>
              <Link to="/contact" className="story-link font-mono text-[10px] uppercase tracking-wider mt-4 inline-flex items-center gap-2">
                <MapPin size={12} /> Contact Dispatch Officer →
              </Link>
            </div>
          </div>

          {/* Detailed Content Right Column */}
          <div className="lg:col-span-8 bg-[color:var(--bg)] border border-[color:var(--border)] p-8 md:p-12 space-y-10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)]">
                Fulfillment Logistics
              </span>
              <h2 className="font-display text-4xl mt-3 text-[color:var(--ink)]">
                Harvest-fresh delivery. Straight from Kota stone mills.
              </h2>
              <p className="mt-4 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                We believe that food should not sit stale in distribution depots. That's why we operate a highly responsive, direct-to-kitchen fulfillment pipeline. All grains, custom flours, and blended masalas are packed immediately post-milling and shipped direct from our facility in Kota, Rajasthan.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-6">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">1. Fresh Milling & Processing Timeline</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Unlike mass-commercial brands, we do not stockpile pre-ground flour. Grains undergo traditional sun-cleaning and are kept whole until you place an order.
              </p>
              <ul className="space-y-3 pl-2">
                {[
                  "Standard Staples: Dals, intact grains, and whole masalas are packed and dispatched in 24 hours.",
                  "Custom Milling: Custom-blended flours and masalas require 24 to 48 hours for grinding and packaging.",
                  "Milling Schedule: Our traditional stone mills run Monday through Saturday. Sunday harvest orders enter the queue early Monday morning."
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-xs text-[color:var(--muted-foreground)]">
                    <CheckCircle size={14} className="text-[color:var(--earth)] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">2. Shipping Locations & Transit Times</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                We ship to all PIN codes across the Republic of India via reliable national logistics networks (e.g. Delhivery, Blue Dart).
                <br /><br />
                - **Tier 1 Metros** (Delhi NCR, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Pune): Delivery in 3 to 5 business days post-dispatch.
                <br />
                - **Tier 2 & 3 Cities**: Delivery in 4 to 6 business days post-dispatch.
                <br />
                - **Regional Rajasthan** (Jaipur, Jodhpur, Udaipur, Kota local): Delivery in 2 to 3 business days.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">3. Shipping Rates & Tiers</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                To keep our pricing structure highly transparent, we offer simple shipping tiers:
                <br /><br />
                - **Orders above ₹999**: Free Nationwide Delivery.
                <br />
                - **Orders under ₹999**: A flat shipping fee of ₹75 is added at checkout to cover direct logistics from Rajasthan.
              </p>
            </div>

            <div className="border-t border-[color:var(--border)] pt-8 space-y-4">
              <h3 className="font-display text-2xl text-[color:var(--ink)]">4. Monsoon & Climatic Protection Packaging</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Hadoti's flours contain no chemical preservatives or artificial drying agents. Because they are stone-ground fresh, they are highly sensitive to moisture and humidity. To combat this, we ship every single order inside premium multi-layer, heat-sealed moisture-barrier pouches. This guarantees that your pulses and flours arrive hermetically protected, carrying the pure, dry aroma of Hadoti soil.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
