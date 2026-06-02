import { Link } from "@tanstack/react-router";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[color:var(--ink)] text-white/80 mt-0 overflow-hidden">
      <GrainOverlay opacity={0.08} />
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-20 grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link to="/" className="inline-block">
            <img src="/Creatives/whiteLogo.png" alt="Hadoti Farms" className="h-32 object-contain" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            From Hadoti fields to your kitchen. Farm-direct staples, custom-blended, packed in Kota.
          </p>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
            FSSAI Lic. No. 10726031000452
          </div>
          <div className="mt-6 flex gap-4 text-white/50">
            <a href="https://instagram.com/hadotifarms" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--gold)] transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com/hadotifarms" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--gold)] transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com/hadotifarms" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--gold)] transition-colors" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://youtube.com/hadotifarms" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--gold)] transition-colors" aria-label="Youtube">
              <Youtube size={18} />
            </a>
          </div>
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
          ["/shipping", "Shipping & Delivery"],
          ["/refunds", "Refunds & Cancellations"],
          ["/disclaimer", "Health Disclaimer"],
        ]} />
      </div>
      <div className="relative border-t border-white/10 py-6 px-6 lg:px-10 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-3 md:justify-between text-xs font-mono text-white/50">
        <span>© 2026 Hadoti Farms · Made in Kota, Rajasthan</span>
        <div className="flex gap-4 flex-wrap">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
        </div>
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
