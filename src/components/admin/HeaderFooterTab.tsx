import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown, PanelTop, PanelBottom } from "lucide-react";
import {
  useSiteSettings,
  DEFAULT_HEADER_TEXTS,
  DEFAULT_FOOTER_TEXTS,
  type HeaderTexts,
  type FooterTexts,
  type NavLink,
} from "@/contexts/SiteSettingsContext";
import { toast } from "sonner";

/* ─── Reusable nav-links editor ─── */
const LinksEditor = ({
  links,
  onChange,
}: {
  links: NavLink[];
  onChange: (next: NavLink[]) => void;
}) => {
  const update = (i: number, patch: Partial<NavLink>) => {
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  };
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const add = () => onChange([...links, { label: "Новая ссылка", href: "#" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    const next = [...links];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {links.map((l, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex flex-col gap-0.5 pt-1.5">
            <button onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
              <ChevronUp size={14} />
            </button>
            <button onClick={() => move(i, 1)} disabled={i === links.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
              <ChevronDown size={14} />
            </button>
          </div>
          <Input
            placeholder="Название"
            value={l.label}
            onChange={(e) => update(i, { label: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="#anchor или https://…"
            value={l.href}
            onChange={(e) => update(i, { href: e.target.value })}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(i)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus size={14} /> Добавить ссылку
      </Button>
    </div>
  );
};

/* ─── Header editor ─── */
const HeaderEditor = () => {
  const { headerTexts, saveHeaderTexts } = useSiteSettings();
  const [draft, setDraft] = useState<HeaderTexts>(headerTexts);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(headerTexts), [headerTexts]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(headerTexts);

  const save = async () => {
    setSaving(true);
    try {
      await saveHeaderTexts(draft);
      toast.success("Шапка сохранена");
    } catch (e: any) {
      toast.error("Ошибка: " + (e?.message ?? "повторите"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-5 space-y-5 max-w-3xl">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <PanelTop size={18} /> Шапка сайта
        </h3>
        <p className="text-sm text-muted-foreground">Бренд (логотип-надпись), меню и кнопка CTA.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Бренд (текстовая надпись)</label>
          <Input value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} />
          <p className="text-xs text-muted-foreground">Первое слово — жирное, остальные — лёгкий курсив.</p>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Текст кнопки CTA</label>
          <Input value={draft.ctaLabel} onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Ссылка кнопки CTA</label>
          <Input value={draft.ctaHref} onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ссылки меню</label>
        <LinksEditor links={draft.links} onChange={(links) => setDraft({ ...draft, links })} />
      </div>

      <div className="flex gap-2 pt-2 border-t">
        <Button onClick={save} disabled={!dirty || saving} className="gap-1.5">
          <Check size={16} /> {saving ? "Сохранение…" : "Сохранить"}
        </Button>
        <Button variant="outline" onClick={() => setDraft(DEFAULT_HEADER_TEXTS)} className="gap-1.5">
          <RotateCcw size={16} /> Сбросить
        </Button>
      </div>
    </div>
  );
};

/* ─── Footer editor ─── */
const FooterEditor = () => {
  const { footerTexts, saveFooterTexts } = useSiteSettings();
  const [draft, setDraft] = useState<FooterTexts>(footerTexts);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(footerTexts), [footerTexts]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(footerTexts);

  const save = async () => {
    setSaving(true);
    try {
      await saveFooterTexts(draft);
      toast.success("Футер сохранён");
    } catch (e: any) {
      toast.error("Ошибка: " + (e?.message ?? "повторите"));
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof FooterTexts>(k: K, v: FooterTexts[K]) => setDraft({ ...draft, [k]: v });

  return (
    <div className="rounded-lg border bg-card p-5 space-y-5 max-w-3xl">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <PanelBottom size={18} /> Футер сайта
        </h3>
        <p className="text-sm text-muted-foreground">Бренд, описание, контакты и навигация в подвале.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Бренд (текстовая надпись)</label>
          <Input value={draft.brand} onChange={(e) => set("brand", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Копирайт</label>
          <Input value={draft.copyright} onChange={(e) => set("copyright", e.target.value)} />
          <p className="text-xs text-muted-foreground">Год подставляется автоматически.</p>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Описание под брендом</label>
          <Textarea rows={2} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Заголовок «Навигация»</label>
          <Input value={draft.navTitle} onChange={(e) => set("navTitle", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Заголовок «Документы»</label>
          <Input value={draft.legalTitle} onChange={(e) => set("legalTitle", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Заголовок «Контакты»</label>
          <Input value={draft.contactsTitle} onChange={(e) => set("contactsTitle", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Телефон</label>
          <Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email</label>
          <Input value={draft.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Адрес / город</label>
          <Input value={draft.address} onChange={(e) => set("address", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ссылки в блоке «Навигация»</label>
        <LinksEditor links={draft.navLinks} onChange={(navLinks) => set("navLinks", navLinks)} />
      </div>

      <div className="flex gap-2 pt-2 border-t">
        <Button onClick={save} disabled={!dirty || saving} className="gap-1.5">
          <Check size={16} /> {saving ? "Сохранение…" : "Сохранить"}
        </Button>
        <Button variant="outline" onClick={() => setDraft(DEFAULT_FOOTER_TEXTS)} className="gap-1.5">
          <RotateCcw size={16} /> Сбросить
        </Button>
      </div>
    </div>
  );
};

/* ─── Combined tab ─── */
export const HeaderFooterTab = () => {
  return (
    <Tabs defaultValue="header">
      <TabsList className="mb-4">
        <TabsTrigger value="header" className="gap-1.5"><PanelTop size={14} /> Шапка</TabsTrigger>
        <TabsTrigger value="footer" className="gap-1.5"><PanelBottom size={14} /> Футер</TabsTrigger>
      </TabsList>
      <TabsContent value="header"><HeaderEditor /></TabsContent>
      <TabsContent value="footer"><FooterEditor /></TabsContent>
    </Tabs>
  );
};
