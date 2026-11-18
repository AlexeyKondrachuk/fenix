"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authorized } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";
import { validPrices } from "../../../lib/prices-data";

export type SaveState = { error?: string; saved?: boolean };
export async function savePrices(_previous: SaveState, form: FormData): Promise<SaveState> {
  if (!await authorized()) redirect("/admin");
  const raw = String(form.get("content") ?? "");
  if (raw.length > 400_000) return { error: "Слишком много текста." };
  let content: unknown;
  try { content = JSON.parse(raw); } catch { return { error: "Не удалось прочитать данные формы." }; }
  if (!validPrices(content)) return { error: "Заполните названия и цены услуг. Допустимо до 100 услуг." };
  const cleaned = { title: content.title.trim(), services: content.services.map(s => ({ name: s.name.trim(), price: s.price.trim(), note: s.note.trim() })) };
  try {
    await db().pricesContent.upsert({ where: { id: 1 }, create: { id: 1, content: cleaned }, update: { content: cleaned } });
  } catch {
    return { error: "Не удалось сохранить изменения. Проверьте подключение к базе и повторите попытку. Ваши изменения остались в форме." };
  }
  revalidatePath("/psyhoterapevt");
  revalidatePath("/admin/prices");
  return { saved: true };
}
