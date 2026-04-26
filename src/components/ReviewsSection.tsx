import { Sparkles, Building2, Wrench, Clock, Star, User } from "lucide-react";
import { useReviews } from "@/contexts/ReviewsContext";

const placeholders = [
  {
    icon: Sparkles,
    segment: "Клининг",
    project: "Тестирование оборудования перед покупкой",
  },
  {
    icon: Building2,
    segment: "Автосалон",
    project: "Аренда комплекта для мойки витрин и фасада",
  },
  {
    icon: Wrench,
    segment: "Частный мастер",
    project: "Старт работы без покупки полного комплекта",
  },
];

const ReviewsSection = () => {
  const { reviews } = useReviews();
  const visible = reviews.filter((r) => !r.hidden);

  return (
    <section id="reviews" className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="container">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">
            Отзывы
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Отзывы клиентов
          </h2>
          {visible.length === 0 && (
            <p className="mt-4 text-base text-muted-foreground">
              Скоро здесь появятся отзывы клиентов, которые брали оборудование cascade ionic в аренду.
            </p>
          )}
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((r) => {
              const rating = Math.max(0, Math.min(5, r.rating || 5));
              return (
                <article
                  key={r.id}
                  className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{r.authorName}</div>
                      {(r.segment || r.project) && (
                        <div className="text-xs text-muted-foreground truncate">
                          {[r.segment, r.project].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rating ? "fill-current" : "text-muted-foreground/30"}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                    {r.content}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {placeholders.map((p, i) => {
                const Icon = p.icon;
                return (
                  <article
                    key={i}
                    className="rounded-xl border border-dashed border-border bg-card p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground">{p.segment}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.project}</div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      «Отзыв появится после завершения проекта.»
                    </p>

                    <div className="mt-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
                      <Clock size={12} />
                      Ожидает публикации
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Раздел в работе — реальные отзывы будут добавлены после завершения первых проектов.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
