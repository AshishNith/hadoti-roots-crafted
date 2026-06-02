import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ShieldCheck, Award, FileText, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/standards")({
  head: () => ({
    meta: [
      { title: "Our Standards — Hadoti Farms" },
      { name: "description", content: "Food safety licensing, organic farming certifications, and chemical-free purity standards at Hadoti Farms." },
    ],
  }),
  component: StandardsPage,
});

const certificates = [
  {
    id: "fssai",
    title: "FSSAI Food Safety License",
    authority: "Food Safety and Standards Authority of India",
    desc: "Central processing and packaging license number 10726031000452. Governs all sun-cleaning, stone-milling, multi-grain custom blending, and hermetic heat-seal operations at our Kota processing facility.",
    image: "/images/certificate.png",
    icon: ShieldCheck,
    tag: "Lic. No. 10726031000452"
  },
  {
    id: "organic",
    title: "Organic Sourcing & Traceability",
    authority: "NPOP Organic Standards Verification",
    desc: "Strict verification audits covering our 400+ family grower cooperatives across Bundi, Jhalawar, and Kota districts. We trace and verify natural soil nutrient rotations, neem/manure composting cycles, and organic farming logs.",
    image: "/images/certificate.png",
    icon: Award,
    tag: "Sourcing Ethics Approved"
  },
  {
    id: "lab-report",
    title: "Zero-Pesticide Residue Validation",
    authority: "NABL Accredited Testing Facility",
    desc: "Rigorous batch-level chemical residue laboratory tests. Every single harvest lot is verified at certified NABL facilities, screening for 240+ common pesticides to ensure a zero-residue, pesticide-free footprint before milling.",
    image: "/images/certificate.png",
    icon: FileText,
    tag: "Lab Tested & Verified"
  }
];

function StandardsPage() {
  const [activeCert, setActiveCert] = useState<string | null>(null);

  const selected = certificates.find(c => c.id === activeCert);

  return (
    <>
      <section className="relative h-[80vh] bg-[color:var(--ink)] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(28,26,22,0.3) 0%, rgba(28,26,22,0.85) 100%), url('/images/farm_story.png')",
          }}
        />
        <GrainOverlay opacity={0.16} />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex items-end pb-24">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold)] mb-6">
              Purity & Credentials
            </div>
            <h1 className="font-display text-7xl md:text-[9rem] leading-[0.92] max-w-4xl">
              Sourced in truth. <span className="italic text-[color:var(--gold)]">Verified by standard.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-28 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-4">
              Our Purity Promise
            </div>
            <h2 className="font-display text-5xl leading-[1.05] max-w-md">
              Scientific rigor meets <span className="italic">traditional farming.</span>
            </h2>
            <p className="mt-6 text-[color:var(--muted-foreground)] leading-relaxed max-w-md">
              We believe that transparency shouldn't be a generic claim. Every batch of grains and spices that leaves our Kota facility is verified for chemical-free purity, licensed by official food safety registries, and sourced with absolute traceability.
            </p>
            <div className="mt-10 space-y-6">
              {[
                "100% Pesticide-free soil tracking",
                "FSSAI licensed hygienic processing",
                "Periodic NABL lab residue tests",
                "Empowering 400+ organic families"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-[color:var(--ink)]">
                  <CheckCircle size={16} className="text-[color:var(--earth)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            {certificates.map((cert) => (
              <div 
                key={cert.id} 
                className="group border border-[color:var(--border)] bg-[color:var(--cream)] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center transition-all hover:border-[color:var(--ink)]"
              >
                <div 
                  onClick={() => setActiveCert(cert.id)}
                  className="w-48 aspect-[1/1.414] bg-white border border-[color:var(--border)] shadow-sm overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in shrink-0"
                >
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                </div>
                <div className="flex-1 flex flex-col h-full justify-between items-start text-left">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--earth)] bg-[color:var(--bg)] px-3 py-1 border border-[color:var(--border)]">
                      {cert.tag}
                    </span>
                    <h3 className="font-display text-3xl mt-4 leading-tight">{cert.title}</h3>
                    <div className="font-mono text-[11px] text-[color:var(--muted-foreground)] mt-2 uppercase tracking-wider">
                      {cert.authority}
                    </div>
                    <p className="mt-4 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                      {cert.desc}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveCert(cert.id)}
                    className="story-link font-mono text-xs uppercase tracking-[0.2em] mt-6 flex items-center gap-2"
                  >
                    <cert.icon size={14} /> View Certificate Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-[color:var(--cream)] text-center">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="font-display text-5xl mb-6">Commitment to <span className="italic text-[color:var(--earth)]">purity.</span></h2>
          <p className="text-[color:var(--muted-foreground)] mb-10 leading-relaxed">
            All our certificates and standard tests are updated seasonally based on harvest cycles. If you require specific batch-level analysis reports or standard FSSAI license verification, please reach out.
          </p>
          <Link to="/contact">
            <button className="font-mono text-xs uppercase tracking-[0.2em] bg-[color:var(--ink)] text-white hover:bg-[color:var(--earth)] px-8 py-4 rounded-sm transition-colors">
              Contact Purity Officer →
            </button>
          </Link>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeCert && selected && (
        <div 
          onClick={() => setActiveCert(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row gap-8 bg-[color:var(--bg)] p-6 md:p-10 border border-[color:var(--border)] overflow-y-auto cursor-default" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setActiveCert(null)}
              className="absolute top-6 right-6 font-mono text-xs uppercase tracking-[0.2em] hover:text-[color:var(--earth)]"
            >
              Close ✕
            </button>
            <div className="w-full md:w-1/2 max-h-[75vh] bg-white border border-[color:var(--border)] overflow-hidden flex items-center justify-center">
              <img 
                src={selected.image} 
                alt={selected.title} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between py-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--earth)] bg-[color:var(--cream)] px-3 py-1 border border-[color:var(--border)]">
                  {selected.tag}
                </span>
                <h2 className="font-display text-4xl mt-6">{selected.title}</h2>
                <div className="font-mono text-xs text-[color:var(--muted-foreground)] mt-2 uppercase tracking-widest leading-relaxed">
                  {selected.authority}
                </div>
                <p className="mt-6 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                  {selected.desc}
                </p>
                <div className="mt-8 border-t border-[color:var(--border)] pt-6 space-y-4 font-mono text-[11px] text-[color:var(--muted-foreground)]">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-[color:var(--earth)] font-bold">Active & Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Region:</span>
                    <span>Hadoti (Kota, Bundi, Jhalawar)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scope:</span>
                    <span>Processing, Sourcing & Blending</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveCert(null)}
                className="font-mono text-xs uppercase tracking-[0.2em] bg-[color:var(--ink)] text-white hover:bg-[color:var(--earth)] w-full py-4 mt-8 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
