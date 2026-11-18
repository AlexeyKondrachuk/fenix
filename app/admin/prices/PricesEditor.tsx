"use client";
import { useActionState, useState } from "react";
import type { Prices } from "../../../lib/prices-data";
import { savePrices } from "./actions";
import styles from "../concerns/concerns.module.scss";

export default function PricesEditor({ initial }: { initial: Prices }) {
  const [title, setTitle] = useState(initial.title);
  const [services, setServices] = useState(() => initial.services.map((s, index) => ({ ...s, id: `initial-${index}` })));
  const [state, action, pending] = useActionState(savePrices, {});
  const [dirty, setDirty] = useState(false);
  const content: Prices = { title, services: services.map(({ name, price, note }) => ({ name, price, note })) };
  function update(id: string, patch: Partial<(typeof services)[number]>) {
    setServices(current => current.map(s => s.id === id ? { ...s, ...patch } : s)); setDirty(true);
  }
  function move(index: number, offset: number) {
    setServices(current => { const next = [...current]; const dest = index + offset;
      if (dest < 0 || dest >= next.length) return current;
      [next[index], next[dest]] = [next[dest], next[index]]; return next;
    }); setDirty(true);
  }
  return <form action={form => { setDirty(false); action(form); }} className={styles.form}>
    <fieldset disabled={pending} className={styles.fields}>
      <label>Заголовок блока<input required maxLength={200} value={title} onChange={e => { setTitle(e.target.value); setDirty(true); }} /></label>
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <p>Укажите цену вместе с валютой, например «6 000 руб», или напишите «По договорённости». Изменения публикуются после сохранения.</p>
      <ol className={styles.list}>{services.map((service, index) => <li key={service.id}>
        <label>Услуга {index + 1}<textarea required maxLength={1000} rows={2} value={service.name} onChange={e => update(service.id, { name: e.target.value })} /></label>
        <label>Стоимость<input required maxLength={100} value={service.price} onChange={e => update(service.id, { price: e.target.value })} /></label>
        <label>Пояснение к услуге (необязательно)<textarea maxLength={2000} rows={3} value={service.note} onChange={e => update(service.id, { note: e.target.value })} /></label>
        <div className={styles.tools}>
          <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Переместить услугу ${index + 1} выше`}>↑ Выше</button>
          <button type="button" disabled={index === services.length - 1} onClick={() => move(index, 1)} aria-label={`Переместить услугу ${index + 1} ниже`}>↓ Ниже</button>
          <button type="button" onClick={() => { setServices(current => current.filter(s => s.id !== service.id)); setDirty(true); }} aria-label={`Удалить услугу ${index + 1}`}>Удалить</button>
        </div>
      </li>)}</ol>
      <button type="button" disabled={services.length >= 100} onClick={() => { setServices(current => [...current, { id: crypto.randomUUID(), name: "", price: "", note: "" }]); setDirty(true); }}>+ Добавить услугу</button>
    </fieldset>
    <div className={styles.save}><button type="submit" disabled={pending}>{pending ? "Сохраняем…" : "Сохранить изменения"}</button>
      <span role="status" aria-live="polite">{state.error || (dirty ? "Есть несохранённые изменения" : state.saved ? "Изменения сохранены." : "")}</span>
    </div>
  </form>;
}
