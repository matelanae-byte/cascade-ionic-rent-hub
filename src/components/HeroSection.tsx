import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const HeroSection = () => {
  const { heroImageUrl, heroTexts } = useSiteSettings();

  const benefits = [heroTexts.badge1, heroTexts.badge2, heroTexts.badge3].filter((b) => b?.trim());

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — offer */}
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                {heroTexts.eyebrow}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
                {heroTexts.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                {heroTexts.subtitle}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 gap-2 font-semibold">
                <a href="#lead-form">
                  Рассчитать аренду <ArrowRight size={18} />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 font-semibold">
                <a href="#catalog">Смотреть каталог</a>
              </Button>
            </div>

            {/* Benefits checklist */}
            {benefits.length > 0 && (
              <ul className="space-y-2.5 pt-2">
                {benefits.map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm md:text-base text-foreground/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right — hero image */}
          <div className="hidden lg:flex items-center justify-center">
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt="WFP оборудование для мойки фасадов"
                width={448}
                height={560}
                fetchPriority="high"
                decoding="async"
                loading="eager"
                className="w-full max-w-md rounded-xl object-cover aspect-[4/5] shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.35)]"
              />
            ) : (
              <div className="relative w-full aspect-[4/5] max-w-md rounded-xl bg-muted border border-border flex flex-col items-center justify-center text-center p-8">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-sm font-medium text-muted-foreground">
                  Загрузите фото в&nbsp;админке<br />Настройки → Hero-изображение
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
