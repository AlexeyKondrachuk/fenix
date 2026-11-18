import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { heroDirectory, isHeroRole } from "../../../../lib/hero";

export async function GET(request: Request, { params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!isHeroRole(role)) return new Response(null, { status: 404 });
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  try {
    const photo = await readFile(join(heroDirectory, role + ".webp"));
    return new Response(new Uint8Array(photo), { headers: { ...headers, "Content-Type": "image/webp" } });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return new Response(null, { status: 307, headers: { ...headers, Location: "/hero/" + role + ".jpg" } });
  }
}
