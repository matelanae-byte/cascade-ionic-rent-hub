import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Ruler, Wrench } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useProducts, iconMap } from "@/contexts/ProductsContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { toast } from "sonner";
import type { Product } from "@/contexts/ProductsContext";

const formatPrice = (n: number) => n.toLocaleString("ru-RU") + " ₽";

/**
 * Supabase Storage Image Transformations.
 * Rewrites a public-object URL into a render/image URL that returns a
 * resized + compressed version of the image. Falls back to the original
 * URL for non-Supabase images (e.g. external URLs or data URLs).
 *
 * Example:
 *   .../object/public/product-images/wfp-kit-10.png
 *      → .../render/image/public/product-images/wfp-kit-10.png?width=600&quality=70
 */
const transformedImage = (src: string | undefined, width: number, quality = 65): string | undefined => {
  if (!src) return src;
  if (!src.includes("/storage/v1/object/public/")) return src;
  const rendered = src.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  const sep = rendered.includes("?") ? "&" : "?";
  // format=webp drastically reduces size (PNG ~450KB → WebP ~22KB at 480w).
  return `${rendered}${sep}width=${width}&quality=${quality}&resize=cover&format=webp`;
};

const buildSrcSet = (src: string | undefined): string | undefined => {
  if (!src || !src.includes("/storage/v1/object/public/")) return undefined;
  return [
    `${transformedImage(src, 400)} 400w`,
    `${transformedImage(src, 600)} 600w`,
    `${transformedImage(src, 900)} 900w`,
  ].join(", ");
};

const CatalogSection = () => {
  const { addItem } = useCart();
  const { visibleProducts } = useProducts();
  const { catalogTexts } = useSiteSettings();

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, name: p.name, prices: p.prices });
    toast.success(`${p.name} добавлен в заявку`);
    setTimeout(() => {
      document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <section id="catalog" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">
            Каталог
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {catalogTexts.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{catalogTexts.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProducts.map((p, idx) => {
            const Icon = iconMap[p.iconName] || Package;
            // First 3 cards are visible above the fold on mobile — load eagerly.
            const isAboveFold = idx < 3;
            const optimizedSrc = transformedImage(p.image, 480);
            const srcSet = buildSrcSet(p.image);
            return (
              <article
                key={p.id}
                className="group flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden sm:transition-all sm:hover:border-primary/20 sm:hover:shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.18)]"
              >
                {/* 1. Image — always visible, fixed height on mobile, aspect ratio on larger screens */}
                <div className="relative w-full bg-muted overflow-hidden shrink-0 block h-56 sm:h-auto sm:aspect-[4/3]">
                  {optimizedSrc ? (
                    <img
                      src={optimizedSrc}
                      srcSet={srcSet}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      alt={`Фото оборудования: ${p.name}`}
                      loading={isAboveFold ? "eager" : "lazy"}
                      // @ts-expect-error fetchpriority is a valid HTML attribute
                      fetchpriority={isAboveFold ? "high" : "auto"}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover sm:transition-transform sm:duration-500 sm:group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon size={44} className="text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-6">
                  {/* 1. Категория */}
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary mb-3">
                    {p.category}
                  </p>

                  {/* 2. Название */}
                  <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 min-h-[3rem]">
                    {p.name}
                  </h3>

                  {/* 3. Для какой задачи подходит */}
                  {p.purpose && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.7rem]">
                      {p.purpose}
                    </p>
                  )}

                  {/* 4. Высота / характеристики */}
                  {p.spec && (
                    <div className="mt-4 flex items-start gap-2 text-xs text-foreground/80">
                      <Ruler size={14} className="mt-0.5 text-primary shrink-0" />
                      <span className="leading-snug">{p.spec}</span>
                    </div>
                  )}

                  {/* 5. Что входит в аренду */}
                  {p.includes && (
                    <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                      <Wrench size={14} className="mt-0.5 text-primary shrink-0" />
                      <span className="leading-snug">
                        <span className="text-foreground/70 font-medium">В аренду: </span>
                        {p.includes}
                      </span>
                    </div>
                  )}

                  {/* 6. Цены — день / неделя / месяц */}
                  <div className="mt-5 pt-5 border-t border-border space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Аренда от</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatPrice(p.prices.day)}
                        <span className="text-xs font-normal text-muted-foreground">/день</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Неделя</span>
                      <span className="font-medium text-foreground/80">{formatPrice(p.prices.week)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Месяц</span>
                      <span className="font-medium text-foreground/80">{formatPrice(p.prices.month)}</span>
                    </div>
                  </div>

                  {/* 7. CTA */}
                  <Button
                    onClick={() => handleAdd(p)}
                    className="mt-6 w-full h-11 font-semibold gap-2"
                  >
                    Оставить заявку
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
