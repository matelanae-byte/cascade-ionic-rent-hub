import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Ruler, CalendarDays, ShieldCheck } from "lucide-react";

const badges = [
  { icon: Ruler, text: "До 20 м с земли" },
  { icon: CalendarDays, text: "Аренда от 1 дня" },
  { icon: ShieldCheck, text: "Тест перед покупкой" },
];

const HeroSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: интеграция с бэкендом
    alert(`Заявка отправлена: ${name}, ${phone}, ${city}`);
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — offer + form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                cascade ionic
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground">
                Аренда оборудования для&nbsp;мойки фасадов по&nbsp;всей&nbsp;России
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                WFP-технология: моем окна и&nbsp;фасады с&nbsp;земли до&nbsp;20&nbsp;метров. Без&nbsp;люлек, без&nbsp;альпинистов, без&nbsp;рисков.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {badges.map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-2 rounded-md border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm"
                >
                  <b.icon size={18} className="text-primary shrink-0" />
                  {b.text}
                </div>
              ))}
            </div>

            {/* Form */}
            <form
              id="hero-form"
              onSubmit={handleSubmit}
              className="rounded-lg border bg-card p-6 shadow-sm space-y-4 max-w-md"
            >
              <p className="text-sm font-semibold text-foreground">Получите расчёт аренды за 15 минут</p>
              <Input placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input placeholder="Телефон" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <Input placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} required />
              <Button type="submit" className="w-full gap-2 font-semibold">
                Отправить заявку <ArrowRight size={16} />
              </Button>
              <p className="text-xs text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" className="underline hover:text-primary">политикой конфиденциальности</a>
              </p>
            </form>
          </div>

          {/* Right — image placeholder */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full aspect-[4/5] max-w-md rounded-lg bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">🏗️</div>
              <p className="text-sm font-medium text-muted-foreground">
                Здесь будет фото оператора<br />с WFP-штангой у фасада
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">Загрузите изображение позже</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
