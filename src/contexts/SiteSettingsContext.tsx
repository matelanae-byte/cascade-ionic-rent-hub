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

interface SiteSettings {
  heroImageUrl: string | null;
  heroTexts: HeroTexts;
}

interface SiteSettingsContextType extends SiteSettings {
  uploadHeroImage: (file: File) => Promise<string>;
  removeHeroImage: () => void;
  saveHeroTexts: (texts: HeroTexts) => Promise<void>;
  loading: boolean;
}

const HERO_IMAGE_PATH = "site/hero-image";
const SETTINGS_KEY_HERO = "hero_image_url";
const SETTINGS_KEY_HERO_TEXTS = "hero_texts";

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

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    heroImageUrl: null,
    heroTexts: DEFAULT_HERO_TEXTS,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [SETTINGS_KEY_HERO, SETTINGS_KEY_HERO_TEXTS]);

      const next: SiteSettings = { heroImageUrl: null, heroTexts: DEFAULT_HERO_TEXTS };
      for (const row of data ?? []) {
        if (row.key === SETTINGS_KEY_HERO && row.value) next.heroImageUrl = row.value;
        if (row.key === SETTINGS_KEY_HERO_TEXTS && row.value) {
          try {
            next.heroTexts = { ...DEFAULT_HERO_TEXTS, ...JSON.parse(row.value) };
          } catch {}
        }
      }
      setSettings(next);
      setLoading(false);
    };
    load();

    const ch = supabase
      .channel("site-settings-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        load,
      )
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

    await upsertSetting(SETTINGS_KEY_HERO, url);
    setSettings((prev) => ({ ...prev, heroImageUrl: url }));
    return url;
  };

  const removeHeroImage = () => {
    upsertSetting(SETTINGS_KEY_HERO, null);
    setSettings((prev) => ({ ...prev, heroImageUrl: null }));
  };

  const saveHeroTexts = async (texts: HeroTexts) => {
    await upsertSetting(SETTINGS_KEY_HERO_TEXTS, JSON.stringify(texts));
    setSettings((prev) => ({ ...prev, heroTexts: texts }));
  };

  return (
    <SiteSettingsContext.Provider
      value={{ ...settings, uploadHeroImage, removeHeroImage, saveHeroTexts, loading }}
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
