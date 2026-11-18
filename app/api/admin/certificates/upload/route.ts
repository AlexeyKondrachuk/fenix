import { authorized } from "../../../../../lib/admin-auth";
import { certificateDirectory } from "../../../../../lib/certificates";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!await authorized()) return Response.json({ error: "Войдите в админку." }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Недопустимый запрос." }, { status: 403 });
  const limit = 12 * 1024 * 1024;
  if (Number(request.headers.get("content-length")) > limit) return Response.json({ error: "Максимальный размер фото — 10 МБ." }, { status: 413 });
  try {
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ error: "Выберите фото." }, { status: 400 });
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length;
      if (size > limit) { await reader.cancel(); return Response.json({ error: "Максимальный размер фото — 10 МБ." }, { status: 413 }); } chunks.push(value); }
    const form = await new Request(request.url, { method: "POST", headers: { "content-type": request.headers.get("content-type") || "" }, body: Buffer.concat(chunks) }).formData();
    const file = form.get("image");
    if (!(file instanceof File) || !file.size || file.size > 10 * 1024 * 1024) return Response.json({ error: "Выберите изображение до 10 МБ." }, { status: 400 });
    const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40_000_000 });
    const metadata = await image.metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) return Response.json({ error: "Поддерживаются JPG, PNG и WebP." }, { status: 400 });
    const output = await image.rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 92 }).toBuffer();
    await mkdir(certificateDirectory, { recursive: true });
    const name = `${randomUUID()}.jpg`;
    await writeFile(join(certificateDirectory, name), output, { flag: "wx" });
    return Response.json({ file: name });
  } catch { return Response.json({ error: "Не удалось загрузить фото. Проверьте формат и повторите попытку." }, { status: 400 }); }
}
