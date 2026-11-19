import { db } from "../../lib/db";
import { specialists } from "../../lib/hero";
import Link from "next/link";
import ReviewContent from "./ReviewContent";
import ReviewForm from "./ReviewForm";
import ReviewText from "./ReviewText";
import styles from "./reviews.module.scss";

const pageSize = 6;

async function getReviews(requestedPage: string | string[] | undefined, specialist?: keyof typeof specialists) {
  const model = db().review;
  const where = { status: "APPROVED", ...(specialist ? { specialist } : {}) } as const;
  const lastPage = Math.max(1, Math.ceil(await model.count({ where }) / pageSize));
  const requested = typeof requestedPage === "string" ? Number(requestedPage) : 1;
  const page = Number.isSafeInteger(requested) ? Math.max(1, Math.min(requested, lastPage)) : 1;
  const reviews = await model.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: { id: true, name: true, specialist: true, createdAt: true, text: true, rating: true, media: { select: { id: true, mimeType: true } } },
  });
  return { reviews, page, lastPage };
}

export default async function Reviews({ className, requestedPage, specialist }: { className?: string; requestedPage?: string | string[]; specialist?: keyof typeof specialists }) {
  const result = await getReviews(requestedPage, specialist).catch(error => {
    console.error("Failed to load published reviews", error instanceof Error ? error.name : "Unknown error");
    return null;
  });

  if (!result) return null;
  const { reviews, page, lastPage } = result;
  const pathname = specialist ? specialists[specialist].href : "/";
  const pageLink = (number: number) => `${pathname}${number > 1 ? `?reviewPage=${number}` : ""}#reviews`;
  return <section id="reviews" className={specialist ? styles.profileReviews : className} aria-labelledby="reviews-title">
    <div className={styles.heading}>
      <h2 id="reviews-title">{specialist ? "Отзывы о специалисте" : "Отзывы"}</h2>
      <ReviewForm defaultSpecialist={specialist} />
    </div>
    {reviews.length ? <div className={styles.cards}>
      {reviews.map(review => <article key={review.id} className={styles.card}>
        <ReviewContent review={review} textContent={
          <ReviewText text={review.text}>
            <ReviewContent review={review} />
          </ReviewText>
        } />
      </article>)}
    </div> : <p>{specialist ? "У этого специалиста пока нет опубликованных отзывов." : "Здесь появятся отзывы после модерации."}</p>}
    {lastPage > 1 && <nav className={styles.pagination} aria-label="Страницы отзывов">
      {page > 1 && <Link href={pageLink(page - 1)} prefetch={false}>Назад</Link>}
      <span>{page} из {lastPage}</span>
      {page < lastPage && <Link href={pageLink(page + 1)} prefetch={false}>Далее</Link>}
    </nav>}
  </section>;
}
