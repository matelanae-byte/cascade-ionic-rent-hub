import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const SelectAndQuoteSection = () => {
  // Параметры объекта
  const [taskType, setTaskType] = useState("");
  const [area, setArea] = useState("");
  const [people, setPeople] = useState("");
  const [height, setHeight] = useState("");
  const [rentalTerm, setRentalTerm] = useState("");
  const [city, setCity] = useState("");
  // Контакты
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // Доп.
  const [comment, setComment] = useState("");
  const [agreed, setAgreed] = useState(false);

  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { heroTexts } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Необходимо согласие на обработку персональных данных");
      return;
    }

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
      taskType: taskType || undefined,
      area: area || undefined,
      people: people || undefined,
      height: height || undefined,
      rentalTerm: rentalTerm || undefined,
      comment: comment || undefined,
    });

    toast.success("Заявка отправлена!", {
      description: "Мы подберём комплект и свяжемся с вами с расчётом стоимости",
    });

    clearCart();
    setTaskType("");
    setArea("");
    setPeople("");
    setHeight("");
    setRentalTerm("");
    setCity("");
    setName("");
    setPhone("");
    setComment("");
    setAgreed(false);
  };

  const privacyKey = "политикой конфиденциальности";
  const privacyIdx = heroTexts.privacyNote.toLowerCase().indexOf(privacyKey);
  const privacyBefore =
    privacyIdx >= 0 ? heroTexts.privacyNote.slice(0, privacyIdx) : heroTexts.privacyNote + " ";
  const privacyAfter = privacyIdx >= 0 ? heroTexts.privacyNote.slice(privacyIdx + privacyKey.length) : "";

  return (
    <section id="lead-form" className="py-20 md:py-28 bg-muted/40 border-y border-border">
      <div className="container max-w-3xl">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">
            Подбор и расчет
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Подбор и расчет оборудования
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Оставьте параметры объекта — мы подберем комплект и рассчитаем стоимость аренды
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-[0_2px_24px_-12px_hsl(var(--primary)/0.2)] space-y-5"
        >
          {/* Параметры объекта */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Тип задачи</label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Мойка фасадов">Мойка фасадов</SelectItem>
                  <SelectItem value="Мойка окон">Мойка окон</SelectItem>
                  <SelectItem value="Мойка витрин">Мойка витрин</SelectItem>
                  <SelectItem value="Послестроительная уборка">Послестрой. уборка</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Площадь (м²)</label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="До 100 м²">До 100 м²</SelectItem>
                  <SelectItem value="До 500 м²">До 500 м²</SelectItem>
                  <SelectItem value="Более 500 м²">Более 500 м²</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Количество человек</label>
              <Select value={people} onValueChange={setPeople}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 человек">1 человек</SelectItem>
                  <SelectItem value="2 человека">2 человека</SelectItem>
                  <SelectItem value="3 и более">3 и более</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Высота объекта</label>
              <Select value={height} onValueChange={setHeight}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="До 5 м">До 5 м</SelectItem>
                  <SelectItem value="До 10 м">До 10 м</SelectItem>
                  <SelectItem value="До 15 м">До 15 м</SelectItem>
                  <SelectItem value="До 20 м">До 20 м</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Срок аренды</label>
              <Select value={rentalTerm} onValueChange={setRentalTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="День">День</SelectItem>
                  <SelectItem value="Неделя">Неделя</SelectItem>
                  <SelectItem value="Месяц">Месяц</SelectItem>
                  <SelectItem value="Более месяца">Более месяца</SelectItem>
                  <SelectItem value="Другое">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Город</label>
              <Input placeholder="Ваш город" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
          </div>

          {/* Сводка корзины */}
          {items.length > 0 && (
            <div className="rounded-md border border-primary/15 bg-primary/[0.04] p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShoppingCart size={16} className="text-primary" />
                Вы выбрали:
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

          {/* Контакты */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
            <Input
              placeholder="Телефон"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={30}
            />
          </div>

          {/* Комментарий */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Комментарий</label>
            <Textarea
              placeholder="Дополнительная информация об объекте или задаче"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-0.5"
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
              Я согласен на обработку персональных данных в соответствии с{" "}
              <a href="/privacy" className="underline hover:text-primary">
                политикой конфиденциальности
              </a>
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!agreed}
            className="w-full md:w-auto h-12 px-8 gap-2 font-semibold"
          >
            Получить расчет
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

export default SelectAndQuoteSection;
