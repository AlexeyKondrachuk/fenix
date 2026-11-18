import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import { mediaTypes } from "./articles";

export const uploadRoot = resolve(process.env.ARTICLE_UPLOAD_DIR || "article-uploads");

export async function serveMedia(request: Request, id: string, file: string) {
  const path = resolve(uploadRoot, id, file);
  const info = await stat(path).catch(() => null);
  if (!info?.isFile()) return new Response(null, { status: 404 });
  const headers = new Headers({
    "Content-Type": mediaTypes[file.split(".")[1] as keyof typeof mediaTypes],
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
  });
  const range = request.headers.get("range");
  let start = 0;
  let end = info.size - 1;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match && (match[1] || match[2])) {
      if (match[1]) {
        start = Number(match[1]);
        if (match[2]) end = Math.min(end, Number(match[2]));
      } else {
        start = Math.max(0, info.size - Number(match[2]));
      }
    }
    if (!match || (!match[1] && !match[2]) || start > end) {
      headers.set("Content-Range", `bytes */${info.size}`);
      return new Response(null, { status: 416, headers });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${info.size}`);
  }
  headers.set("Content-Length", String(end - start + 1));
  return new Response(Readable.toWeb(createReadStream(path, { start, end })) as ReadableStream, {
    status: range ? 206 : 200, headers,
  });
}
