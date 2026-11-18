import type { MetadataRoute } from "next";
import { db } from "../lib/db";
import { articlePath, siteUrl } from "../lib/article-seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  if (!origin) return [];
  const articles = await db().article.findMany({ where: { published: true }, select: { id: true, slug: true, updatedAt: true } });
  return [{ url: `${origin}/articles` }, ...articles.map(article => ({ url: origin + articlePath(article), lastModified: article.updatedAt }))];
}
