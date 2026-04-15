import { Building2, HardHat, Briefcase, User } from "lucide-react";

const items = [
  {
    icon: Building2,
    title: "Клининговые компании",
    desc: "Расширьте услуги без покупки дорогого оборудования. Берите технику под конкретный заказ.",
  },
  {
    icon: Briefcase,
    title: "Управляющие компании",
    desc: "Поддерживайте фасады жилых комплексов и бизнес-центров в чистоте.",
  },
  {
    icon: HardHat,
    title: "Строительные фирмы",
    desc: "Послестроительная уборка фасадов и остекления без привлечения альпинистов.",
  },
  {
    icon: User,
    title: "Частные мастера",
    desc: "Попробуйте WFP-технологию без крупных вложений. Тест перед покупкой.",
  },
];

const ForWhomSection = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Для кого подходит</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Оборудование cascade ionic используют профессионалы по всей России
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border bg-background p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <item.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;
