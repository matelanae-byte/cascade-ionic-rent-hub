import { Button } from "@/components/ui/button";
import { Package, Grip, Droplets, Wrench } from "lucide-react";

interface Product {
  category: string;
  icon: React.ElementType;
  name: string;
  desc: string;
  prices: { day: string; week: string; month: string };
}

const products: Product[] = [
  {
    category: "Комплекты",
    icon: Package,
    name: "Комплект WFP для мойки фасадов до 15 м",
    desc: "Мобильный комплект для мойки фасадов и окон с земли до 15 метров: станция, штанга, щетка, шланг.",
    prices: { day: "7 000 ₽", week: "35 000 ₽", month: "90 000 ₽" },
  },
  {
    category: "Штанги",
    icon: Grip,
    name: "WFP-штанга 12 м (карбон)",
    desc: "Легкая карбоновая телескопическая штанга для мойки окон и фасадов до 12 м.",
    prices: { day: "3 000 ₽", week: "12 000 ₽", month: "30 000 ₽" },
  },
  {
    category: "Штанги",
    icon: Grip,
    name: "WFP-штанга 15 м (карбон)",
    desc: "Усиленная карбоновая штанга для работы до 15 м с земли.",
    prices: { day: "4 000 ₽", week: "16 000 ₽", month: "40 000 ₽" },
  },
  {
    category: "Системы подачи воды",
    icon: Droplets,
    name: "Станция подготовки воды для WFP",
    desc: "Система очищенной воды для мойки фасадов и окон без разводов.",
    prices: { day: "5 000 ₽", week: "20 000 ₽", month: "55 000 ₽" },
  },
  {
    category: "Доп. оборудование",
    icon: Wrench,
    name: "Насос-дозатор химии",
    desc: "Подача химии для сложных загрязнений и мойки витрин.",
    prices: { day: "2 000 ₽", week: "8 000 ₽", month: "20 000 ₽" },
  },
  {
    category: "Доп. оборудование",
    icon: Wrench,
    name: "Шланг высокого давления с катушкой",
    desc: "Шланг с катушкой для удобной работы на объекте, подключение к станции.",
    prices: { day: "1 500 ₽", week: "6 000 ₽", month: "15 000 ₽" },
  },
];

const CatalogSection = () => {
  return (
    <section id="catalog" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Каталог аренды</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Профессиональное WFP-оборудование для мойки фасадов и окон
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              className="group rounded-lg border bg-card p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</span>
                </div>
                <div className="w-full aspect-[3/2] rounded-md bg-muted flex items-center justify-center">
                  <p.icon size={40} className="text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold text-foreground leading-snug">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">День</p>
                    <p className="text-sm font-bold text-foreground">{p.prices.day}</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">Неделя</p>
                    <p className="text-sm font-bold text-foreground">{p.prices.week}</p>
                  </div>
                  <div className="rounded-md bg-primary/10 p-2 ring-1 ring-primary/20">
                    <p className="text-xs text-primary">Месяц</p>
                    <p className="text-sm font-bold text-primary">{p.prices.month}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full font-semibold">Подробнее</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
