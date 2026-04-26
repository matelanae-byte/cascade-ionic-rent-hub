import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import BrandWordmark from "@/components/BrandWordmark";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { headerTexts } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-border">
      <div className="container flex h-16 md:h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center min-w-0" aria-label={headerTexts.brand}>
          <BrandWordmark
            text={headerTexts.brand}
            className="text-foreground"
            sizeClass="text-base sm:text-lg md:text-xl"
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
            href={headerTexts.ctaHref}
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
            href={headerTexts.ctaHref}
            className="inline-flex h-10 px-5 items-center rounded-md bg-primary text-primary-foreground text-sm font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            {headerTexts.ctaLabel}
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
