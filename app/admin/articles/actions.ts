"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authorized } from "../../../lib/admin-auth";
import { articleId } from "../../../lib/articles";
import { db } from "../../../lib/db";

export async function createArticleCategory(formData: FormData) {
  if (!await authorized()) redirect("/admin");
  const value = formData.get("name");
  const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (!name || name.length > 80) redirect("/admin/articles?categoryError=1");
  await db().articleCategory.upsert({ where: { name }, update: {}, create: { name } });
  redirect("/admin/articles?categorySaved=1");
}

function refreshArticles() {
  revalidatePath("/admin/articles");
  revalidatePath("/articles", "layout");
  revalidatePath("/sitemap.xml");
}

export async function unpublishArticle(id: string) {
  if (!await authorized()) redirect("/admin");
  if (typeof id !== "string" || !articleId.test(id)) throw new Error("Некорректный идентификатор статьи.");
  const result = await db().article.updateMany({ where: { id }, data: { published: false } });
  if (!result.count) return false;
  refreshArticles();
  return true;
}

export async function deleteArticle(id: string) {
  if (!await authorized()) redirect("/admin");
  if (typeof id !== "string" || !articleId.test(id)) redirect("/admin/articles");
  await db().article.deleteMany({ where: { id } });
  refreshArticles();
  redirect("/admin/articles?deleted=1");
}
