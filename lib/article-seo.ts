import { validBlock, mediaUrl } from "./articles";

export { titleSlug } from "./article-slug";

export function articlePath(article: { id: string; slug?: string | null }) {
  return `/articles/${encodeURIComponent(article.slug || article.id)}`;
}

export function articleSeo(article: { id: string; title: string; blocks: unknown; seoTitle?: string; seoDescription?: string }) {
  const blocks = Array.isArray(article.blocks) ? article.blocks.filter(validBlock) : [];
  const text = blocks.filter(block => block.type === "text").map(block => block.text).join(" ").replace(/\s+/g, " ").trim();
  const photo = blocks.find(block => block.type === "photo" && block.files.length);
  return {
    title: article.seoTitle?.trim() || article.title,
    description: article.seoDescription?.trim() || (text || article.title).slice(0, 160),
    image: photo?.type === "photo" ? mediaUrl(article.id, photo.files[0]) : undefined,
    imageAlt: photo?.type === "photo" ? photo.details?.[photo.files[0]]?.alt?.trim() : undefined,
  };
}

export function siteUrl() {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  const url = new URL(value);
  return url.origin;
}
