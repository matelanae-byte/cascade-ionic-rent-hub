import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import BrandWordmark from "@/components/BrandWordmark";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { headerTexts } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#F28C28] to-[#6B4FB3] shadow-md">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center min-w-0" aria-label={headerTexts.brand}>
          <BrandWordmark text={headerTexts.brand} className="text-white" sizeClass="text-lg sm:text-xl md:text-2xl" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
          {headerTexts.links.map((l, i) => (
            <a key={i} href={l.href} className="hover:text-white transition-colors">{l.label}</a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <CartDrawer />
          <a
            href={headerTexts.ctaHref}
            className="inline-flex h-10 px-6 items-center rounded-md bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors shadow-sm whitespace-nowrap"
          >
            {headerTexts.ctaLabel}
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-1">
          <CartDrawer />
          <button
            className="p-2 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/20 bg-[#6B4FB3]/90 backdrop-blur px-6 py-4 space-y-3 text-sm font-medium text-white">
          {headerTexts.links.map((l, i) => (
            <a key={i} href={l.href} className="block hover:text-white/80" onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a
            href={headerTexts.ctaHref}
            className="inline-flex h-10 px-6 items-center rounded-md bg-white text-foreground text-sm font-semibold"
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
