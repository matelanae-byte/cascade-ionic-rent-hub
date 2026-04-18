import { Link } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import BrandWordmark from "@/components/BrandWordmark";

const Footer = () => {
  const { footerTexts } = useSiteSettings();

  return (
    <footer id="contacts" className="bg-footer-bg text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <BrandWordmark
              text={footerTexts.brand}
              className="text-white"
              sizeClass="text-2xl sm:text-3xl md:text-[2rem]"
            />
            <p className="text-sm text-white/60 leading-relaxed">
              {footerTexts.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">{footerTexts.navTitle}</h4>
            <nav className="flex flex-col gap-2 text-sm text-white/70">
              {footerTexts.navLinks.map((l, i) => (
                <a key={i} href={l.href} className="hover:text-white transition-colors">{l.label}</a>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">{footerTexts.legalTitle}</h4>
            <nav className="flex flex-col gap-2 text-sm text-white/70">
              <Link to="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
              <Link to="/offer" className="hover:text-white transition-colors">Публичная оферта</Link>
            </nav>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">{footerTexts.contactsTitle}</h4>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              {footerTexts.phone && (
                <a href={`tel:${footerTexts.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white transition-colors">
                  {footerTexts.phone}
                </a>
              )}
              {footerTexts.email && (
                <a href={`mailto:${footerTexts.email}`} className="hover:text-white transition-colors">
                  {footerTexts.email}
                </a>
              )}
              {footerTexts.address && <p>{footerTexts.address}</p>}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {footerTexts.copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
