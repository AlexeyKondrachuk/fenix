export const fonts = ["Arial", "Georgia", "Verdana", "Times New Roman", "Courier New"];
export const photoLimit = 300 * 1024;
export const seoTitleLimit = 120;
export const seoDescriptionLimit = 320;
export const videoLimit = 50 * 1024 * 1024;
export const photoTypes = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };
export const videoTypes = { mp4: "video/mp4", webm: "video/webm" };
export const mediaTypes = { ...photoTypes, ...videoTypes };
export const articleId = /^[0-9a-f-]{36}$/;
export const mediaName = /^[0-9a-f-]{36}\.(jpg|png|webp|gif|mp4|webm)$/;
export const mediaTextLimit = 1000;
export type ArticleMediaDetails = Record<string, { alt?: string; title?: string; description?: string }>;

export type Block =
  | { id: string; type: "text"; text: string; heading: boolean; font: string; color: string; size: number }
  | { id: string; type: "photo" | "video"; files: string[]; details?: ArticleMediaDetails };

export function validBlock(value: unknown): value is Block {
  if (!value || typeof value !== "object") return false;
  const block = value as Block;
  if (typeof block.id !== "string" || !articleId.test(block.id)) return false;
  if (block.type === "text") {
    return typeof block.text === "string" && typeof block.heading === "boolean" &&
      fonts.includes(block.font) && /^#[0-9a-f]{6}$/i.test(block.color) &&
      Number.isInteger(block.size) && block.size >= 12 && block.size <= 96;
  }
  return (block.type === "photo" || block.type === "video") && Array.isArray(block.files) &&
    (block.type === "photo" || block.files.length <= 1) && block.files.every(file =>
      typeof file === "string" && mediaName.test(file) &&
      Object.hasOwn(block.type === "photo" ? photoTypes : videoTypes, file.split(".")[1])) &&
    (block.details === undefined || (
      block.details !== null && typeof block.details === "object" && !Array.isArray(block.details) &&
      Object.entries(block.details).every(([file, details]) =>
        block.files.includes(file) && details && typeof details === "object" && !Array.isArray(details) &&
        Object.entries(details).every(([key, value]) =>
          (block.type === "photo" ? key === "alt" : key === "title" || key === "description") &&
          typeof value === "string" && value.length <= mediaTextLimit))
    ));
}

export function mediaUrl(id: string, file: string, admin = false) {
  return `${admin ? "/api/articles" : "/api/articles/media"}/${id}/${file}`;
}
