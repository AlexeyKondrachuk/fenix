import { titleSlug } from "../../../lib/article-seo";
import { randomUUID } from "node:crypto";
import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { authorized } from "../../../lib/admin-auth";
import { articleId, photoLimit, photoTypes, validBlock, videoLimit, videoTypes } from "../../../lib/articles";
import { uploadRoot } from "../../../lib/article-storage";
import { db } from "../../../lib/db";

function error(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!await authorized()) return error("Войдите в админку.", 401);
  const type = request.headers.get("content-type")?.split(";")[0];
  if (type === "application/json") {
    const body = await request.json().catch(() => null);
    if (!body) return error("Проверьте данные статьи.");
    if (body.create === true) {
      const { id } = await db().article.create({ data: {} });
      return Response.json({ id });
    }
    const { id, title, blocks, published, categoryId } = body;
    if (typeof id !== "string" || !articleId.test(id) || typeof title !== "string" ||
      !Array.isArray(blocks) || !blocks.every(validBlock) || typeof published !== "boolean") {
      return error("Проверьте данные статьи.");
    }
    if (categoryId !== undefined && categoryId !== null && (typeof categoryId !== "string" ||
      !articleId.test(categoryId) || !await db().articleCategory.findUnique({ where: { id: categoryId }, select: { id: true } }))) {
      return error("Выберите существующую категорию.");
    }
    if (published && (!title.trim() || !blocks.length || blocks.some(block =>
      block.type === "text" ? !block.text.trim() : !block.files.length))) {
      return error("Укажите название и заполните все блоки перед публикацией.");
    }
    try {
      await Promise.all(blocks.flatMap(block => block.type === "text" ? [] :
        block.files.map((file: string) => access(join(uploadRoot, id, file)))));
    } catch {
      return error("Один из файлов отсутствует. Загрузите его снова.");
    }
    const existing = await db().article.findUnique({ where: { id }, select: { slug: true } });
    let slug = existing?.slug;
    if (!slug && title.trim()) {
      const base = titleSlug(title);
      const conflict = await db().article.findUnique({ where: { slug: base }, select: { id: true } });
      slug = conflict ? `${base}-${id}` : base;
    }
    const result = await db().article.updateMany({ where: { id }, data: { title: title.trim(), blocks, published, ...(categoryId !== undefined ? { categoryId } : {}), ...(slug ? { slug } : {}) } });
    return result.count ? Response.json({ id }) : error("Статья не найдена.", 404);
  }

  const id = new URL(request.url).searchParams.get("id") ?? "";
  const photo = Object.values(photoTypes).some(mime => mime === type);
  const extension = Object.entries(photo ? photoTypes : videoTypes).find(([, mime]) => mime === type)?.[0];
  if (!extension) return error("Выберите JPG, PNG, WebP, GIF, MP4 или WebM.");
  if (!articleId.test(id) || !await db().article.findUnique({ where: { id }, select: { id: true } })) {
    return error("Статья не найдена.", 404);
  }
  const limit = photo ? photoLimit : videoLimit;
  const limitMessage = photo ? "Максимальный размер фото — 300 КБ." : "Максимальный размер видео — 50 МБ.";
  if (Number(request.headers.get("content-length")) > limit) return error(limitMessage, 413);
  const reader = request.body?.getReader();
  if (!reader) return error("Выберите файл.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return error(limitMessage, 413);
    }
    chunks.push(value);
  }
  if (!size) return error("Файл пуст.");
  const file = `${randomUUID()}.${extension}`;
  const directory = join(uploadRoot, id);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, file), Buffer.concat(chunks), { flag: "wx" });
  return Response.json({ file });
}
