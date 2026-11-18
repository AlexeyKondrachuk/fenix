"use client";

import { useId, useRef } from "react";
import styles from "./EducationPanel.module.scss";

export default function EducationTimeline({ items }: { items: string[] }) {
  const listId = useId();
  const list = useRef<HTMLDivElement>(null);
  function scroll(direction: number) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.current?.scrollBy({ top: direction * list.current.clientHeight * .75, behavior: reducedMotion ? "instant" : "smooth" });
  }
  return <div className={styles.timelineLayout}>
    <div ref={list} id={listId} className={styles.scrollArea} tabIndex={0} role="region" aria-label="Список образования и повышения квалификации">
      <ol className={styles.timeline}>{items.map((item, index) => {
        const date = item.match(/^(?:С\s+)?\d{4}(?:[–—-]\d{4})?\s*гг?\./i)?.[0];
        return <li key={`${index}-${item}`}>
          {date ? <><strong>{date}</strong>{item.slice(date.length)}</> : item}
        </li>;
      })}</ol>
      {!items.length && <p>Информация об образовании готовится к публикации.</p>}
    </div>
    <div className={styles.scrollControls}>
      <button type="button" onClick={() => scroll(-1)} aria-label="Прокрутить список образования вверх" aria-controls={listId}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg></button>
      <span aria-hidden="true" />
      <button type="button" onClick={() => scroll(1)} aria-label="Прокрутить список образования вниз" aria-controls={listId}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
    </div>
  </div>;
}

