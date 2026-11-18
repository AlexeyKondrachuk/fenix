"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authorized } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";
import { validConcerns } from "../../../lib/concerns-data";

export type SaveState = { error?: string; saved?: boolean };
export async function saveConcerns(_previous: SaveState, form: FormData): Promise<SaveState> {
  if (!await authorized()) redirect("/admin");
  const raw = String(form.get("content") ?? "");
  if (raw.length > 600_000) return { error: "Слишком много текста." };
  let content: unknown;
  try { content = JSON.parse(raw); } catch { return { error: "Не удалось прочитать данные формы." }; }
  if (!validConcerns(content)) return { error: "Заполните заголовки и списки запросов. В карточке должно быть от 1 до 30 пунктов." };
  const cleaned = { title: content.title.trim(), subtitle: content.subtitle.trim(), cards: content.cards.map(card => ({
    title: card.title.trim(), icon: card.icon, items: card.items.map(item => item.trim()),
  })) };
  try {
    await db().concernsContent.upsert({ where: { id: 1 }, create: { id: 1, content: cleaned }, update: { content: cleaned } });
  } catch {
    return { error: "Не удалось сохранить изменения. Проверьте подключение к базе и повторите попытку. Текст сохранён в форме." };
  }
  revalidatePath("/psyhoterapevt");
  revalidatePath("/admin/concerns");
  return { saved: true };
}
