import { Droplets, Ruler, Package, HeadphonesIcon } from "lucide-react";

const items = [
  {
    icon: Droplets,
    title: "WFP-оборудование",
    desc: "Профессиональное решение для мойки фасадов и окон с земли.",
  },
  {
    icon: Ruler,
    title: "Телескопическая штанга",
    desc: "Подбираем нужную высоту под ваш объект и тип работ.",
  },
  {
    icon: Package,
    title: "Комплектующие для работы",
    desc: "Щетки, подача воды и необходимые элементы для запуска.",
  },
  {
    icon: HeadphonesIcon,
    title: "Поддержка и консультация",
    desc: "Помогаем подобрать комплект под задачу и объясняем, как начать работу.",
  },
];

const RentalIncludesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary text-secondary-foreground">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">Что входит в аренду</h2>
          <p className="mt-3 text-secondary-foreground/60 max-w-2xl mx-auto">
            Вы получаете готовый комплект под задачу, чтобы выйти на объект без лишних затрат времени на подбор.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-secondary-foreground/10 bg-secondary-foreground/5 p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-md bg-secondary-foreground/10 flex items-center justify-center">
                <item.icon size={24} className="text-secondary-foreground/80" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-secondary-foreground/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentalIncludesSection;
