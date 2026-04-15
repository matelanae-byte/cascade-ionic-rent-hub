import { SlidersHorizontal, Wallet, ListChecks, Headphones } from "lucide-react";

const items = [
  {
    icon: SlidersHorizontal,
    title: "Подбор под объект",
    desc: "Подбираем решение под высоту, тип фасада и формат работ.",
  },
  {
    icon: Wallet,
    title: "Без лишних вложений на старте",
    desc: "Не нужно сразу заходить в большие расходы, чтобы начать работать.",
  },
  {
    icon: ListChecks,
    title: "Понятный процесс",
    desc: "Объясняем, что подойдет под задачу и с чего лучше начать.",
  },
  {
    icon: Headphones,
    title: "Поддержка по вопросам выбора",
    desc: "Помогаем разобраться, чтобы клиент не тратил время на лишние поиски и ошибки.",
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          Почему с нами проще начать
        </h2>

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

export default WhyUsSection;
