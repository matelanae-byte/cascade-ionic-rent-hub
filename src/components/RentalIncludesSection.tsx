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
    <section className="py-20 md:py-28 bg-[hsl(var(--footer-bg))] text-white">
      <div className="container">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">Комплект</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Что входит в аренду</h2>
          <p className="mt-4 text-base text-white/60">
            Вы получаете готовый комплект под задачу, чтобы выйти на объект без лишних затрат времени на подбор.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-7 space-y-4 transition-colors hover:border-white/20"
            >
              <div className="w-11 h-11 rounded-md bg-white/10 flex items-center justify-center">
                <item.icon size={22} className="text-white/80" />
              </div>
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentalIncludesSection;
