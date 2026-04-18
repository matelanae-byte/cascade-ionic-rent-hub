import { Building2, HardHat, Briefcase, User } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const icons = [Building2, Briefcase, HardHat, User];

const ForWhomSection = () => {
  const { forWhomTexts } = useSiteSettings();
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{forWhomTexts.title}</h2>
          {forWhomTexts.subtitle && (
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{forWhomTexts.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {forWhomTexts.items.map((item, i) => {
            const Icon = icons[i] ?? Building2;
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

export default ForWhomSection;
