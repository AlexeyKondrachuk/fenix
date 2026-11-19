"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./reviews.module.scss";

export default function ReviewText({ text, children }: {
  text: string;
  children: ReactNode;
}) {
  const id = useId();
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const paragraph = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const element = paragraph.current;
    if (!element) return;
    const measure = () => {
      const style = getComputedStyle(element);
      const lines = Number(style.getPropertyValue("--review-preview-lines"));
      setOverflow(element.scrollHeight > Math.ceil(lines * Number.parseFloat(style.lineHeight)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  return <div>
    <p ref={paragraph} className={`${styles.text} ${styles.preview}`}>{text}</p>
    {overflow && <button type="button" className={styles.toggle} aria-haspopup="dialog" aria-controls={id} onClick={() => {
      dialog.current?.showModal();
      setOpen(true);
    }}>
      Читать полностью
    </button>}
    <dialog id={id} ref={dialog} className={`${styles.dialog} ${styles.reviewDialog}`} aria-labelledby={titleId} onClose={() => setOpen(false)}>
      <div className={styles.dialogHeading}>
        <h2 id={titleId}>Отзыв</h2>
        <form method="dialog">
          <button type="submit" aria-label="Закрыть отзыв" autoFocus>×</button>
        </form>
      </div>
      {open && <div className={styles.reviewDialogContent}>{children}</div>}
    </dialog>
  </div>;
}
