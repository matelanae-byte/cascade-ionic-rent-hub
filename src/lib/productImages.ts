import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "./compressImage";

const BUCKET = "product-images";
const FOLDER = "products";

/** Возвращает путь файла внутри бакета по id товара. */
const productImagePath = (productId: string) => `${FOLDER}/${productId}.webp`;

/**
 * Сжимает картинку и заливает в Storage под путь products/{id}.webp.
 * Возвращает публичный URL с cache-buster, чтобы браузер обновил картинку.
 */
export async function uploadProductImage(productId: string, file: File): Promise<string> {
  const compressed = await compressImage(file, {
    maxWidth: 900,
    quality: 0.78,
    mimeType: "image/webp",
  });

  const path = productImagePath(productId);

  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    upsert: true,
    contentType: "image/webp",
    cacheControl: "31536000",
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}

/** Удаляет файл картинки товара из Storage (ошибки игнорируются). */
export async function deleteProductImage(productId: string): Promise<void> {
  const path = productImagePath(productId);
  await supabase.storage.from(BUCKET).remove([path]);
}

/**
 * Превращает data:URL (base64) в File — нужно для миграции
 * существующих товаров со старым форматом картинок.
 */
export function dataUrlToFile(dataUrl: string, fileName = "image"): File | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], fileName, { type: mime });
}
