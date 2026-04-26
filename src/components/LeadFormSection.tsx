import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ShoppingCart } from "lucide-react";
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

const LeadFormSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { heroTexts } = useSiteSettings();

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
      description:
        items.length > 0
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
    <section id="lead-form" className="py-20 md:py-28 bg-muted/40 border-y border-border">
      <div className="container max-w-3xl">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">Заявка</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {heroTexts.formTitle}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Оставьте контакты — рассчитаем стоимость аренды под ваш объект
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-[0_2px_24px_-12px_hsl(var(--primary)/0.2)] space-y-5"
        >
          {/* Cart summary */}
          {items.length > 0 && (
            <div className="rounded-md border border-primary/15 bg-primary/[0.04] p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShoppingCart size={16} className="text-primary" />
                Товары в заявке
              </div>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-muted-foreground">
                    <span className="truncate mr-2">
                      {item.name} × {item.quantity} ({periodLabels[item.period]})
                    </span>
                    <span className="shrink-0 font-medium text-foreground">
                      {formatPrice(item.prices[item.period] * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-sm font-bold text-foreground border-t border-primary/10 pt-2">
                <span>Итого</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input placeholder="Телефон" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>

          <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8 gap-2 font-semibold">
            {items.length > 0 ? heroTexts.submitLabelWithCart : heroTexts.submitLabel}
            <ArrowRight size={16} />
          </Button>

          <p className="text-xs text-muted-foreground">
            {privacyBefore}
            <a href="/privacy" className="underline hover:text-primary">
              {privacyKey}
            </a>
            {privacyAfter}
          </p>
        </form>
      </div>
    </section>
  );
};

export default LeadFormSection;
