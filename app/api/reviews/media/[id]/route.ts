import { authorized } from "../../../../../lib/admin-auth";
import { db } from "../../../../../lib/db";
import { serveReviewFile } from "../../../../../lib/review-storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await authorized();
  const media = await db().reviewMedia.findFirst({
    where: { id, ...(admin ? {} : { review: { status: "APPROVED" } }) },
    select: { id: true, mimeType: true },
  });
  if (!media) return new Response(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
  return serveReviewFile(request, media);
}
