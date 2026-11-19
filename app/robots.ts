import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/article-seo";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();
  return { rules: { userAgent: "*", allow: ["/articles", "/api/articles/media/"], disallow: ["/admin", "/api/"] }, ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}) };
}
