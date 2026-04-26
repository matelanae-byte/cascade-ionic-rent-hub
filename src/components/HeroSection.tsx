import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { useCart, type RentalPeriod } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { toast } from "sonner";

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
  const { heroImageUrl, heroTexts } = useSiteSettings();

  const benefits = [heroTexts.badge1, heroTexts.badge2, heroTexts.badge3].filter((b) => b?.trim());

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

  const privacyKey = "политикой конфиденциальности";
  const privacyIdx = heroTexts.privacyNote.toLowerCase().indexOf(privacyKey);
  const privacyBefore = privacyIdx >= 0 ? heroTexts.privacyNote.slice(0, privacyIdx) : heroTexts.privacyNote + " ";
  const privacyAfter = privacyIdx >= 0 ? heroTexts.privacyNote.slice(privacyIdx + privacyKey.length) : "";

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — offer + form */}
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                {heroTexts.eyebrow}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
                {heroTexts.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                {heroTexts.subtitle}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 gap-2 font-semibold">
                <a href="#hero-form">
                  Рассчитать аренду <ArrowRight size={18} />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 font-semibold">
                <a href="#catalog">Смотреть каталог</a>
              </Button>
            </div>

            {/* Benefits checklist */}
            {benefits.length > 0 && (
              <ul className="space-y-2.5 pt-2">
                {benefits.map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm md:text-base text-foreground/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            )}

            {/* Form */}
            <form
              id="hero-form"
              onSubmit={handleSubmit}
              className="rounded-xl border border-border bg-card p-6 md:p-7 shadow-[0_2px_24px_-12px_hsl(var(--primary)/0.25)] space-y-4 max-w-md"
            >
              <p className="text-base font-semibold text-foreground">{heroTexts.formTitle}</p>

              {/* Cart summary */}
              {items.length > 0 && (
                <div className="rounded-md border border-primary/15 bg-primary/[0.04] p-3 space-y-2">
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
              <Button type="submit" className="w-full h-11 gap-2 font-semibold">
                {items.length > 0 ? heroTexts.submitLabelWithCart : heroTexts.submitLabel} <ArrowRight size={16} />
              </Button>
              <p className="text-xs text-muted-foreground">
                {privacyBefore}
                <a href="/privacy" className="underline hover:text-primary">{privacyKey}</a>
                {privacyAfter}
              </p>
            </form>
          </div>

          {/* Right — hero image */}
          <div className="hidden lg:flex items-center justify-center">
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt="WFP оборудование для мойки фасадов"
                className="w-full max-w-md rounded-xl object-cover aspect-[4/5] shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.35)]"
              />
            ) : (
              <div className="relative w-full aspect-[4/5] max-w-md rounded-xl bg-muted border border-border flex flex-col items-center justify-center text-center p-8">
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
