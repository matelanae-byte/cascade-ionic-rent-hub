import { SlidersHorizontal, Wallet, ListChecks, Headphones } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const icons = [SlidersHorizontal, Wallet, ListChecks, Headphones];

const WhyUsSection = () => {
  const { whyUsTexts } = useSiteSettings();
  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">Почему мы</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {whyUsTexts.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUsTexts.items.map((item, i) => {
            const Icon = icons[i] ?? SlidersHorizontal;
            return (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-7 space-y-4 transition-all hover:border-primary/20 hover:shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.18)]"
              >
                <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
