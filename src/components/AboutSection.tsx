import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const AboutSection = () => {
  const { aboutTexts } = useSiteSettings();
  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">О компании</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">{aboutTexts.title}</h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
          {aboutTexts.body}
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
