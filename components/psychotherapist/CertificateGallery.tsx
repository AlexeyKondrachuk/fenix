"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Certificate } from "../../lib/certificates-data";
import styles from "./CertificateGallery.module.scss";

export default function CertificateGallery({ items }: { items: Certificate[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const slideTouch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  useEffect(() => {
    if (active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.current?.open) dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [active]);
  function close() { dialog.current?.close(); setActive(null); setZoom(false); opener.current?.focus(); }
  function change(offset: number) { setActive(current => current === null ? null : Math.max(0, Math.min(items.length - 1, current + offset))); setZoom(false); }
  function move(offset: number) { setPosition(current => (current + offset + items.length) % items.length); }
  const current = active === null ? null : items[active];
  const selected = items[position];
  const [title, ...tags] = selected.title.split(" · ");
  return <>
    <div className={styles.gallery} role="region" aria-label="Галерея дипломов и сертификатов" aria-roledescription="карусель" onKeyDown={event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    }}>
      <ul className={styles.stage} aria-label="Документы" onTouchStart={event => { swiped.current = false; slideTouch.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }} onTouchEnd={event => {
        if (!slideTouch.current) return;
        const dx = event.changedTouches[0].clientX - slideTouch.current.x;
        const dy = event.changedTouches[0].clientY - slideTouch.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) { swiped.current = true; move(dx < 0 ? 1 : -1); }
        slideTouch.current = null;
      }}>{items.map((item, index) => {
        let offset = (index - position + items.length) % items.length;
        if (offset > items.length / 2) offset -= items.length;
        const depth = Math.abs(offset);
        return <li key={item.id} className={styles.slide} data-active={offset === 0 || undefined} data-hidden={depth > 2 || undefined} aria-hidden={depth > 2 || undefined} style={{ "--offset": offset, "--depth": depth, zIndex: 10 - depth } as CSSProperties}>
          <button type="button" tabIndex={offset === 0 ? 0 : -1} onClick={event => {
            if (swiped.current) { swiped.current = false; return; }
            if (offset !== 0) { setPosition(index); return; }
            opener.current = event.currentTarget; setActive(index);
          }} aria-label={`${offset === 0 ? "Увеличить документ" : "Показать документ"}: ${item.title}`}>
            <img src={`/api/certificates/${item.file}`} alt={item.title} loading={depth > 1 ? "lazy" : "eager"} draggable={false} />
            {offset === 0 && <span className={styles.zoomHint} aria-hidden="true">↗</span>}
          </button>
        </li>;
      })}</ul>
      <div className={styles.details} aria-live="polite" aria-atomic="true"><p className={styles.caption}>{title}</p><div className={styles.tags}>{selected.year && <span>{selected.year}</span>}{tags.map((tag, index) => <span key={index}>{tag}</span>)}<span className={styles.documentTag}>Документ об образовании</span></div></div>
      <div className={styles.controls}><button type="button" onClick={() => move(-1)} disabled={items.length <= 1} aria-label="Предыдущий сертификат">←</button><span>{position + 1} <span className={styles.total}>/ {items.length}</span></span><button type="button" onClick={() => move(1)} disabled={items.length <= 1} aria-label="Следующий сертификат">→</button></div>
      <div className={styles.pagination} aria-label="Выбор документа">{items.map((item, index) => <button key={item.id} type="button" aria-label={`Показать: ${item.title}`} aria-current={position === index ? "true" : undefined} onClick={() => setPosition(index)} />)}</div>
    </div>
    <dialog ref={dialog} className={styles.dialog} aria-label="Просмотр документа" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); change(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); change(1); }
    }}>
      {current && <div className={styles.viewer}>
        <div className={styles.toolbar}><span>{active! + 1} / {items.length}</span><button type="button" onClick={() => setZoom(value => !value)} aria-pressed={zoom}>{zoom ? "Уменьшить −" : "Увеличить +"}</button><button type="button" onClick={close} aria-label="Закрыть документ">✕</button></div>
        <div className={`${styles.canvas} ${zoom ? styles.zoomed : ""}`} onTouchStart={event => { touch.current = !zoom && event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }} onTouchEnd={event => {
          if (!touch.current || zoom) return; const dx = event.changedTouches[0].clientX - touch.current.x; const dy = event.changedTouches[0].clientY - touch.current.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) change(dx < 0 ? 1 : -1); touch.current = null;
        }}><img src={`/api/certificates/${current.file}`} alt={current.title} /></div>
        <div className={styles.viewerFooter}><button type="button" disabled={active === 0} onClick={() => change(-1)} aria-label="Предыдущий документ">←</button><p>{current.title}{current.year && ` · ${current.year}`}</p><button type="button" disabled={active === items.length - 1} onClick={() => change(1)} aria-label="Следующий документ">→</button></div>
      </div>}
    </dialog>
  </>;
}
