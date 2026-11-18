import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { authorized } from "../../../../../lib/admin-auth";
import { createMediaBackup } from "../../../../../lib/media-backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 660;
let running = false;
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function POST(request: Request) {
  if (!await authorized()) return Response.json({ error: "Войдите в админку." }, { status: 401, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Недопустимый запрос." }, { status: 403, headers });
  }
  if (running) return Response.json({ error: "Архив материалов уже готовится или скачивается. Попробуйте позже." }, { status: 409, headers });
  running = true;
  let archive: Awaited<ReturnType<typeof createMediaBackup>> | undefined;
  try {
    archive = await createMediaBackup(request.signal);
    const file = createReadStream(archive.path);
    const cleanup = archive.cleanup;
    file.once("close", () => {
      void cleanup().catch(() => {}).finally(() => { running = false; });
    });
    const date = new Date().toISOString().replace(/[:.]/g, "-");
    return new Response(Readable.toWeb(file) as ReadableStream, { headers: {
      ...headers,
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="fenix-media-${date}.tar.gz"`,
      "Content-Length": String(archive.size),
    } });
  } catch (error) {
    console.error("[media-backup] Archive failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      code: error && typeof error === "object" && "code" in error ? error.code : undefined,
    });
    if (archive) await archive.cleanup().catch(() => {});
    running = false;
    const missing = error instanceof Error && error.message === "MEDIA_DIRECTORY_MISSING";
    return Response.json({ error: missing
      ? "Папка материалов пока отсутствует. Загрузите фото или видео в статью."
      : "Не удалось создать архив. Проверьте свободное место и права на чтение материалов и запись во временную папку сервера." }, { status: missing ? 404 : 503, headers });
  }
}
