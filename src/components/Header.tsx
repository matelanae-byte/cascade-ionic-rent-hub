import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="cascade ionic" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          <a href="#catalog" className="hover:text-primary transition-colors">Каталог</a>
          <Link to="/delivery" className="hover:text-primary transition-colors">Доставка</Link>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
        </nav>

        <a
          href="#hero-form"
          className="hidden md:inline-flex h-10 px-6 items-center rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Оставить заявку
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-card px-6 py-4 space-y-3 text-sm font-medium">
          <a href="#catalog" className="block hover:text-primary" onClick={() => setMenuOpen(false)}>Каталог</a>
          <Link to="/delivery" className="block hover:text-primary" onClick={() => setMenuOpen(false)}>Доставка</Link>
          <a href="#faq" className="block hover:text-primary" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#contacts" className="block hover:text-primary" onClick={() => setMenuOpen(false)}>Контакты</a>
          <a
            href="#hero-form"
            className="inline-flex h-10 px-6 items-center rounded-md bg-primary text-primary-foreground text-sm font-semibold"
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
