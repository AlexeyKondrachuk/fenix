"use client";
import { useActionState, useState } from "react";
import { concernIcons, type Concerns, type ConcernIconName } from "../../../lib/concerns-data";
import ConcernIcon from "../../../components/icons/ConcernIcon";
import { saveConcerns } from "./actions";
import styles from "./concerns.module.scss";

export default function ConcernsEditor({ initial }: { initial: Concerns }) {
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [cards, setCards] = useState(() => initial.cards.map((c, index) => ({ id: `initial-${index}`, title: c.title, icon: c.icon, text: c.items.join("\n") })));
  const [state, action, pending] = useActionState(saveConcerns, {});
  const [dirty, setDirty] = useState(false);
  const content: Concerns = { title, subtitle, cards: cards.map(c => ({ title: c.title, icon: c.icon, items: c.text.split("\n").map(s => s.trim()).filter(Boolean) })) };
  function update(id: string, patch: Partial<(typeof cards)[number]>) {
    setCards(current => current.map(c => c.id === id ? { ...c, ...patch } : c)); setDirty(true);
  }
  function move(index: number, offset: number) {
    setCards(current => { const next = [...current]; const dest = index + offset;
      if (dest < 0 || dest >= next.length) return current;
      [next[index], next[dest]] = [next[dest], next[index]]; return next;
    }); setDirty(true);
  }
  return <form action={form => { setDirty(false); action(form); }} className={styles.form}>
    <fieldset disabled={pending} className={styles.fields}>
      <label>Заголовок блока<input required maxLength={200} value={title} onChange={e => { setTitle(e.target.value); setDirty(true); }} /></label>
      <label>Подзаголовок<input required maxLength={500} value={subtitle} onChange={e => { setSubtitle(e.target.value); setDirty(true); }} /></label>
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <p>Каждый запрос вводите с новой строки. Карточки отображаются на сайте слева направо. Изменения публикуются после сохранения.</p>
      <ol className={styles.list}>{cards.map((card, index) => <li key={card.id}>
        <div className={styles.iconChoice}><ConcernIcon name={card.icon} /><label>Иконка карточки {index + 1}<select value={card.icon} onChange={e => update(card.id, { icon: e.target.value as ConcernIconName })}>
          {Object.entries(concernIcons).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select></label></div>
        <label>Название карточки<input required maxLength={200} value={card.title} onChange={e => update(card.id, { title: e.target.value })} /></label>
        <label>Запросы — по одному на строку<textarea required rows={7} maxLength={16000} value={card.text} onChange={e => update(card.id, { text: e.target.value })} /></label>
        <div className={styles.tools}>
          <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Переместить карточку ${index + 1} выше`}>↑ Выше</button>
          <button type="button" disabled={index === cards.length - 1} onClick={() => move(index, 1)} aria-label={`Переместить карточку ${index + 1} ниже`}>↓ Ниже</button>
          <button type="button" onClick={() => { setCards(current => current.filter(c => c.id !== card.id)); setDirty(true); }} aria-label={`Удалить карточку ${index + 1}`}>Удалить</button>
        </div>
      </li>)}</ol>
      <button type="button" disabled={cards.length >= 30} onClick={() => { setCards(current => [...current, { id: crypto.randomUUID(), title: "", icon: "anxiety", text: "" }]); setDirty(true); }}>+ Добавить карточку</button>
    </fieldset>
    <div className={styles.save}><button type="submit" disabled={pending}>{pending ? "Сохраняем…" : "Сохранить изменения"}</button>
      <span role="status" aria-live="polite">{state.error || (dirty ? "Есть несохранённые изменения" : state.saved ? "Изменения сохранены." : "")}</span>
    </div>
  </form>;
}
