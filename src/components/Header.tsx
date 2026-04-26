import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { headerTexts } = useSiteSettings();

  // Resolve CTA href: if it's an anchor that doesn't exist on the page,
  // fall back to #lead-form (the unified quote form).
  const resolveAnchor = (href: string) => {
    if (!href?.startsWith("#") || href === "#") return "#lead-form";
    if (typeof document !== "undefined" && !document.getElementById(href.slice(1))) {
      return "#lead-form";
    }
    return href;
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = resolveAnchor(href);
    if (!target.startsWith("#")) return;
    const el = document.getElementById(target.slice(1));
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-border">
      <div className="container flex h-16 md:h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center min-w-0" aria-label={headerTexts.brand}>
          <img
            src={logo}
            alt={headerTexts.brand}
            className="h-14 md:h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/65">
          {headerTexts.links.map((l, i) => (
            <a key={i} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={resolveAnchor(headerTexts.ctaHref)}
            onClick={(e) => handleAnchorClick(e, headerTexts.ctaHref)}
            className="inline-flex h-10 px-5 items-center rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
          >
            {headerTexts.ctaLabel}
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-5 space-y-4 text-sm font-medium text-foreground/80">
          {headerTexts.links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="block hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href={resolveAnchor(headerTexts.ctaHref)}
            className="inline-flex h-10 px-5 items-center rounded-md bg-primary text-primary-foreground text-sm font-semibold"
            onClick={(e) => {
              setMenuOpen(false);
              handleAnchorClick(e, headerTexts.ctaHref);
            }}
          >
            {headerTexts.ctaLabel}
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
