import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authorized } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";
import { isReviewSpecialist } from "../../../lib/review-specialists";
import { removeReviewFiles } from "../../../lib/review-storage";
import ReviewContent from "../../../components/reviews/ReviewContent";
import reviewStyles from "../../../components/reviews/reviews.module.scss";
import styles from "../../site.module.scss";

const filters = { PENDING: "На модерации", APPROVED: "Опубликованные", REJECTED: "Отклонённые" } as const;
const pageSize = 20;

async function moderate(id: string, action: "publish" | "reject" | "unpublish") {
  "use server";
  if (!await authorized()) redirect("/admin");
  if (action !== "publish" && action !== "reject" && action !== "unpublish") return;
  const decision = action === "publish" ? "APPROVED" : "REJECTED";

  const attachments = await db().$transaction(async tx => {
    const result = await tx.review.updateMany({
      where: { id, status: action === "unpublish" ? "APPROVED" : "PENDING" },
      data: { status: decision },
    });
    if (!result.count || decision !== "REJECTED") return [];
    const media = await tx.reviewMedia.findMany({ where: { reviewId: id }, select: { id: true, mimeType: true } });
    await tx.reviewMedia.deleteMany({ where: { reviewId: id } });
    return media;
  });
  await removeReviewFiles(attachments);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

async function deleteReview(id: string) {
  "use server";
  if (!await authorized()) redirect("/admin");
  const attachments = await db().$transaction(async tx => {
    const media = await tx.reviewMedia.findMany({ where: { reviewId: id }, select: { id: true, mimeType: true } });
    await tx.review.deleteMany({ where: { id } });
    return media;
  });
  await removeReviewFiles(attachments);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export default async function AdminReviews({ searchParams }: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  if (!await authorized()) redirect("/admin");
  const { status: requested, page: rawPage } = await searchParams;
  const status = requested === "APPROVED" || requested === "REJECTED" ? requested : "PENDING";
  const requestedPage = Number(rawPage);
  const total = await db().review.count({ where: { status } });
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const page = Number.isSafeInteger(requestedPage) ? Math.min(lastPage, Math.max(1, requestedPage)) : 1;
  const reviews = await db().review.findMany({
    where: { status },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: { id: true, name: true, specialist: true, rating: true, text: true, createdAt: true, media: { select: { id: true, mimeType: true } } },
  });

  return <main className={styles.content}>
    <h1>Отзывы</h1>
    <nav aria-label="Статус отзыва" className={reviewStyles.moderationNav}>
      {Object.entries(filters).map(([value, label]) => <Link key={value} href={`/admin/reviews?status=${value}`} aria-current={status === value ? "page" : undefined}>{label}</Link>)}
    </nav>
    {reviews.length ? <div className={reviewStyles.moderation}>
      {reviews.map(review => <article key={review.id} className={reviewStyles.card}>
        {!isReviewSpecialist(review.specialist) && <p>Получатель не указан</p>}
        <ReviewContent review={review} />
        <div className={reviewStyles.moderationActions}>
          {status === "PENDING" && <form action={moderate.bind(null, review.id, "publish")}>
            <button type="submit">Опубликовать</button>
          </form>}
          {status !== "REJECTED" && <form action={moderate.bind(null, review.id, status === "APPROVED" ? "unpublish" : "reject")}>
            <button type="submit">{status === "APPROVED" ? "Снять с публикации" : "Отклонить"}</button>
          </form>}
          <details>
            <summary>Удалить отзыв</summary>
            <form action={deleteReview.bind(null, review.id)}>
              <p>Отзыв и его вложения будут удалены без возможности восстановления.</p>
              <button type="submit">Удалить окончательно</button>
            </form>
          </details>
        </div>
      </article>)}
    </div> : <p>Отзывов в этом разделе пока нет.</p>}
    {lastPage > 1 && <nav aria-label="Страницы отзывов" className={reviewStyles.moderationNav}>
      {page > 1 && <Link href={`?status=${status}&page=${page - 1}`}>Назад</Link>}
      <span>{page} из {lastPage}</span>
      {page < lastPage && <Link href={`?status=${status}&page=${page + 1}`}>Далее</Link>}
    </nav>}
  </main>;
}
