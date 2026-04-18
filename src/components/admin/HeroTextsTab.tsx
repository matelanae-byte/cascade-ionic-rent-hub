import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, RotateCcw, Type } from "lucide-react";
import { useSiteSettings, DEFAULT_HERO_TEXTS, type HeroTexts } from "@/contexts/SiteSettingsContext";
import { toast } from "sonner";

const FIELDS: {
  key: keyof HeroTexts;
  label: string;
  hint?: string;
  multiline?: boolean;
}[] = [
  { key: "eyebrow", label: "Надзаголовок (мелкий текст сверху)" },
  { key: "title", label: "Главный заголовок (H1)", multiline: true },
  { key: "subtitle", label: "Подзаголовок", multiline: true },
  { key: "badge1", label: "Плашка 1" },
  { key: "badge2", label: "Плашка 2" },
  { key: "badge3", label: "Плашка 3", hint: "Оставьте пустым, чтобы скрыть" },
  { key: "formTitle", label: "Заголовок формы" },
  { key: "submitLabel", label: "Кнопка — без товаров в корзине" },
  { key: "submitLabelWithCart", label: "Кнопка — есть товары в корзине" },
  {
    key: "privacyNote",
    label: "Примечание под кнопкой",
    hint: 'Подстрока «политикой конфиденциальности» автоматически станет ссылкой',
    multiline: true,
  },
];

export const HeroTextsTab = () => {
  const { heroTexts, saveHeroTexts } = useSiteSettings();
  const [draft, setDraft] = useState<HeroTexts>(heroTexts);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(heroTexts);
  }, [heroTexts]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(heroTexts);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveHeroTexts(draft);
      toast.success("Тексты сохранены");
    } catch (e: any) {
      toast.error("Ошибка сохранения: " + (e?.message ?? "повторите"));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDraft(DEFAULT_HERO_TEXTS);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-lg border bg-card p-5 space-y-5">
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Type size={18} /> Тексты главного экрана
          </h3>
          <p className="text-sm text-muted-foreground">
            Изменения появляются на сайте сразу после сохранения.
          </p>
        </div>

        <div className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{f.label}</label>
              {f.multiline ? (
                <Textarea
                  rows={f.key === "title" ? 2 : 3}
                  value={draft[f.key]}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              ) : (
                <Input
                  value={draft[f.key]}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              )}
              {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button onClick={handleSave} disabled={!dirty || saving} className="gap-1.5">
            <Check size={16} /> {saving ? "Сохранение…" : "Сохранить"}
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw size={16} /> Сбросить к стандартным
          </Button>
        </div>
      </div>
    </div>
  );
};
