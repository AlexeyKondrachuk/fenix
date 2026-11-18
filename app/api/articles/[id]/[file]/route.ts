import { authorized } from "../../../../../lib/admin-auth";
import { articleId, mediaName } from "../../../../../lib/articles";
import { serveMedia } from "../../../../../lib/article-storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string; file: string }> }) {
  const { id, file } = await params;
  if (!await authorized() || !articleId.test(id) || !mediaName.test(file)) return new Response(null, { status: 404 });
  return serveMedia(request, id, file);
}
