import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Ruler, CalendarDays, ShieldCheck, ShoppingCart } from "lucide-react";
import { useCart, type RentalPeriod } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { toast } from "sonner";

const badges = [
  { icon: Ruler, text: "До 20 м с земли" },
  { icon: CalendarDays, text: "Аренда от 1 дня" },
  { icon: ShieldCheck, text: "Тест перед покупкой" },
];

const periodLabels: Record<RentalPeriod, string> = {
  day: "день",
  week: "неделя",
  month: "месяц",
};

const formatPrice = (n: number) => n.toLocaleString("ru-RU") + " ₽";

const HeroSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { heroImageUrl } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      period: item.period,
      price: item.prices[item.period] * item.quantity,
    }));

    await addOrder({
      name,
      phone,
      city,
      items: orderItems,
      total: totalPrice,
    });

    toast.success("Заявка отправлена!", {
      description: items.length > 0
        ? `${items.length} позиц. на сумму ${formatPrice(totalPrice)}`
        : "Мы свяжемся с вами в ближайшее время",
    });

    clearCart();
    setName("");
    setPhone("");
    setCity("");
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
                Аренда WFP оборудования для&nbsp;мойки фасадов и&nbsp;остекления
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Подберём комплект под ваш объект, чтобы вы могли начать работу без&nbsp;покупки дорогого оборудования на&nbsp;старте.
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

              {/* Cart summary */}
              {items.length > 0 && (
                <div className="rounded-md border border-primary/20 bg-primary/5 p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShoppingCart size={16} className="text-primary" />
                    Товары в заявке
                  </div>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between text-xs text-muted-foreground">
                        <span className="truncate mr-2">
                          {item.name} × {item.quantity} ({periodLabels[item.period]})
                        </span>
                        <span className="shrink-0 font-medium text-foreground">
                          {formatPrice(item.prices[item.period] * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-xs font-bold text-foreground border-t border-primary/10 pt-1.5">
                    <span>Итого</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              )}

              <Input placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input placeholder="Телефон" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <Input placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} required />
              <Button type="submit" className="w-full gap-2 font-semibold">
                {items.length > 0 ? "Оформить заявку" : "Отправить заявку"} <ArrowRight size={16} />
              </Button>
              <p className="text-xs text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" className="underline hover:text-primary">политикой конфиденциальности</a>
              </p>
            </form>
          </div>

          {/* Right — hero image */}
          <div className="hidden lg:flex items-center justify-center">
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt="WFP оборудование для мойки фасадов"
                className="w-full max-w-md rounded-lg object-cover aspect-[4/5] shadow-md"
              />
            ) : (
              <div className="relative w-full aspect-[4/5] max-w-md rounded-lg bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-8">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-sm font-medium text-muted-foreground">
                  Загрузите фото в&nbsp;админке<br />Настройки → Hero-изображение
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
