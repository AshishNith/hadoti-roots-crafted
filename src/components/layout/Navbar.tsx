import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/store";
import { gsap } from "@/lib/gsap";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/customize", label: "Customize" },
  { to: "/our-farms", label: "Our Farms" },
  { to: "/blog", label: "Blog" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const count = useCart((s) => s.count());
  const location = useLocation();

  const isDarkHeroPage = location.pathname === "/" || location.pathname === "/our-farms";

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (open && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current.querySelectorAll("[data-stagger]"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power3.out", delay: 0.1 },
      );
    }
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[color:var(--cream)]/95 backdrop-blur shadow-[0_1px_0_rgba(0,0,0,0.06)] py-3 text-[color:var(--ink)]"
            : isDarkHeroPage
            ? "bg-transparent py-6 text-white"
            : "bg-transparent py-6 text-[color:var(--ink)]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">
          <Link
            to="/"
            className="flex items-center"
          >
            <img
              src={scrolled || !isDarkHeroPage ? "/images/logo-dark.png" : "/images/logo-light.png"}
              alt="Hadoti Farms"
              className={`transition-all duration-300 object-contain ${
                scrolled ? "h-16" : "h-16"
              }`}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="story-link font-body text-[13px] uppercase tracking-[0.18em]"
                activeProps={{ className: "font-bold" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              aria-label="Search"
              className={`transition-colors ${
                isDarkHeroPage && !scrolled
                  ? "hover:text-[color:var(--gold)]"
                  : "hover:text-[color:var(--earth)]"
              }`}
            >
              <Search size={18} />
            </button>
            <Link
              to="/account"
              aria-label="Account"
              className={`hidden sm:inline-flex transition-colors ${
                isDarkHeroPage && !scrolled
                  ? "hover:text-[color:var(--gold)]"
                  : "hover:text-[color:var(--earth)]"
              }`}
            >
              <User size={18} />
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className={`relative transition-colors ${
                isDarkHeroPage && !scrolled
                  ? "hover:text-[color:var(--gold)]"
                  : "hover:text-[color:var(--earth)]"
              }`}
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span
                  className={`absolute -top-2 -right-2 text-[10px] font-mono w-5 h-5 rounded-full flex items-center justify-center ${
                    isDarkHeroPage && !scrolled
                      ? "bg-[color:var(--gold)] text-black"
                      : "bg-[color:var(--earth)] text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
            <button
              className="md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div ref={overlayRef} className="fixed inset-0 z-[60] bg-[color:var(--ink)] text-white">
          <button
            className="absolute top-6 right-6"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
          <nav className="h-full flex flex-col items-start justify-center gap-6 px-10">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-stagger
                onClick={() => setOpen(false)}
                className="font-display text-5xl italic text-[color:var(--gold)]"
              >
                {l.label}
              </Link>
            ))}
            <div className="h-[1px] w-32 bg-[color:var(--gold)]/20 my-2" data-stagger />
            <Link
              to="/account"
              data-stagger
              onClick={() => setOpen(false)}
              className="font-display text-3xl italic text-white/70 hover:text-white"
            >
              Account Dashboard
            </Link>
            <Link
              to="/cart"
              data-stagger
              onClick={() => setOpen(false)}
              className="font-display text-3xl italic text-white/70 hover:text-white flex items-center gap-3"
            >
              Shopping Cart {count > 0 && <span className="font-mono text-xs bg-[color:var(--gold)] text-black px-2 py-0.5 rounded-full">{count}</span>}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
