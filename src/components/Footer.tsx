import { Link } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import BrandWordmark from "@/components/BrandWordmark";


// Outline icons — matching weight/style for visual consistency
const VkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M7.5 9.5c.4 3.2 2.1 5 4.5 5h.5V9.5M12.5 12c1.4-.3 2.7-1.4 3.3-2.5M16.5 14.5c-.6-1.3-1.9-2.2-3.3-2.5" />
  </svg>
);
const TgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <path d="M21 4 3 11l6 2 2 6 4-4 5 4 1-15z" />
    <path d="m9 13 8-6-6 8" />
  </svg>
);
const MaxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M7 16V8l3 4 3-4v8M16 8v8M14 12h4" />
  </svg>
);

const Footer = () => {
  const { footerTexts } = useSiteSettings();
  const { socials } = footerTexts;

  const socialClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/15 text-white/65 transition-all hover:ring-secondary/60 hover:text-white hover:scale-105";

  return (
    <footer id="contacts" className="bg-footer-bg text-white">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 max-w-sm">
            {/* Aligned to column headers via matching height/leading */}
            <div className="flex items-center h-4">
              <BrandWordmark
                text={footerTexts.brand}
                className="text-white"
                sizeClass="text-lg sm:text-xl"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {footerTexts.description}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socials.vk && (
                <a href={socials.vk} target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className={socialClass}>
                  <VkIcon className="h-4 w-4" />
                </a>
              )}
              {socials.telegram && (
                <a href={socials.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={socialClass}>
                  <TgIcon className="h-4 w-4" />
                </a>
              )}
              {socials.max && (
                <a href={socials.max} target="_blank" rel="noopener noreferrer" aria-label="MAX" className={socialClass}>
                  <MaxIcon className="h-4 w-4" />
                </a>
              )}
            </div>
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
