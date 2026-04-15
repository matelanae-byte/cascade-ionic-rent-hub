import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  heroImageUrl: string | null;
}

interface SiteSettingsContextType extends SiteSettings {
  uploadHeroImage: (file: File) => Promise<string>;
  removeHeroImage: () => void;
  loading: boolean;
}

const HERO_IMAGE_PATH = "site/hero-image";
const SETTINGS_KEY_HERO = "hero_image_url";

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

const upsertSetting = async (key: string, value: string | null) => {
  if (value) {
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
  const [settings, setSettings] = useState<SiteSettings>({ heroImageUrl: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", SETTINGS_KEY_HERO)
        .maybeSingle();

      if (data?.value) {
        setSettings({ heroImageUrl: data.value });
      }
      setLoading(false);
    };
    load();
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

  return (
    <SiteSettingsContext.Provider value={{ ...settings, uploadHeroImage, removeHeroImage, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};
