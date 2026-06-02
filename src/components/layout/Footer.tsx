import { Link } from "@tanstack/react-router";
import { GrainOverlay } from "@/components/ui/GrainOverlay";

export function Footer() {
  return (
    <footer className="relative bg-[color:var(--ink)] text-white/80 mt-32 overflow-hidden">
      <GrainOverlay opacity={0.08} />
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-20 grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link to="/" className="inline-block">
            <img src="/Creatives/whiteLogo.png" alt="Hadoti Farms" className="h-10 object-contain" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            From Hadoti fields to your kitchen. Farm-direct staples, custom-blended, packed in Kota.
          </p>
        </div>
        <FooterCol title="Shop" links={[
          ["/shop", "All Products"],
          ["/shop/dals", "Dals & Pulses"],
          ["/shop/masalas", "Masalas"],
          ["/shop/ration", "Ration Boxes"],
        ]} />
        <FooterCol title="Company" links={[
          ["/our-farms", "Our Farms"],
          ["/blog", "Journal"],
          ["/contact", "Contact"],
        ]} />
        <FooterCol title="Help" links={[
          ["/account", "My Account"],
          ["/contact", "Support"],
          ["/contact", "Shipping"],
        ]} />
      </div>
      <div className="relative border-t border-white/10 py-6 px-6 lg:px-10 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-3 md:justify-between text-xs font-mono text-white/50">
        <span>© 2026 Hadoti Farms · Made in Kota, Rajasthan</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="font-mono uppercase text-[11px] tracking-[0.2em] text-[color:var(--gold)] mb-4">
        {title}
      </div>
      <ul className="space-y-2 text-sm">
        {links.map(([to, label]) => (
          <li key={to + label}>
            <Link to={to} className="story-link">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
