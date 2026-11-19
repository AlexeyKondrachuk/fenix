import { mkdir, open, rm } from "node:fs/promises";
import { join } from "node:path";
import { serveMedia, uploadRoot } from "./article-storage";

const directory = "review-media";
const idPattern = /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
const extensions = new Map([
  ["image/webp", "webp"],
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);

type Attachment = { id: string; mimeType: string };

function filename({ id, mimeType }: Attachment) {
  const extension = extensions.get(mimeType);
  return idPattern.test(id) && extension ? `${id}.${extension}` : null;
}

export async function saveReviewFile(attachment: Attachment, bytes: Uint8Array) {
  const name = filename(attachment);
  if (!name) throw new Error("Invalid review attachment");
  const root = join(uploadRoot, directory);
  await mkdir(root, { recursive: true });
  const path = join(root, name);
  const file = await open(path, "wx");
  try {
    try {
      await file.writeFile(bytes);
    } finally {
      await file.close();
    }
  } catch (error) {
    await rm(path, { force: true });
    throw error;
  }
}

export async function removeReviewFiles(attachments: Attachment[]) {
  for (const attachment of attachments) {
    const name = filename(attachment);
    if (!name) continue;
    await rm(join(uploadRoot, directory, name), { force: true }).catch(error => {
      console.error("Failed to remove review attachment", attachment.id, error);
    });
  }
}

export function serveReviewFile(request: Request, attachment: Attachment) {
  const name = filename(attachment);
  if (!name) return new Response(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
  return serveMedia(request, directory, name);
}
