import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const AboutSection = () => {
  const { aboutTexts } = useSiteSettings();
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{aboutTexts.title}</h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
          {aboutTexts.body}
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
