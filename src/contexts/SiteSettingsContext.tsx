import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  heroImageUrl: string | null;
}

interface SiteSettingsContextType extends SiteSettings {
  uploadHeroImage: (file: File) => Promise<string>;
  removeHeroImage: () => void;
}

const SETTINGS_KEY = "site-settings";
const HERO_IMAGE_PATH = "site/hero-image";

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

const loadSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { heroImageUrl: null };
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const uploadHeroImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${HERO_IMAGE_PATH}.${ext}`;

    // Remove old file (ignore errors)
    await supabase.storage.from("product-images").remove([path]);

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    const url = data.publicUrl + "?t=" + Date.now(); // cache bust

    setSettings((prev) => ({ ...prev, heroImageUrl: url }));
    return url;
  };

  const removeHeroImage = () => {
    setSettings((prev) => ({ ...prev, heroImageUrl: null }));
  };

  return (
    <SiteSettingsContext.Provider value={{ ...settings, uploadHeroImage, removeHeroImage }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};
