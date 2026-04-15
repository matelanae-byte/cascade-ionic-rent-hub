import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    q: "Какой минимальный срок аренды?",
    a: "Минимальный срок аренды — 1 день. Для длительных проектов предлагаем скидки на недельную и месячную аренду.",
  },
  {
    q: "Доставляете ли вы оборудование в регионы?",
    a: "Да, мы доставляем оборудование по всей России через надёжные транспортные компании. Срок доставки — от 1 до 5 рабочих дней в зависимости от региона.",
  },
  {
    q: "Нужен ли опыт работы с WFP-оборудованием?",
    a: "Базовый опыт желателен, но не обязателен. Мы предоставляем инструкции и консультации по использованию оборудования.",
  },
  {
    q: "Что входит в стоимость аренды?",
    a: "В стоимость аренды входит всё оборудование по выбранной позиции, проверка работоспособности перед отправкой и консультационная поддержка на весь срок.",
  },
  {
    q: "Можно ли протестировать оборудование перед покупкой?",
    a: "Да. Программа «Тест перед покупкой» позволяет арендовать оборудование, оценить его в работе, и при покупке зачесть часть стоимости аренды.",
  },
  {
    q: "Как оформить заявку?",
    a: "Оставьте заявку через форму на сайте или позвоните по телефону. Мы свяжемся с вами в течение 15 минут для уточнения деталей.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Частые вопросы</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-lg border bg-card px-6"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
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
