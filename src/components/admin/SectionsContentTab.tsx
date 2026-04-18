import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown, Type } from "lucide-react";
import {
  useSiteSettings,
  DEFAULT_ABOUT_TEXTS,
  DEFAULT_FOR_WHOM_TEXTS,
  DEFAULT_WHY_US_TEXTS,
  DEFAULT_FAQ_TEXTS,
  type AboutTexts,
  type ForWhomTexts,
  type WhyUsTexts,
  type FAQTexts,
} from "@/contexts/SiteSettingsContext";
import { toast } from "sonner";

const useEditor = <T,>(value: T, save: (v: T) => Promise<void>, defaults: T) => {
  const [draft, setDraft] = useState<T>(value);
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(value), [value]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(value);

  const onSave = async () => {
    setSaving(true);
    try {
      await save(draft);
      toast.success("Сохранено");
    } catch (e: any) {
      toast.error("Ошибка: " + (e?.message ?? "повторите"));
    } finally {
      setSaving(false);
    }
  };

  return {
    draft,
    setDraft,
    saving,
    dirty,
    onSave,
    onReset: () => setDraft(defaults),
  };
};

const Toolbar = ({
  dirty,
  saving,
  onSave,
  onReset,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
}) => (
  <div className="flex gap-2 pt-3 border-t">
    <Button onClick={onSave} disabled={!dirty || saving} className="gap-1.5">
      <Check size={16} /> {saving ? "Сохранение…" : "Сохранить"}
    </Button>
    <Button variant="outline" onClick={onReset} className="gap-1.5">
      <RotateCcw size={16} /> Сбросить
    </Button>
  </div>
);

/* ─── About ─── */
const AboutEditor = () => {
  const { aboutTexts, saveAboutTexts } = useSiteSettings();
  const ed = useEditor<AboutTexts>(aboutTexts, saveAboutTexts, DEFAULT_ABOUT_TEXTS);
  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Заголовок</label>
        <Input value={ed.draft.title} onChange={(e) => ed.setDraft({ ...ed.draft, title: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Текст</label>
        <Textarea
          rows={8}
          value={ed.draft.body}
          onChange={(e) => ed.setDraft({ ...ed.draft, body: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">Переносы строк сохраняются.</p>
      </div>
      <Toolbar {...ed} />
    </div>
  );
};

/* ─── 4-cards editor (for "Для кого" и "Почему мы") ─── */
const FourCardsEditor = ({
  draft,
  setDraft,
  hasSubtitle,
}: {
  draft: { title: string; subtitle?: string; items: { title: string; desc: string }[] };
  setDraft: (v: any) => void;
  hasSubtitle: boolean;
}) => (
  <>
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">Заголовок секции</label>
      <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
    </div>
    {hasSubtitle && (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Подзаголовок</label>
        <Input
          value={draft.subtitle ?? ""}
          onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
        />
      </div>
    )}
    <div className="space-y-3">
      {draft.items.map((item, i) => (
        <div key={i} className="rounded-md border p-3 space-y-2 bg-background">
          <p className="text-xs font-semibold text-muted-foreground">Карточка {i + 1}</p>
          <Input
            placeholder="Заголовок"
            value={item.title}
            onChange={(e) => {
              const items = [...draft.items];
              items[i] = { ...items[i], title: e.target.value };
              setDraft({ ...draft, items });
            }}
          />
          <Textarea
            placeholder="Описание"
            rows={2}
            value={item.desc}
            onChange={(e) => {
              const items = [...draft.items];
              items[i] = { ...items[i], desc: e.target.value };
              setDraft({ ...draft, items });
            }}
          />
        </div>
      ))}
    </div>
    <p className="text-xs text-muted-foreground">
      Иконки карточек заданы в дизайне и не редактируются — меняйте только тексты.
    </p>
  </>
);

const ForWhomEditor = () => {
  const { forWhomTexts, saveForWhomTexts } = useSiteSettings();
  const ed = useEditor<ForWhomTexts>(forWhomTexts, saveForWhomTexts, DEFAULT_FOR_WHOM_TEXTS);
  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <FourCardsEditor draft={ed.draft} setDraft={ed.setDraft} hasSubtitle />
      <Toolbar {...ed} />
    </div>
  );
};

const WhyUsEditor = () => {
  const { whyUsTexts, saveWhyUsTexts } = useSiteSettings();
  const ed = useEditor<WhyUsTexts>(whyUsTexts, saveWhyUsTexts, DEFAULT_WHY_US_TEXTS);
  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <FourCardsEditor draft={ed.draft as any} setDraft={ed.setDraft} hasSubtitle={false} />
      <Toolbar {...ed} />
    </div>
  );
};

/* ─── FAQ ─── */
const FaqEditor = () => {
  const { faqTexts, saveFaqTexts } = useSiteSettings();
  const ed = useEditor<FAQTexts>(faqTexts, saveFaqTexts, DEFAULT_FAQ_TEXTS);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= ed.draft.items.length) return;
    const items = [...ed.draft.items];
    [items[i], items[j]] = [items[j], items[i]];
    ed.setDraft({ ...ed.draft, items });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Заголовок секции</label>
        <Input value={ed.draft.title} onChange={(e) => ed.setDraft({ ...ed.draft, title: e.target.value })} />
      </div>

      <div className="space-y-3">
        {ed.draft.items.map((item, i) => (
          <div key={i} className="rounded-md border p-3 space-y-2 bg-background">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">Вопрос {i + 1}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ChevronUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => move(i, 1)}
                  disabled={i === ed.draft.items.length - 1}
                >
                  <ChevronDown size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    const items = ed.draft.items.filter((_, idx) => idx !== i);
                    ed.setDraft({ ...ed.draft, items });
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            <Input
              placeholder="Вопрос"
              value={item.q}
              onChange={(e) => {
                const items = [...ed.draft.items];
                items[i] = { ...items[i], q: e.target.value };
                ed.setDraft({ ...ed.draft, items });
              }}
            />
            <Textarea
              placeholder="Ответ"
              rows={3}
              value={item.a}
              onChange={(e) => {
                const items = [...ed.draft.items];
                items[i] = { ...items[i], a: e.target.value };
                ed.setDraft({ ...ed.draft, items });
              }}
            />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() =>
          ed.setDraft({
            ...ed.draft,
            items: [...ed.draft.items, { q: "Новый вопрос", a: "Ответ" }],
          })
        }
      >
        <Plus size={14} /> Добавить вопрос
      </Button>

      <Toolbar {...ed} />
    </div>
  );
};

/* ─── Wrapper ─── */
export const SectionsContentTab = () => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-2">
        <Type size={18} className="text-primary" />
        <h3 className="font-semibold text-foreground">Тексты секций главной</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Все изменения применяются на сайте сразу после сохранения.
      </p>

      <Tabs defaultValue="about">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="about">О нас</TabsTrigger>
          <TabsTrigger value="for-whom">Для кого</TabsTrigger>
          <TabsTrigger value="why-us">Почему мы</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        <TabsContent value="about" className="mt-4">
          <AboutEditor />
        </TabsContent>
        <TabsContent value="for-whom" className="mt-4">
          <ForWhomEditor />
        </TabsContent>
        <TabsContent value="why-us" className="mt-4">
          <WhyUsEditor />
        </TabsContent>
        <TabsContent value="faq" className="mt-4">
          <FaqEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};
