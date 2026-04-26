import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const FAQSection = () => {
  const { faqTexts } = useSiteSettings();
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container max-w-3xl">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{faqTexts.title}</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqTexts.items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-lg border bg-card px-6"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
