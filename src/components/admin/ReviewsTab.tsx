import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Check, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useReviews, type Review, type ReviewInput } from "@/contexts/ReviewsContext";
import { toast } from "sonner";

interface ReviewFormProps {
  initial?: Review;
  onSave: (data: ReviewInput) => void;
  onCancel: () => void;
}

const ReviewForm = ({ initial, onSave, onCancel }: ReviewFormProps) => {
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "");
  const [segment, setSegment] = useState(initial?.segment ?? "");
  const [project, setProject] = useState(initial?.project ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [hidden, setHidden] = useState(initial?.hidden ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      toast.error("Заполните имя и текст отзыва");
      return;
    }
    onSave({ authorName, segment, project, content, rating, hidden });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Имя автора *</label>
          <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Сегмент</label>
          <Input value={segment} onChange={(e) => setSegment(e.target.value)} placeholder="Например: Клининговая компания" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Проект / задача</label>
        <Input value={project} onChange={(e) => setProject(e.target.value)} placeholder="Например: Мойка фасада ТЦ" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Текст отзыва *</label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} required />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Оценка</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="p-1 text-primary"
              aria-label={`${n} звёзд`}
            >
              <Star size={22} className={n <= rating ? "fill-current" : "text-muted-foreground/40"} />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{rating} / 5</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="review-hidden"
          type="checkbox"
          checked={hidden}
          onChange={(e) => setHidden(e.target.checked)}
          className="accent-primary"
        />
        <label htmlFor="review-hidden" className="text-sm text-muted-foreground">
          Скрыть отзыв с сайта
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="gap-1.5">
          <Check size={16} /> Сохранить
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="gap-1.5">
          <X size={16} /> Отмена
        </Button>
      </div>
    </form>
  );
};

export const ReviewsTab = () => {
  const { reviews, addReview, updateReview, deleteReview } = useReviews();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (data: ReviewInput) => {
    await addReview(data);
    setAdding(false);
    toast.success("Отзыв добавлен");
  };

  const handleUpdate = async (id: string, data: ReviewInput) => {
    await updateReview(id, data);
    setEditingId(null);
    toast.success("Отзыв обновлён");
  };

  const handleDelete = async (id: string) => {
    await deleteReview(id);
    toast.success("Отзыв удалён");
  };

  return (
    <div className="space-y-4">
      {adding ? (
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Новый отзыв</h3>
          <ReviewForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      ) : (
        <Button onClick={() => setAdding(true)} className="gap-1.5">
          <Plus size={16} /> Добавить отзыв
        </Button>
      )}

      {reviews.length === 0 && !adding ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          Пока нет ни одного отзыва. На сайте показываются карточки-заглушки.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className={`rounded-lg border bg-card p-4 ${r.hidden ? "opacity-60" : ""}`}>
              {editingId === r.id ? (
                <ReviewForm
                  initial={r}
                  onSave={(data) => handleUpdate(r.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">{r.authorName}</span>
                      {r.hidden && <Badge variant="secondary" className="text-xs">Скрыт</Badge>}
                      <span className="inline-flex items-center gap-0.5 text-primary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < r.rating ? "fill-current" : "text-muted-foreground/30"}
                          />
                        ))}
                      </span>
                    </div>
                    {(r.segment || r.project) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {[r.segment, r.project].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap line-clamp-3">
                      {r.content}
                    </p>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateReview(r.id, { hidden: !r.hidden })}
                      title={r.hidden ? "Показать" : "Скрыть"}
                    >
                      {r.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingId(r.id)}>
                      <Pencil size={16} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить отзыв?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Отзыв от {r.authorName} будет удалён без возможности восстановления.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(r.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
