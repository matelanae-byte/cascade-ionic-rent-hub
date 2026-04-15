import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import CartDrawer from "@/components/CartDrawer";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#F28C28] to-[#6B4FB3] shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="cascade ionic" className="h-10 w-auto rounded" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
          <a href="#catalog" className="hover:text-white transition-colors">Каталог</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#contacts" className="hover:text-white transition-colors">Контакты</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <CartDrawer />
          <a
            href="#hero-form"
            className="inline-flex h-10 px-6 items-center rounded-md bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors shadow-sm"
          >
            Оставить заявку
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
          <a href="#catalog" className="block hover:text-white/80" onClick={() => setMenuOpen(false)}>Каталог</a>
          <a href="#faq" className="block hover:text-white/80" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#contacts" className="block hover:text-white/80" onClick={() => setMenuOpen(false)}>Контакты</a>
          <a
            href="#hero-form"
            className="inline-flex h-10 px-6 items-center rounded-md bg-white text-foreground text-sm font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Оставить заявку
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
