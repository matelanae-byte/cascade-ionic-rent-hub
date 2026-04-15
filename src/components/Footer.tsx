import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer id="contacts" className="bg-footer-bg text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="cascade ionic" className="h-10 w-auto rounded" />
            <p className="text-sm text-white/60 leading-relaxed">
              Аренда профессионального оборудования для мойки фасадов и&nbsp;окон по&nbsp;всей России.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Навигация</h4>
            <nav className="flex flex-col gap-2 text-sm text-white/70">
              <a href="#catalog" className="hover:text-white transition-colors">Каталог</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">Как это работает</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Документы</h4>
            <nav className="flex flex-col gap-2 text-sm text-white/70">
              <Link to="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
              <Link to="/offer" className="hover:text-white transition-colors">Публичная оферта</Link>
            </nav>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Контакты</h4>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <a href="tel:+78001234567" className="hover:text-white transition-colors">+7 (800) 123-45-67</a>
              <a href="mailto:info@cascadeionic.ru" className="hover:text-white transition-colors">info@cascadeionic.ru</a>
              <p>Москва, Россия</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} cascade ionic. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
