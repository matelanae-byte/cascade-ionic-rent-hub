import { FileText, Search, Truck, Wrench } from "lucide-react";

const steps = [
  { icon: FileText, step: "01", title: "Заявка", desc: "Оставьте заявку на сайте или по телефону. Мы свяжемся за 15 минут." },
  { icon: Search, step: "02", title: "Подбор", desc: "Подберём оборудование под ваш объект: высота, задача, сроки." },
  { icon: Truck, step: "03", title: "Доставка", desc: "Отправим оборудование транспортной компанией в любой город РФ." },
  { icon: Wrench, step: "04", title: "Работа", desc: "Вы работаете, мы на связи. Поддержка и консультации на всём сроке аренды." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-foreground text-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">Как это работает по России</h2>
          <p className="mt-3 text-background/60 max-w-2xl mx-auto">
            От заявки до работы на объекте — 4 простых шага
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="relative space-y-4">
              <span className="text-5xl font-extrabold text-background/10">{s.step}</span>
              <div className="w-12 h-12 rounded-md bg-background/10 flex items-center justify-center">
                <s.icon size={24} className="text-background/80" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-background/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
