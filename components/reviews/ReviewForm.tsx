"use client";

import { reviewSpecialists } from "../../lib/review-specialists";

import { reviewPhotoLimit, reviewVideoLimit } from "../../lib/review-upload-limits";

import { useId, useRef, useState, type FormEvent } from "react";
import styles from "./reviews.module.scss";

const ratings = [1, 2, 3, 4, 5];

export default function ReviewForm({ defaultSpecialist }: { defaultSpecialist?: keyof typeof reviewSpecialists }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const [rating, setRating] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const photo = data.get("photo");
    const video = data.get("video");
    if (photo instanceof File && photo.size > reviewPhotoLimit) {
      setError("Фото должно быть не больше 2 МБ.");
      return;
    }
    if (video instanceof File && video.size > reviewVideoLimit) {
      setError("Видео должно быть не больше 50 МБ.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/reviews", { method: "POST", body: data });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message ?? "Не удалось отправить отзыв. Попробуйте ещё раз.");
      form.reset();
      setRating(0);
      dialog.current?.close();
      setSuccess(result.message);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось отправить отзыв.");
    } finally {
      setPending(false);
    }
  }

  return <>
    <button type="button" className={styles.primary} onClick={() => {
      setSuccess("");
      dialog.current?.showModal();
    }}>Добавить отзыв</button>
    {success && <p role="status" className={styles.feedback}>{success}</p>}
    <dialog ref={dialog} aria-labelledby={title} className={styles.dialog} onCancel={event => {
      if (pending) event.preventDefault();
    }}>
      <div className={styles.dialogHeading}>
        <h2 id={title}>Добавить отзыв</h2>
        <button type="button" aria-label="Закрыть" disabled={pending} onClick={() => dialog.current?.close()}>×</button>
      </div>
      <form onSubmit={submit} className={styles.form}>
        <fieldset disabled={pending}>
          <legend>Оценка</legend>
          <div className={styles.stars}>
            {ratings.map(value => <label key={value}>
              <input type="radio" name="rating" value={value} required checked={rating === value} onChange={() => setRating(value)} aria-label={`Оценка ${value} из 5`} />
              <span aria-hidden="true">{value <= rating ? "★" : "☆"}</span>
            </label>)}
          </div>
          <label>Кому адресован отзыв
            <select name="specialist" defaultValue={defaultSpecialist ?? ""} required>
              <option value="" disabled>Выберите получателя</option>
              {Object.entries(reviewSpecialists).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>Имя для публикации (по желанию)<input type="text" name="name" autoComplete="given-name" maxLength={80} /></label>
          <label>Отзыв<textarea name="text" rows={4} maxLength={2000} required /></label>
          <label>Фото (по желанию, до 2 МБ)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" /></label>
          <label>Видео (по желанию, до 50 МБ)<input type="file" name="video" accept="video/mp4,video/webm" /></label>
          <p>Пожалуйста, уберите из текста и вложений диагнозы, контакты и личные данные других людей.</p>
          <label className={styles.consent}>
            <input type="checkbox" name="consent" required />
            <span>Я согласен на размещение моего отзыва и приложенных материалов на сайте после модерации.</span>
          </label>
        </fieldset>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={pending} className={styles.primary}>{pending ? "Отправляем…" : "Отправить на модерацию"}</button>
      </form>
    </dialog>
  </>;
}
