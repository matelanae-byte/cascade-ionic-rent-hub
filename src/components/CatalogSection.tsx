import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useProducts, iconMap } from "@/contexts/ProductsContext";
import { toast } from "sonner";
import type { Product } from "@/contexts/ProductsContext";

const formatPrice = (n: number) => n.toLocaleString("ru-RU") + " ₽";

const CatalogSection = () => {
  const { addItem } = useCart();
  const { visibleProducts } = useProducts();

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, name: p.name, prices: p.prices });
    toast.success(`${p.name} добавлен в корзину`);
  };

  return (
    <section id="catalog" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Каталог аренды</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Профессиональное WFP-оборудование для мойки фасадов и окон
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((p) => {
            const Icon = iconMap[p.iconName] || Package;
            return (
              <div
                key={p.id}
                className="group rounded-lg border bg-card p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</span>
                  </div>
                  <div className="w-full aspect-[3/2] rounded-md bg-muted flex items-center justify-center overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={40} className="text-muted-foreground/40" />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground leading-snug">{p.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-xs text-muted-foreground">День</p>
                      <p className="text-sm font-bold text-foreground">{formatPrice(p.prices.day)}</p>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-xs text-muted-foreground">Неделя</p>
                      <p className="text-sm font-bold text-foreground">{formatPrice(p.prices.week)}</p>
                    </div>
                    <div className="rounded-md bg-primary/10 p-2 ring-1 ring-primary/20">
                      <p className="text-xs text-primary">Месяц</p>
                      <p className="text-sm font-bold text-primary">{formatPrice(p.prices.month)}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleAdd(p)} className="w-full font-semibold gap-2">
                    <ShoppingCart size={16} />
                    В корзину
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
