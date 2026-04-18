import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HeroTexts {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge1: string;
  badge2: string;
  badge3: string;
  formTitle: string;
  submitLabel: string;
  submitLabelWithCart: string;
  privacyNote: string;
}

export interface AboutTexts {
  title: string;
  body: string;
}

export interface CardItem {
  title: string;
  desc: string;
}

export interface ForWhomTexts {
  title: string;
  subtitle: string;
  items: [CardItem, CardItem, CardItem, CardItem];
}

export interface WhyUsTexts {
  title: string;
  items: [CardItem, CardItem, CardItem, CardItem];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQTexts {
  title: string;
  items: FAQItem[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderTexts {
  brand: string;
  ctaLabel: string;
  ctaHref: string;
  links: NavLink[];
}

export interface FooterTexts {
  brand: string;
  description: string;
  navTitle: string;
  navLinks: NavLink[];
  legalTitle: string;
  contactsTitle: string;
  phone: string;
  email: string;
  address: string;
  copyright: string;
}

export const DEFAULT_HERO_TEXTS: HeroTexts = {
  eyebrow: "cascade ionic",
  title: "Аренда WFP оборудования для мойки фасадов и остекления",
  subtitle:
    "Подберём комплект под ваш объект, чтобы вы могли начать работу без покупки дорогого оборудования на старте.",
  badge1: "До 20 м с земли",
  badge2: "Аренда от 1 дня",
  badge3: "Тест перед покупкой",
  formTitle: "Получите расчёт аренды за 15 минут",
  submitLabel: "Отправить заявку",
  submitLabelWithCart: "Оформить заявку",
  privacyNote: "Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности",
};

export const DEFAULT_ABOUT_TEXTS: AboutTexts = {
  title: "О нас",
  body:
    "Мы помогаем подобрать оборудование для мойки фасадов и окон под конкретную задачу. На сайте cascade ionic можно взять решение под объект без лишних сложностей и без необходимости сразу вкладываться в покупку полного комплекта. Это удобно для новичков, клининговых компаний, частных мастеров и тех, кому нужно закрыть конкретный объем работ.",
};

export const DEFAULT_FOR_WHOM_TEXTS: ForWhomTexts = {
  title: "Для кого подходит",
  subtitle: "Оборудование cascade ionic используют профессионалы по всей России",
  items: [
    {
      title: "Клининговые компании",
      desc: "Расширьте услуги без покупки дорогого оборудования. Берите технику под конкретный заказ.",
    },
    {
      title: "Управляющие компании",
      desc: "Поддерживайте фасады жилых комплексов и бизнес-центров в чистоте.",
    },
    {
      title: "Автосалоны и строительные фирмы",
      desc: "Для мойки фасадов, остекления и входных групп на коммерческих и строительных объектах. Удобно для регулярных и разовых задач без сложной высотной техники.",
    },
    {
      title: "Частные мастера",
      desc: "Попробуйте WFP-технологию без крупных вложений. Тест перед покупкой.",
    },
  ],
};

export const DEFAULT_WHY_US_TEXTS: WhyUsTexts = {
  title: "Почему с нами проще начать",
  items: [
    { title: "Подбор под объект", desc: "Подбираем решение под высоту, тип фасада и формат работ." },
    {
      title: "Без лишних вложений на старте",
      desc: "Не нужно сразу заходить в большие расходы, чтобы начать работать.",
    },
    { title: "Понятный процесс", desc: "Объясняем, что подойдет под задачу и с чего лучше начать." },
    {
      title: "Поддержка по вопросам выбора",
      desc: "Помогаем разобраться, чтобы клиент не тратил время на лишние поиски и ошибки.",
    },
  ],
};

export const DEFAULT_FAQ_TEXTS: FAQTexts = {
  title: "Частые вопросы",
  items: [
    {
      q: "Какой минимальный срок аренды?",
      a: "Минимальный срок аренды — 1 день. Для длительных проектов предлагаем скидки на недельную и месячную аренду.",
    },
    {
      q: "Доставляете ли вы оборудование в регионы?",
      a: "Да, мы доставляем оборудование по всей России через надёжные транспортные компании. Срок доставки — от 1 до 5 рабочих дней в зависимости от региона.",
    },
    {
      q: "Нужен ли опыт работы с WFP-оборудованием?",
      a: "Базовый опыт желателен, но не обязателен. Мы предоставляем инструкции и консультации по использованию оборудования.",
    },
    {
      q: "Что входит в стоимость аренды?",
      a: "В стоимость аренды входит всё оборудование по выбранной позиции, проверка работоспособности перед отправкой и консультационная поддержка на весь срок.",
    },
    {
      q: "Можно ли протестировать оборудование перед покупкой?",
      a: "Да. Программа «Тест перед покупкой» позволяет арендовать оборудование, оценить его в работе, и при покупке зачесть часть стоимости аренды.",
    },
    {
      q: "Как оформить заявку?",
      a: "Оставьте заявку через форму на сайте или позвоните по телефону. Мы свяжемся с вами в течение 15 минут для уточнения деталей.",
    },
  ],
};

export const DEFAULT_HEADER_TEXTS: HeaderTexts = {
  brand: "Cascade ionic",
  ctaLabel: "Оставить заявку",
  ctaHref: "#hero-form",
  links: [
    { label: "Каталог", href: "#catalog" },
    { label: "FAQ", href: "#faq" },
    { label: "Контакты", href: "#contacts" },
  ],
};

export const DEFAULT_FOOTER_TEXTS: FooterTexts = {
  brand: "Cascade ionic",
  description: "Аренда профессионального оборудования для мойки фасадов и окон по всей России.",
  navTitle: "Навигация",
  navLinks: [
    { label: "Каталог", href: "#catalog" },
    { label: "Как это работает", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  legalTitle: "Документы",
  contactsTitle: "Контакты",
  phone: "+7 (800) 123-45-67",
  email: "info@cascadeionic.ru",
  address: "Москва, Россия",
  copyright: "Cascade ionic. Все права защищены.",
};

interface SiteSettings {
  heroImageUrl: string | null;
  heroTexts: HeroTexts;
  aboutTexts: AboutTexts;
  forWhomTexts: ForWhomTexts;
  whyUsTexts: WhyUsTexts;
  faqTexts: FAQTexts;
  headerTexts: HeaderTexts;
  footerTexts: FooterTexts;
}

interface SiteSettingsContextType extends SiteSettings {
  uploadHeroImage: (file: File) => Promise<string>;
  removeHeroImage: () => void;
  saveHeroTexts: (texts: HeroTexts) => Promise<void>;
  saveAboutTexts: (texts: AboutTexts) => Promise<void>;
  saveForWhomTexts: (texts: ForWhomTexts) => Promise<void>;
  saveWhyUsTexts: (texts: WhyUsTexts) => Promise<void>;
  saveFaqTexts: (texts: FAQTexts) => Promise<void>;
  saveHeaderTexts: (texts: HeaderTexts) => Promise<void>;
  saveFooterTexts: (texts: FooterTexts) => Promise<void>;
  loading: boolean;
}

const HERO_IMAGE_PATH = "site/hero-image";
const KEY_HERO_IMG = "hero_image_url";
const KEY_HERO_TEXTS = "hero_texts";
const KEY_ABOUT = "about_texts";
const KEY_FOR_WHOM = "for_whom_texts";
const KEY_WHY_US = "why_us_texts";
const KEY_FAQ = "faq_texts";
const KEY_HEADER = "header_texts";
const KEY_FOOTER = "footer_texts";

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

const upsertSetting = async (key: string, value: string | null) => {
  if (value !== null) {
    const { data } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (data) {
      await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
    } else {
      await supabase.from("site_settings").insert({ key, value });
    }
  } else {
    await supabase.from("site_settings").delete().eq("key", key);
  }
};

const safeParse = <T,>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return { ...(fallback as object), ...parsed } as T;
  } catch {
    return fallback;
  }
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    heroImageUrl: null,
    heroTexts: DEFAULT_HERO_TEXTS,
    aboutTexts: DEFAULT_ABOUT_TEXTS,
    forWhomTexts: DEFAULT_FOR_WHOM_TEXTS,
    whyUsTexts: DEFAULT_WHY_US_TEXTS,
    faqTexts: DEFAULT_FAQ_TEXTS,
    headerTexts: DEFAULT_HEADER_TEXTS,
    footerTexts: DEFAULT_FOOTER_TEXTS,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [KEY_HERO_IMG, KEY_HERO_TEXTS, KEY_ABOUT, KEY_FOR_WHOM, KEY_WHY_US, KEY_FAQ, KEY_HEADER, KEY_FOOTER]);

      const next: SiteSettings = {
        heroImageUrl: null,
        heroTexts: DEFAULT_HERO_TEXTS,
        aboutTexts: DEFAULT_ABOUT_TEXTS,
        forWhomTexts: DEFAULT_FOR_WHOM_TEXTS,
        whyUsTexts: DEFAULT_WHY_US_TEXTS,
        faqTexts: DEFAULT_FAQ_TEXTS,
        headerTexts: DEFAULT_HEADER_TEXTS,
        footerTexts: DEFAULT_FOOTER_TEXTS,
      };
      for (const row of data ?? []) {
        if (row.key === KEY_HERO_IMG && row.value) next.heroImageUrl = row.value;
        if (row.key === KEY_HERO_TEXTS) next.heroTexts = safeParse(row.value, DEFAULT_HERO_TEXTS);
        if (row.key === KEY_ABOUT) next.aboutTexts = safeParse(row.value, DEFAULT_ABOUT_TEXTS);
        if (row.key === KEY_FOR_WHOM) next.forWhomTexts = safeParse(row.value, DEFAULT_FOR_WHOM_TEXTS);
        if (row.key === KEY_WHY_US) next.whyUsTexts = safeParse(row.value, DEFAULT_WHY_US_TEXTS);
        if (row.key === KEY_FAQ) next.faqTexts = safeParse(row.value, DEFAULT_FAQ_TEXTS);
        if (row.key === KEY_HEADER) next.headerTexts = safeParse(row.value, DEFAULT_HEADER_TEXTS);
        if (row.key === KEY_FOOTER) next.footerTexts = safeParse(row.value, DEFAULT_FOOTER_TEXTS);
      }
      setSettings(next);
      setLoading(false);
    };
    load();

    const ch = supabase
      .channel("site-settings-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const uploadHeroImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${HERO_IMAGE_PATH}.${ext}`;

    await supabase.storage.from("product-images").remove([path]);

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    const url = data.publicUrl + "?t=" + Date.now();

    await upsertSetting(KEY_HERO_IMG, url);
    setSettings((prev) => ({ ...prev, heroImageUrl: url }));
    return url;
  };

  const removeHeroImage = () => {
    upsertSetting(KEY_HERO_IMG, null);
    setSettings((prev) => ({ ...prev, heroImageUrl: null }));
  };

  const saveHeroTexts = async (texts: HeroTexts) => {
    await upsertSetting(KEY_HERO_TEXTS, JSON.stringify(texts));
    setSettings((prev) => ({ ...prev, heroTexts: texts }));
  };

  const saveAboutTexts = async (texts: AboutTexts) => {
    await upsertSetting(KEY_ABOUT, JSON.stringify(texts));
    setSettings((prev) => ({ ...prev, aboutTexts: texts }));
  };

  const saveForWhomTexts = async (texts: ForWhomTexts) => {
    await upsertSetting(KEY_FOR_WHOM, JSON.stringify(texts));
    setSettings((prev) => ({ ...prev, forWhomTexts: texts }));
  };

  const saveWhyUsTexts = async (texts: WhyUsTexts) => {
    await upsertSetting(KEY_WHY_US, JSON.stringify(texts));
    setSettings((prev) => ({ ...prev, whyUsTexts: texts }));
  };

  const saveFaqTexts = async (texts: FAQTexts) => {
    await upsertSetting(KEY_FAQ, JSON.stringify(texts));
    setSettings((prev) => ({ ...prev, faqTexts: texts }));
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        ...settings,
        uploadHeroImage,
        removeHeroImage,
        saveHeroTexts,
        saveAboutTexts,
        saveForWhomTexts,
        saveWhyUsTexts,
        saveFaqTexts,
        loading,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};
