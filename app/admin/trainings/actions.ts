"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { authorized } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";
import { validTraining, trainingId } from "../../../lib/trainings-data";
import { trainingDirectory } from "../../../lib/training-storage";
export type SaveState = { error?: string; saved?: boolean };
export async function saveTraining(_previous: SaveState, form: FormData): Promise<SaveState> {
  if (!await authorized()) redirect("/admin");
  const id = String(form.get("id") || "");
  const raw = String(form.get("content") || "");
  if (!trainingId.test(id) || raw.length > 100000) return { error: "Некорректные данные формы." };
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return { error: "Не удалось прочитать форму." }; }
  if (!validTraining(input)) return { error: "Заполните обязательные поля и проверьте даты: дата окончания не может быть раньше начала." };
  const { slug, title, published, position, ...content } = input;
  const cleaned = { ...content, summary: content.summary.trim(), description: content.description.trim(), duration: content.duration.trim(), time: content.time.trim(), price: content.price.trim(), requirements: content.requirements.trim(), badge: content.badge.trim(), dates: content.dates.map(d => ({ ...d, note: d.note.trim() })) };
  let previous: { slug: string } | null;
  try {
    const files = await Promise.all(input.photos.map(file => stat(join(trainingDirectory, file))));
    if (files.some(file => !file.isFile())) return { error: "Загрузите фотографии заново." };
    previous = await db().training.findUnique({ where: { id }, select: { slug: true } });
    const data = { slug, title: title.trim(), published, position, content: cleaned };
    await db().training.upsert({ where: { id }, create: { id, ...data }, update: data });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return { error: "Этот адрес уже занят другим тренингом. Измените адрес страницы." };
    return { error: "Не удалось сохранить тренинг. Проверьте фотографии и подключение к базе. Изменения остались в форме." };
  }
  revalidatePath("/treningi"); revalidatePath(`/treningi/${slug}`); revalidatePath("/admin/trainings");
  if (previous && previous.slug !== slug) revalidatePath(`/treningi/${previous.slug}`);
  if (!previous) redirect(`/admin/trainings?id=${id}&saved=1`);
  return { saved: true };
}
