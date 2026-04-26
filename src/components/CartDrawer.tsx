import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart, type RentalPeriod } from "@/contexts/CartContext";

const periodLabels: Record<RentalPeriod, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
};

const formatPrice = (n: number) =>
  n.toLocaleString("ru-RU") + " ₽";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, updatePeriod, totalItems, totalPrice, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Корзина">
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">Корзина</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Корзина пуста
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-lg border bg-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-foreground leading-snug">{item.name}</h4>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0" aria-label="Удалить">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Period selector */}
                  <div className="flex gap-1">
                    {(Object.keys(periodLabels) as RentalPeriod[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => updatePeriod(item.id, p)}
                        className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                          item.period === p
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {periodLabels[p]}
                      </button>
                    ))}
                  </div>

                  {/* Quantity + line total */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 rounded-md border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-md border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {formatPrice(item.prices[item.period] * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Итого</span>
                <span className="text-lg font-bold text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Финальная стоимость уточняется менеджером с учётом сроков, объёма и условий аренды.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearCart} className="text-xs">
                  Очистить
                </Button>
                <Button
                  className="flex-1 font-semibold"
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => {
                      document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                  }}
                >
                  Оформить заявку
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
