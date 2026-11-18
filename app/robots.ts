import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/article-seo";

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();
  return { rules: { userAgent: "*", allow: "/articles", disallow: ["/admin", "/api/"] }, ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}) };
}
