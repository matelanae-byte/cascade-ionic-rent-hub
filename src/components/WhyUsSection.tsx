import { SlidersHorizontal, Wallet, ListChecks, Headphones } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const icons = [SlidersHorizontal, Wallet, ListChecks, Headphones];

const WhyUsSection = () => {
  const { whyUsTexts } = useSiteSettings();
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          {whyUsTexts.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUsTexts.items.map((item, i) => {
            const Icon = icons[i] ?? SlidersHorizontal;
            return (
              <div
                key={i}
                className="rounded-lg border bg-background p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon size={24} className="text-primary" />
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
