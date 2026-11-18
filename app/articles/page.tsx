import { articlePath, siteUrl } from "../../lib/article-seo";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import { db } from "../../lib/db";
import { mediaUrl, validBlock } from "../../lib/articles";
import ProfileIcon, { type ProfileIconName } from "../../components/icons/ProfileIcon";
import styles from "./articles.module.scss";

export const metadata = {
  title: "Статьи",
  description: "Материалы центра Феникс о чувствах, отношениях и заботе о себе.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteUrl() || ""}/articles` },
};
export const dynamic = "force-dynamic";

const categoryIcons: Record<string, ProfileIconName> = {
  "Психотерапия": "psychology", "Общая психология": "heart", "Детская психология": "sprout",
  "Методы психотерапии": "methods", "Зависимое поведение": "shield",
};

export default async function Articles({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const { category } = await searchParams;
  const database = db();
  const categories = await database.articleCategory.findMany({ orderBy: { name: "asc" } });
  const selected = categories.find(item => item.id === category);
  const [articles, recent] = await Promise.all([
    database.article.findMany({
      where: { published: true, ...(selected ? { categoryId: selected.id } : {}) },
      select: { id: true, slug: true, title: true, blocks: true, category: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    database.article.findMany({
      where: { published: true }, select: { id: true, slug: true, title: true },
      orderBy: { updatedAt: "desc" }, take: 4,
    }),
  ]);

  return <main className={`${styles.main} ${styles.catalog}`}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Статьи" }]} />
    <header className={styles.intro}>
      <h1>Статьи</h1>
      <p>Материалы о психическом здоровье, психотерапии и личностном развитии.</p>
    </header>
    <nav aria-label="Категории статей" className={styles.categories}>
      <Link href="/articles" aria-current={!selected ? "page" : undefined}>Все статьи</Link>
      {categories.map(item => <Link key={item.id} href={`/articles?category=${item.id}`} aria-current={selected?.id === item.id ? "page" : undefined}>
        <ProfileIcon name={Object.hasOwn(categoryIcons, item.name) ? categoryIcons[item.name] : "certificate"} /><span>{item.name}</span>
      </Link>)}
    </nav>
    <div className={styles.catalogLayout}>
      <div className={styles.articleList}>
        {articles.map(article => {
          const blocks = Array.isArray(article.blocks) ? article.blocks.filter(validBlock) : [];
          const photo = blocks.find(block => block.type === "photo" && block.files.length);
          const text = blocks.find(block => block.type === "text" && !block.heading);
          const excerpt = text?.type === "text" ? text.text.trim() : "";
          return <article className={styles.story} key={article.id}>
            <Link href={articlePath(article)} className={styles.storyCover} aria-label={article.title}>
              {photo?.type === "photo" ? <img src={mediaUrl(article.id, photo.files[0])} alt="" loading="lazy" /> : <ProfileIcon name="sprout" />}
            </Link>
            <div className={styles.storyBody}>
              {article.category && <span className={styles.categoryLabel}>{article.category.name}</span>}
              <h2><Link href={articlePath(article)}>{article.title}</Link></h2>
              {excerpt && <p>{excerpt.length > 200 ? `${excerpt.slice(0, 197).trimEnd()}…` : excerpt}</p>}
              <Link className={styles.readStory} href={articlePath(article)} aria-label={`Читать статью «${article.title}»`}>Читать статью <span aria-hidden="true">→</span></Link>
            </div>
          </article>;
        })}
        {!articles.length && <p className={styles.empty}>{selected ? "В этой категории пока нет публикаций." : "Здесь скоро появятся статьи."}</p>}
      </div>
      {recent.length > 0 && <aside className={styles.recent} aria-labelledby="recent-title">
        <h2 id="recent-title">Новые публикации</h2>
        <ul>{recent.map(article => <li key={article.id}><Link href={articlePath(article)}>{article.title}</Link></li>)}</ul>
        {selected && <Link href="/articles">Все статьи →</Link>}
      </aside>}
    </div>
  </main>;
}
