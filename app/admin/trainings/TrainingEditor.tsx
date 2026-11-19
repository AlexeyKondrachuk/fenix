"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { trainingIcons, trainingSeoTitleLimit, trainingSeoDescriptionLimit, type TrainingData, type TrainingDate } from "../../../lib/trainings-data";
import TrainingIcon from "../../../components/icons/TrainingIcon";
import { saveTraining } from "./actions";
import shared from "../concerns/concerns.module.scss";
import styles from "./trainings-admin.module.scss";
function transliterate(text: string) {
  const map: Record<string, string> = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
  return [...text.toLowerCase()].map(c => map[c] ?? c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120).replace(/-$/, "");
}
export default function TrainingEditor({ id, initial, saved = false }: { id: string; initial: TrainingData; saved?: boolean }) {
  const [data, setData] = useState(initial);
  const [state, action, pending] = useActionState(saveTraining, {});
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  function update(patch: Partial<TrainingData>) { setData(current => ({ ...current, ...patch })); setDirty(true); }
  function date(index: number, patch: Partial<TrainingDate>) { update({ dates: data.dates.map((d, i) => i === index ? { ...d, ...patch } : d) }); }
  async function upload(files: File[]) {
    if (files.length + data.photos.length > 12) { setUploadError("Можно добавить до 12 фото."); return; }
    if (files.some(f => f.size > 10 * 1024 * 1024)) { setUploadError("Максимальный размер одного фото — 10 МБ."); return; }
    setUploading(true); setUploadError("");
    try {
      for (const file of files) {
        const form = new FormData(); form.set("image", file);
        const response = await fetch("/api/admin/trainings/upload", { method: "POST", body: form });
        const result = await response.json();
        if (!response.ok || !result.file) throw new Error(result.error || "Не удалось загрузить фото.");
        setData(current => ({ ...current, photos: [...current.photos, result.file] })); setDirty(true);
      }
    } catch (error) { setUploadError(error instanceof Error ? error.message : "Не удалось загрузить фото."); }
    finally { setUploading(false); }
  }
  function moveDate(index: number, offset: number) { const dates = [...data.dates]; [dates[index], dates[index + offset]] = [dates[index + offset], dates[index]]; update({ dates }); }
  return <form action={action} onSubmit={() => setDirty(false)} className={shared.form}>
    <fieldset disabled={pending || uploading} className={shared.fields}>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="content" value={JSON.stringify(data)} />
      <label>Название тренинга<input required maxLength={250} value={data.title} onChange={e => update({ title: e.target.value, ...(!initial.slug && (!data.slug || data.slug === transliterate(data.title)) ? { slug: transliterate(e.target.value) } : {}) })} /></label>
      <label>Адрес страницы<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={120} placeholder="nazvanie-treninga" value={data.slug} onChange={e => update({ slug: e.target.value })} /><small>/treningi/{data.slug || "nazvanie-treninga"} — латинские буквы, цифры и дефис.</small></label>
      <label>Краткое описание для карточки<textarea required maxLength={1500} rows={3} value={data.summary} onChange={e => update({ summary: e.target.value })} /></label>
      <fieldset>
        <legend>SEO и превью ссылки</legend>
        <p>Если поля пустые, используются название и краткое описание тренинга.</p>
        <label>SEO-заголовок<input maxLength={trainingSeoTitleLimit} value={data.seoTitle ?? ""} onChange={e => update({ seoTitle: e.target.value })} /></label>
        <label>SEO-описание<textarea maxLength={trainingSeoDescriptionLimit} rows={3} value={data.seoDescription ?? ""} onChange={e => update({ seoDescription: e.target.value })} /></label>
      </fieldset>
      <label>Подробное описание<textarea required maxLength={40000} rows={12} value={data.description} onChange={e => update({ description: e.target.value })} /><small>Отделяйте абзацы пустой строкой.</small></label>
      <div className={styles.twoColumns}>
        <label>Продолжительность<input required maxLength={200} placeholder="3 дня" value={data.duration} onChange={e => update({ duration: e.target.value })} /></label>
        <label>Время занятий<input required maxLength={300} placeholder="с 9:00 до 18:00" value={data.time} onChange={e => update({ time: e.target.value })} /></label>
        <label>Стоимость<input required maxLength={100} placeholder="12 000 руб. или По договорённости" value={data.price} onChange={e => update({ price: e.target.value })} /></label>
        <label>Плашка (необязательно)<input maxLength={100} placeholder="Базовый курс" value={data.badge} onChange={e => update({ badge: e.target.value })} /></label>
      </div>
      <label>Условия участия (необязательно)<textarea rows={2} maxLength={1000} value={data.requirements} onChange={e => update({ requirements: e.target.value })} /></label>
      <div className={styles.iconChoice}><TrainingIcon name={data.icon} /><label>Иконка<select value={data.icon} onChange={e => update({ icon: e.target.value as TrainingData["icon"] })}>{Object.entries(trainingIcons).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
      <h2>Даты проведения</h2><p>Добавьте один или несколько наборов. Если дат нет, на сайте появится «Даты уточняются». Прошедшие встречи отмечаются как завершённые.</p>
      <ol className={shared.list}>{data.dates.map((d, index) => <li key={index}><div className={styles.twoColumns}><label>Начало<input type="date" required value={d.start} onChange={e => date(index, { start: e.target.value })} /></label><label>Окончание<input type="date" required min={d.start || undefined} value={d.end} onChange={e => date(index, { end: e.target.value })} /></label></div><label>Примечание (необязательно)<input maxLength={300} placeholder="Группа 2, новый набор" value={d.note} onChange={e => date(index, { note: e.target.value })} /></label><div className={shared.tools}><button type="button" disabled={index === 0} onClick={() => moveDate(index, -1)}>↑ Выше</button><button type="button" disabled={index === data.dates.length - 1} onClick={() => moveDate(index, 1)}>↓ Ниже</button><button type="button" onClick={() => update({ dates: data.dates.filter((_, i) => i !== index) })}>Удалить даты</button></div></li>)}</ol>
      <button type="button" disabled={data.dates.length >= 50} onClick={() => update({ dates: [...data.dates, { start: "", end: "", note: "" }] })}>+ Добавить даты</button>
      <h2>Фотографии (необязательно)</h2><p>JPG, PNG или WebP до 10 МБ, не более 12 фотографий. Первое фото используется в карточке. Изображения публикуются после сохранения тренинга.</p>
      <div className={styles.photos}>{data.photos.map((file, index) => <div key={`${file}-${index}`}><img src={`/api/training-images/${file}`} alt={`Фото ${index + 1}`} /><div className={shared.tools}><button type="button" disabled={index === 0} onClick={() => { const photos = [...data.photos]; [photos[index - 1], photos[index]] = [photos[index], photos[index - 1]]; update({ photos }); }}>← Раньше</button><button type="button" disabled={index === data.photos.length - 1} onClick={() => { const photos = [...data.photos]; [photos[index + 1], photos[index]] = [photos[index], photos[index + 1]]; update({ photos }); }}>Позже →</button><button type="button" onClick={() => update({ photos: data.photos.filter((_, i) => i !== index) })}>Убрать фото</button></div></div>)}</div>
      {data.photos.length < 12 && <label>Загрузить фотографии<input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e => { const files = Array.from(e.target.files || []); e.target.value = ""; if (files.length) void upload(files); }} /></label>}
      <label>Порядок в расписании<input type="number" min={0} max={10000} required value={data.position} onChange={e => update({ position: Number(e.target.value) })} /></label>
      <label className={styles.checkbox}><input type="checkbox" checked={data.published} onChange={e => update({ published: e.target.checked })} />Опубликован — показывать на сайте</label>
    </fieldset>
    <p role="status" aria-live="polite">{uploading ? "Загружаем фото…" : uploadError}</p>
    <div className={shared.save}><button type="submit" disabled={pending || uploading}>{pending ? "Сохраняем…" : "Сохранить тренинг"}</button><span role="status" aria-live="polite">{state.error || (dirty ? "Есть несохранённые изменения" : state.saved || saved ? "Тренинг сохранён." : "")}</span>{initial.published && initial.slug && <Link href={`/treningi/${initial.slug}`} target="_blank">Открыть на сайте ↗</Link>}</div>
  </form>;
}
