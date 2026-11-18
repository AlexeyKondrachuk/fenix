"use client";
import { useActionState, useState } from "react";
import type { Education } from "../../../lib/education";
import { saveEducation, type SaveState } from "./actions";
import styles from "./education.module.scss";

export default function EducationEditor({ initial }: { initial: Education }) {
  const [items, setItems] = useState(() => initial.items.map((text, index) => ({ id: `initial-${index}`, text })));
  const [description, setDescription] = useState(initial.description);
  const [state, action, pending] = useActionState<SaveState, FormData>(saveEducation, {});
  const [dirty, setDirty] = useState(false);
  function move(index: number, offset: number) {
    const next = [...items];
    const destination = index + offset;
    if (destination < 0 || destination >= next.length) return;
    [next[index], next[destination]] = [next[destination], next[index]];
    setItems(next);
    setDirty(true);
  }
  return <form action={form => { setDirty(false); action(form); }} className={styles.form}>
    <fieldset disabled={pending} className={styles.fields}>
      <label className={styles.description}>Описание слева<textarea name="description" required maxLength={5000} rows={6} value={description} onChange={event => { setDescription(event.target.value); setDirty(true); }} /></label>
      <input type="hidden" name="items" value={JSON.stringify(items.map(item => item.text))} />
      <h2>Образование и повышение квалификации</h2><p>Порядок здесь совпадает с порядком на сайте. Изменения публикуются после сохранения.</p>
      <ol className={styles.list}>{items.map((item, index) => <li key={item.id}>
        <label><span>Пункт {index + 1}</span><textarea required maxLength={5000} rows={3} value={item.text} onChange={event => {
          setItems(current => current.map(entry => entry.id === item.id ? { ...entry, text: event.target.value } : entry)); setDirty(true);
        }} /></label>
        <div className={styles.tools}>
          <button type="button" disabled={index === 0} aria-label={`Переместить пункт ${index + 1} выше`} onClick={() => move(index, -1)}>↑ Выше</button>
          <button type="button" disabled={index === items.length - 1} aria-label={`Переместить пункт ${index + 1} ниже`} onClick={() => move(index, 1)}>↓ Ниже</button>
          <button type="button" aria-label={`Удалить пункт ${index + 1}`} onClick={() => { setItems(current => current.filter(entry => entry.id !== item.id)); setDirty(true); }}>Удалить</button>
        </div>
      </li>)}</ol>
      <button type="button" disabled={items.length >= 200} onClick={() => { setItems(current => [...current, { id: crypto.randomUUID(), text: "" }]); setDirty(true); }}>+ Добавить пункт</button>
    </fieldset>
    <div className={styles.save}><button type="submit" disabled={pending}>{pending ? "Сохраняем…" : "Сохранить изменения"}</button>
      <span role="status" aria-live="polite">{state.error || (dirty ? "Есть несохранённые изменения" : state.saved ? "Изменения сохранены." : "")}</span>
    </div>
  </form>;
}
