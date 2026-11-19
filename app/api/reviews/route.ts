import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { db } from "../../../lib/db";
import { isReviewSpecialist } from "../../../lib/review-specialists";
import { reviewBodyLimit, reviewPhotoLimit, reviewVideoLimit } from "../../../lib/review-upload-limits";
import { removeReviewFiles, saveReviewFile } from "../../../lib/review-storage";

const reply = (message: string, status: number) => Response.json({ message }, { status });

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!request.body || !contentType?.startsWith("multipart/form-data;")) {
    return reply("Используйте форму отзыва.", 415);
  }
  if (Number(request.headers.get("content-length")) > reviewBodyLimit) {
    return reply("Вложения слишком большие.", 413);
  }

  let size = 0;
  let tooLarge = false;
  const body = request.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      size += chunk.byteLength;
      if (size > reviewBodyLimit) {
        tooLarge = true;
        controller.error(new Error("Request body too large"));
        return;
      }
      controller.enqueue(chunk);
    },
  }));

  let data: FormData;
  try {
    data = await new Response(body, { headers: { "content-type": contentType } }).formData();
  } catch {
    return tooLarge ? reply("Вложения слишком большие.", 413) : reply("Не удалось прочитать форму.", 400);
  }

  const specialist = data.get("specialist");
  if (!isReviewSpecialist(specialist)) return reply("Выберите, кому адресован отзыв.", 400);
  const rawText = data.get("text");
  const rawName = data.get("name");
  const name = typeof rawName === "string" ? rawName.trim() : "";
  if (name.length > 80) return reply("Укажите имя длиной до 80 символов.", 400);
  const text = typeof rawText === "string" ? rawText.trim() : "";
  const rating = data.get("rating");
  if (!text || text.length > 2000 || typeof rating !== "string" || !/^[1-5]$/.test(rating) || data.get("consent") !== "on") {
    return reply("Укажите оценку, напишите отзыв до 2000 символов и подтвердите согласие.", 400);
  }

  const photo = data.get("photo");
  const video = data.get("video");
  const media: { bytes: Uint8Array<ArrayBuffer>; mimeType: string }[] = [];

  if (photo instanceof File && photo.size) {
    if (photo.size > reviewPhotoLimit) return reply("Фото должно быть не больше 2 МБ.", 413);
    try {
      const image = sharp(Buffer.from(await photo.arrayBuffer()), { limitInputPixels: 25_000_000 });
      const { format } = await image.metadata();
      if (!["jpeg", "png", "webp"].includes(format ?? "")) throw new Error("Unsupported image");
      const bytes = await image.rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp().toBuffer();
      media.push({ bytes: Uint8Array.from(bytes), mimeType: "image/webp" });
    } catch {
      return reply("Загрузите корректное фото JPEG, PNG или WebP.", 400);
    }
  }

  if (video instanceof File && video.size) {
    if (video.size > reviewVideoLimit) return reply("Видео должно быть не больше 50 МБ.", 413);
    const bytes = new Uint8Array(await video.arrayBuffer());
    const header = Buffer.from(bytes.subarray(0, 128));
    const mp4 = video.type === "video/mp4" && header.toString("ascii", 4, 8) === "ftyp";
    const webm = video.type === "video/webm" && header.subarray(0, 4).toString("hex") === "1a45dfa3" && header.includes("webm");
    if (!mp4 && !webm) return reply("Загрузите видео в формате MP4 или WebM.", 400);
    media.push({ bytes, mimeType: mp4 ? "video/mp4" : "video/webm" });
  }

  const reviewId = randomUUID();
  const attachments: { id: string; mimeType: string }[] = [];
  try {
    for (const { bytes, mimeType } of media) {
      const attachment = { id: randomUUID(), mimeType };
      await saveReviewFile(attachment, bytes);
      attachments.push(attachment);
    }
  } catch (error) {
    await removeReviewFiles(attachments);
    console.error("Failed to store review attachment", error instanceof Error ? error.name : "Unknown error");
    return reply("Не удалось сохранить вложения. Попробуйте ещё раз.", 503);
  }

  try {
    await db().review.create({
      data: { id: reviewId, specialist, name: name || null, text, rating: Number(rating), media: { create: attachments } },
      select: { id: true },
    });
  } catch (error) {
    const saved = await db().review.findUnique({ where: { id: reviewId }, select: { id: true } }).catch(() => undefined);
    if (saved) return reply("Спасибо! Отзыв отправлен на модерацию.", 201);
    if (saved === null) await removeReviewFiles(attachments);
    console.error("Failed to save review", error instanceof Error ? error.name : "Unknown error");
    return reply("Не удалось отправить отзыв. Попробуйте ещё раз.", 503);
  }
  return reply("Спасибо! Отзыв отправлен на модерацию.", 201);
}
