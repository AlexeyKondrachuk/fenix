import { articleId, mediaName, validBlock } from "../../../../../../lib/articles";
import { serveMedia } from "../../../../../../lib/article-storage";
import { db } from "../../../../../../lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string; file: string }> }) {
  const { id, file } = await params;
  if (!articleId.test(id) || !mediaName.test(file)) return new Response(null, { status: 404 });
  const article = await db().article.findUnique({ where: { id, published: true }, select: { blocks: true } });
  if (!Array.isArray(article?.blocks) || !article.blocks.some(block =>
    validBlock(block) && block.type !== "text" && block.files.includes(file))) return new Response(null, { status: 404 });
  return serveMedia(request, id, file);
}
