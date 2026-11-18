import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { certificateDirectory } from "../../../../lib/certificates";
import { certificateFile } from "../../../../lib/certificates-data";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!certificateFile.test(file)) return new Response(null, { status: 404 });
  const data = await readFile(join(certificateDirectory, file)).catch(() => null);
  return data ? new Response(data, { headers: { "Content-Type": "image/jpeg", "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=31536000, immutable" } }) : new Response(null, { status: 404 });
}
