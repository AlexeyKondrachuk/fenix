"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { authorized } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";
import { certificateDirectory } from "../../../lib/certificates";
import { validCertificates } from "../../../lib/certificates-data";
export type SaveState = { error?: string; saved?: boolean };
export async function saveCertificates(_previous: SaveState, form: FormData): Promise<SaveState> {
  if (!await authorized()) redirect("/admin");
  const raw = String(form.get("content") ?? "");
  if (raw.length > 150_000) return { error: "Слишком много данных." };
  let content: unknown;
  try { content = JSON.parse(raw); } catch { return { error: "Не удалось прочитать форму." }; }
  if (!validCertificates(content)) return { error: "Проверьте названия, фото и год (например, 2016 или 2010–2011)." };
  const cleaned = { title: content.title.trim(), items: content.items.map(i => ({ ...i, title: i.title.trim() })) };
  try {
    const files = await Promise.all(cleaned.items.map(i => stat(join(certificateDirectory, i.file))));
    if (files.some(f => !f.isFile())) return { error: "Загрузите фото всех документов." };
    await db().certificatesContent.upsert({ where: { id: 1 }, create: { id: 1, content: cleaned }, update: { content: cleaned } });
  } catch { return { error: "Не удалось сохранить. Проверьте загрузку фото и подключение к базе. Изменения остались в форме." }; }
  revalidatePath("/psyhoterapevt"); revalidatePath("/admin/certificates");
  return { saved: true };
}
