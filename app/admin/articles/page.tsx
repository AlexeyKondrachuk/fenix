import Link from "next/link";
import { redirect } from "next/navigation";
import { authorized } from "../../../lib/admin-auth";
import { articleId, validBlock } from "../../../lib/articles";
import { db } from "../../../lib/db";
import styles from "../../site.module.scss";
import ArticleEditor, { CreateArticle } from "./ArticleEditor";
import { createArticleCategory } from "./actions";

export const metadata = { title: "Статьи — Админка", robots: { index: false, follow: false } };

export default async function AdminArticles({ searchParams }: { searchParams: Promise<{ id?: string; categoryError?: string; categorySaved?: string }> }) {
  if (!await authorized()) redirect("/admin");
  const { id, categoryError, categorySaved } = await searchParams;
  const categories = await db().articleCategory.findMany({ orderBy: { name: "asc" } });
  const article = id && articleId.test(id) ? await db().article.findUnique({ where: { id } }) : null;
  const articles = id ? [] : await db().article.findMany({
    select: { id: true, title: true, published: true, category: { select: { name: true } } }, orderBy: { updatedAt: "desc" },
  });
  return <main className={styles.content}>
    <h1>{id ? "Редактирование статьи" : "Статьи"}</h1>
    {id && <Link href="/admin/articles">← Статьи и категории</Link>}
    {article ? <ArticleEditor key={article.id} id={article.id} categories={categories} initial={{
      title: article.title, published: article.published, categoryId: article.categoryId,
      blocks: Array.isArray(article.blocks) ? article.blocks.filter(validBlock) : [],
    }} /> : id ? <p>Статья не найдена.</p> : <>
      <section className={styles.form} aria-labelledby="article-categories">
        <h2 id="article-categories">Категории</h2>
        <form action={createArticleCategory}>
          <label>Название категории<input name="name" required maxLength={80} /></label>
          <button type="submit">Добавить категорию</button>
        </form>
        {categoryError && <p role="alert">Введите название категории до 80 символов.</p>}
        {categorySaved && <p role="status">Категория доступна в редакторе статьи.</p>}
        {categories.length > 0 && <ul>{categories.map(category => <li key={category.id}>{category.name}</li>)}</ul>}
      </section>
      <h2>Материалы</h2>
      <CreateArticle />
      {articles.length ? <ul>{articles.map(article => <li key={article.id}>
        <Link href={`/admin/articles?id=${article.id}`}>{article.title || "Без названия"}</Link>
        {" — "}{article.published ? "опубликована" : "черновик"}
        {" · "}{article.category?.name ?? "Без категории"}
      </li>)}</ul> : <p>Статей пока нет.</p>}
    </>}
  </main>;
}
