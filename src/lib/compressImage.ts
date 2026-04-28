/**
 * Сжимает изображение в браузере перед загрузкой.
 * - Уменьшает размер до maxWidth (по большей стороне)
 * - Конвертирует в WebP с заданным качеством
 * - Возвращает новый File готовый к загрузке
 */
export interface CompressOptions {
  maxWidth?: number;     // максимальная ширина/высота (по большей стороне)
  quality?: number;      // 0..1
  mimeType?: "image/webp" | "image/jpeg";
}

export async function compressImage(
  file: File,
  opts: CompressOptions = {},
): Promise<File> {
  const { maxWidth = 1280, quality = 0.78, mimeType = "image/webp" } = opts;

  // SVG / GIF не трогаем
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  if (!file.type.startsWith("image/")) return file;

  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const ratio = Math.min(1, maxWidth / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, mimeType, quality),
  );
  if (!blob) return file;

  // Если сжатый файл вдруг больше оригинала — оставляем оригинал
  if (blob.size >= file.size) return file;

  const ext = mimeType === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.${ext}`, { type: mimeType });
}

/** Сжать и получить data URL (для случаев, когда картинка хранится как base64). */
export async function compressImageToDataUrl(
  file: File,
  opts: CompressOptions = {},
): Promise<string> {
  const compressed = await compressImage(file, opts);
  return readAsDataUrl(compressed);
}

function readAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
