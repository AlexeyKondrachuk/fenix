import type { Metadata } from "next";
import { cache } from "react";
import { articlePath, articleSeo, siteUrl } from "../../../../lib/article-seo";
import { titleSlug } from "../../../../lib/article-slug";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import ArticlePhotos from "../../../../components/ArticlePhotos";
import { articleId, mediaUrl, validBlock } from "../../../../lib/articles";
import { db } from "../../../../lib/db";
import styles from "../articles.module.scss";

const getArticle = cache(async (key: string) => {
  try { key = decodeURIComponent(key); } catch { notFound(); }
  const article = await db().article.findFirst({ where: { published: true, OR: [{ slug: key }, { slug: titleSlug(key) }, ...(articleId.test(key) ? [{ id: key }] : [])] }, include: { category: true } });
  if (!article) notFound();
  return article;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const article = await getArticle((await params).id);
  const { title, description, image, imageAlt } = articleSeo(article);
  const origin = siteUrl();
  const url = `${origin || ""}${articlePath(article)}`;
  const images = image && origin ? [{ url: origin + image, alt: imageAlt || article.title }] : undefined;
  return { title, description, robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url, siteName: "Феникс", locale: "ru_RU", modifiedTime: article.updatedAt.toISOString(), images },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images },
  };
}

export default async function Article({ params }: { params: Promise<{ id: string }> }) {
  const key = (await params).id;
  const article = await getArticle(key);
  if (article.slug && decodeURIComponent(key) !== article.slug) permanentRedirect(articlePath(article));
  const id = article.id;
  const origin = siteUrl();
  const seo = articleSeo(article);
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: article.title,
    description: seo.description, dateModified: article.updatedAt.toISOString(), inLanguage: "ru",
    ...(article.category ? { articleSection: article.category.name } : {}),
    ...(origin ? { mainEntityOfPage: origin + articlePath(article), ...(seo.image ? { image: [origin + seo.image] } : {}) } : {}),
    publisher: { "@type": "Organization", name: "Феникс" } };
  const blocks = Array.isArray(article.blocks) ? article.blocks.filter(validBlock) : [];
  return <main className={`${styles.main} ${styles.detail}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <Breadcrumbs items={[{ label: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f", href: "/" }, { label: "\u0421\u0442\u0430\u0442\u044c\u0438", href: "/articles" }, { label: article.title }]} />
    <Link className={styles.back} href="/articles">← Все статьи</Link>
    <article className={styles.article}>
      <header className={styles.articleHeader}>
        {article.category && <Link className={styles.categoryLabel} href={`/articles?category=${article.category.id}`}>{article.category.name}</Link>}
        <h1>{article.title}</h1>
      </header>
      {blocks.map(block => {
        if (block.type === "photo") return <ArticlePhotos key={block.id} id={id} files={block.files} details={block.details} />;
        if (block.type === "video") {
          const file = block.files[0];
          if (!file) return null;
          const title = block.details?.[file]?.title?.trim();
          const description = block.details?.[file]?.description?.trim();
          return <figure key={block.id}>
            <video src={mediaUrl(id, file)} aria-label={title || "Видео к статье"} controls playsInline preload="metadata" style={{ maxWidth: "100%" }} />
            {(title || description) && <figcaption>
              {title && <strong>{title}</strong>}
              {description && <span>{description}</span>}
            </figcaption>}
          </figure>;
        }
        if (block.type !== "text") return null;
        const Tag = block.heading ? "h2" : "p";
        return <Tag key={block.id} style={{ fontFamily: block.font, color: block.color, fontSize: block.size, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{block.text}</Tag>;
      })}
    </article>
  </main>;
}
