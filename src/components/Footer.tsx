import { Link } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import BrandWordmark from "@/components/BrandWordmark";

// ─── Ссылки на соцсети — меняйте здесь ───────────────────────────────
const SOCIAL_VK  = "https://vk.com/";   // ВКонтакте: вставьте вашу ссылку здесь
const SOCIAL_TG  = "https://t.me/";     // Telegram:  вставьте вашу ссылку здесь
const SOCIAL_MAX = "https://max.ru/";   // MAX:       вставьте вашу ссылку здесь
// ─────────────────────────────────────────────────────────────────────

const VkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M13.16 17.5c-5.5 0-8.95-3.86-9.08-10.27h2.83c.09 4.71 2.23 6.7 3.86 7.1V7.23h2.7v4.05c1.57-.17 3.22-2.02 3.78-4.05h2.66c-.43 2.5-2.22 4.35-3.5 5.11 1.28.62 3.32 2.24 4.1 5.16h-2.93c-.6-1.93-2.13-3.42-4.11-3.62v3.62h-.31z"/>
  </svg>
);
const TgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M21.95 4.36 18.7 19.7c-.24 1.08-.88 1.34-1.78.83l-4.92-3.62-2.37 2.28c-.26.26-.48.48-.99.48l.35-5 9.1-8.22c.4-.35-.09-.55-.62-.2L6.21 13.2 1.36 11.69c-1.05-.33-1.07-1.05.22-1.55L20.6 2.97c.88-.32 1.65.2 1.35 1.39z"/>
  </svg>
);
// MAX (мессенджер): нет в Lucide — используем монограмму
const MaxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M5 4h2.7l3 5.4h.1L13.8 4h2.7v16h-2.5V8.6h-.1l-2.7 4.8h-.6L7.9 8.6h-.1V20H5V4z"/>
  </svg>
);

const SOCIALS = [
  { href: SOCIAL_VK,  label: "ВКонтакте", Icon: VkIcon },
  { href: SOCIAL_TG,  label: "Telegram",  Icon: TgIcon },
  { href: SOCIAL_MAX, label: "MAX",       Icon: MaxIcon },
];

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
            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
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
