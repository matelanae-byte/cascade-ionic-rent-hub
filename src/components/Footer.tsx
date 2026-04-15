import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer id="contacts" className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="cascade ionic" className="h-10 w-auto" />
            <p className="text-sm text-background/60 leading-relaxed">
              Аренда профессионального оборудования для мойки фасадов и&nbsp;окон по&nbsp;всей России.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-background/40">Навигация</h4>
            <nav className="flex flex-col gap-2 text-sm text-background/70">
              <a href="#catalog" className="hover:text-background transition-colors">Каталог</a>
              
              <a href="#how-it-works" className="hover:text-background transition-colors">Как это работает</a>
              <a href="#faq" className="hover:text-background transition-colors">FAQ</a>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-background/40">Документы</h4>
            <nav className="flex flex-col gap-2 text-sm text-background/70">
              <Link to="/privacy" className="hover:text-background transition-colors">Политика конфиденциальности</Link>
              <Link to="/offer" className="hover:text-background transition-colors">Публичная оферта</Link>
            </nav>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-background/40">Контакты</h4>
            <div className="flex flex-col gap-2 text-sm text-background/70">
              <a href="tel:+78001234567" className="hover:text-background transition-colors">+7 (800) 123-45-67</a>
              <a href="mailto:info@cascadeionic.ru" className="hover:text-background transition-colors">info@cascadeionic.ru</a>
              <p>Москва, Россия</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 text-center text-xs text-background/40">
          © {new Date().getFullYear()} cascade ionic. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
