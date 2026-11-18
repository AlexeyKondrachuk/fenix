import { authorized } from "../../../../lib/admin-auth";
import { createDatabaseBackup } from "../../../../lib/database-backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 150;
let running = false;
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function POST(request: Request) {
  if (!await authorized()) return Response.json({ error: "Войдите в админку." }, { status: 401, headers });
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: "Недопустимый запрос." }, { status: 403, headers });
  }
  if (running) return Response.json({ error: "Выгрузка уже выполняется. Попробуйте позже." }, { status: 409, headers });
  running = true;
  try {
    const backup = await createDatabaseBackup();
    const date = new Date().toISOString().replace(/[:.]/g, "-");
    return new Response(new Uint8Array(backup), { headers: {
      ...headers,
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="fenix-${date}.dump"`,
      "Content-Length": String(backup.length),
    } });
  } catch {
    return Response.json({ error: "Не удалось выгрузить базу. Проверьте, что PostgreSQL запущен и на сервере доступен Docker или pg_dump." }, { status: 503, headers });
  } finally {
    running = false;
  }
}
