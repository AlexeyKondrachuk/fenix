import styles from "./reviews.module.scss";
import type { ReactNode } from "react";
import { isReviewSpecialist } from "../../lib/review-specialists";

const recipientLabels = {
  adult: "Виталию Волкову",
  child: "Алле Волковой",
  center: "Центру «Феникс»",
};
const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Samara",
});

export default function ReviewContent({ review, textContent }: {
  review: { name: string | null; specialist: string | null; createdAt: Date; rating: number; text: string; media: { id: string; mimeType: string }[] };
  textContent?: ReactNode;
}) {
  return <>
    {isReviewSpecialist(review.specialist) && <span className={styles.recipientBadge}>
      Кому: <strong>{recipientLabels[review.specialist]}</strong>
    </span>}
    <header className={styles.reviewAuthor}>
      <strong>{review.name || "Анонимно"}</strong>
      <time dateTime={review.createdAt.toISOString()}>{dateFormat.format(review.createdAt)}</time>
    </header>
    <div className={styles.rating} aria-label={`Оценка ${review.rating} из 5`} role="img">
      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
    </div>
    {textContent ?? <p className={styles.text}>{review.text}</p>}
    {review.media.map(({ id, mimeType }) => mimeType.startsWith("image/") ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={styles.media} key={id} src={`/api/reviews/media/${id}`} alt="Фото к отзыву" loading="lazy" />
    ) : (
      <video className={styles.media} key={id} controls playsInline preload="none" aria-label="Видеоотзыв">
        <source src={`/api/reviews/media/${id}`} type={mimeType} />
      </video>
    ))}
  </>;
}
