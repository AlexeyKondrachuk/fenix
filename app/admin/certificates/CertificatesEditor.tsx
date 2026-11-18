"use client";
import { useActionState, useState } from "react";
import type { Certificate, Certificates } from "../../../lib/certificates-data";
import { saveCertificates } from "./actions";
import styles from "../concerns/concerns.module.scss";
import local from "./certificates.module.scss";
export default function CertificatesEditor({ initial }: { initial: Certificates }) {
  const [title, setTitle] = useState(initial.title);
  const [items, setItems] = useState(initial.items);
  const [state, action, pending] = useActionState(saveCertificates, {});
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  function update(id: string, patch: Partial<Certificate>) { setItems(current => current.map(i => i.id === id ? { ...i, ...patch } : i)); setDirty(true); }
  async function upload(file: File, id?: string) {
    if (file.size > 10 * 1024 * 1024) { setError("Максимальный размер фото — 10 МБ."); return; }
    setUploading(id || "new"); setError("");
    try {
      const form = new FormData(); form.set("image", file);
      const response = await fetch("/api/admin/certificates/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok || !data.file) throw new Error(data.error || "Не удалось загрузить фото.");
      if (id) update(id, { file: data.file });
      else { setItems(current => [...current, { id: crypto.randomUUID(), title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "), year: "", file: data.file }]); setDirty(true); }
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось загрузить фото."); }
    finally { setUploading(null); }
  }
  function move(index: number, offset: number) { setItems(current => { const next = [...current]; const destination = index + offset; if (destination < 0 || destination >= next.length) return current; [next[index], next[destination]] = [next[destination], next[index]]; return next; }); setDirty(true); }
  return <form action={action} onSubmit={() => setDirty(false)} className={styles.form}>
    <fieldset disabled={pending || uploading !== null} className={styles.fields}>
      <label>Заголовок блока<input required maxLength={200} value={title} onChange={e => { setTitle(e.target.value); setDirty(true); }} /></label>
      <input type="hidden" name="content" value={JSON.stringify({ title, items })} />
      <p>Фото JPG, PNG или WebP до 10 МБ. После загрузки задайте подпись и нажмите «Сохранить изменения». Удаление убирает документ из галереи; исходные файлы сохраняются в медиаархиве.</p>
      <ol className={styles.list}>{items.map((item, index) => <li key={item.id}>
        <img className={local.preview} src={`/api/certificates/${item.file}`} alt={item.title} />
        <label>Название документа<input required maxLength={300} value={item.title} onChange={e => update(item.id, { title: e.target.value })} /></label>
        <label>Год (необязательно)<input maxLength={9} placeholder="2016 или 2010–2011" pattern="[0-9]{4}([–-][0-9]{4})?" value={item.year} onChange={e => update(item.id, { year: e.target.value })} /></label>
        <label>Заменить фото<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file, item.id); e.target.value = ""; }} /></label>
        <div className={styles.tools}><button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Переместить документ ${index + 1} выше`}>↑ Выше</button><button type="button" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label={`Переместить документ ${index + 1} ниже`}>↓ Ниже</button><button type="button" onClick={() => { setItems(current => current.filter(i => i.id !== item.id)); setDirty(true); }} aria-label={`Удалить документ ${index + 1}`}>Удалить</button></div>
      </li>)}</ol>
      {items.length < 100 && <label>+ Добавить документ<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file); e.target.value = ""; }} /></label>}
    </fieldset>
    <p role="status" aria-live="polite">{uploading ? "Загружаем фото…" : error}</p>
    <div className={styles.save}><button type="submit" disabled={pending || uploading !== null}>{pending ? "Сохраняем…" : "Сохранить изменения"}</button><span role="status" aria-live="polite">{state.error || (dirty ? "Есть несохранённые изменения" : state.saved ? "Изменения сохранены." : "")}</span></div>
  </form>;
}
