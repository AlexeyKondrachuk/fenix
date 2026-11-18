"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authorized } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";
import { validEducation } from "../../../lib/education";

export type SaveState = { error?: string; saved?: boolean };
export async function saveEducation(_previous: SaveState, form: FormData): Promise<SaveState> {
  if (!await authorized()) redirect("/admin");
  const raw = String(form.get("items") ?? "");
  if (raw.length > 1_100_000) return { error: "Список слишком большой." };
  let items: unknown;
  try { items = JSON.parse(raw); } catch { return { error: "Не удалось прочитать список. Обновите страницу и повторите сохранение." }; }
  const content = { description: String(form.get("description") ?? "").trim(), items };
  if (!validEducation(content)) return { error: "Заполните описание и все пункты. Допустимо до 200 пунктов, до 5000 символов в каждом и в описании." };
  const data = { description: content.description, items: content.items.map(item => item.trim()) };
  try {
    await db().educationContent.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
  } catch {
    return { error: "Не удалось сохранить изменения. Проверьте подключение к базе и повторите попытку. Ваши правки остались в форме." };
  }
  revalidatePath("/psyhoterapevt");
  revalidatePath("/admin/education");
  return { saved: true };
}
