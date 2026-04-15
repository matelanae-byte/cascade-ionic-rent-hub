import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Clock, MapPin, Shield } from "lucide-react";

const features = [
  { icon: Truck, title: "Доставка ТК по РФ", desc: "Отправляем оборудование через СДЭК, Деловые Линии и другие надёжные транспортные компании." },
  { icon: Clock, title: "Сроки: 1–5 рабочих дней", desc: "В Москве и Санкт-Петербурге — на следующий день. В регионы — от 2 до 5 рабочих дней." },
  { icon: MapPin, title: "Более 1 000 городов", desc: "География доставки охватывает всю территорию России, включая крупные и средние города." },
  { icon: Shield, title: "Страховка груза", desc: "Каждая отправка застрахована. В случае повреждения при доставке — заменяем оборудование." },
];

const Delivery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Доставка по РФ</h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
              Доставляем оборудование cascade ionic в любой город России. Быстро, надёжно, с полной страховкой.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {features.map((f) => (
                <div key={f.title} className="rounded-lg border bg-card p-6 space-y-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <f.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border bg-card p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Порядок доставки</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li>Оформите заявку на аренду оборудования.</li>
                <li>Менеджер согласует с вами способ доставки и адрес.</li>
                <li>Мы упакуем и передадим оборудование транспортной компании.</li>
                <li>Вы получаете оборудование и приступаете к работе.</li>
                <li>По окончании аренды отправляете оборудование обратно тем же способом.</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Delivery;
