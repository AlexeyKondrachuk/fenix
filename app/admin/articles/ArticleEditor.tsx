"use client";

import { useCreateArticleMutation, useSaveArticleMutation, useUploadArticleMediaMutation } from "../../../Redux/articlesApi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fonts, mediaUrl, mediaTextLimit, photoLimit, photoTypes, seoTitleLimit, seoDescriptionLimit, videoLimit, videoTypes, type ArticleMediaDetails, type Block } from "../../../lib/articles";
import ArticlePhotos from "../../../components/ArticlePhotos";
import { deleteArticle, unpublishArticle } from "./actions";
import styles from "../../site.module.scss";

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data as { error?: string };
    if (data?.error) return data.error;
  }
  return "Не удалось сохранить данные.";
}

export function CreateArticle() {
  const router = useRouter();
  const [createArticle] = useCreateArticleMutation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <>
    <button type="button" disabled={busy} onClick={async () => {
      setBusy(true);
      setError("");
      try {
        const { id } = await createArticle().unwrap();
        router.push(`/admin/articles?id=${id}`);
      } catch (error) {
        setError(errorMessage(error));
        setBusy(false);
      }
    }}>Создать статью</button>
    {error && <p role="alert">{error}</p>}
  </>;
}

export default function ArticleEditor({ id, initial, categories }: { id: string; initial: { title: string; blocks: Block[]; published: boolean; categoryId: string | null; seoTitle: string; seoDescription: string }; categories: { id: string; name: string }[] }) {
  const [saveArticle] = useSaveArticleMutation();
  const [uploadMedia] = useUploadArticleMediaMutation();
  const [title, setTitle] = useState(initial.title);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription);
  const [categoryId, setCategoryId] = useState(initial.categoryId ?? "");
  const [blocks, setBlocks] = useState(initial.blocks);
  const [published, setPublished] = useState(initial.published);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  function add(type: Block["type"]) {
    const id = crypto.randomUUID();
    setBlocks([...blocks, type === "text" ? { id, type, text: "", heading: false, font: fonts[0], color: "#222222", size: 18 } : { id, type, files: [] }]);
  }
  function update(block: Block) {
    setBlocks(current => current.map(item => item.id === block.id ? block : item));
  }
  function move(index: number, step: number) {
    const reordered = [...blocks];
    [reordered[index], reordered[index + step]] = [reordered[index + step], reordered[index]];
    setBlocks(reordered);
  }
  async function run(work: () => Promise<void>) {
    setBusy(true);
    setError("");
    setMessage("");
    try { await work(); }
    catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }
  function save(nextPublished: boolean) {
    void run(async () => {
      await saveArticle({ id, title, blocks, published: nextPublished, categoryId: categoryId || null, seoTitle, seoDescription }).unwrap();
      setPublished(nextPublished);
      setMessage(nextPublished ? "Статья опубликована." : "Черновик сохранён.");
    });
  }
  function upload(block: Extract<Block, { files: string[] }>, selected: File[]) {
    void run(async () => {
      const photo = block.type === "photo";
      const files = photo ? [...block.files] : [];
      const limit = photo ? photoLimit : videoLimit;
      if (selected.some(file => file.size > limit)) throw new Error(photo ? "Максимальный размер фото — 300 КБ." : "Максимальный размер видео — 50 МБ.");
      for (const item of selected) {
        const { file } = await uploadMedia({ id, file: item }).unwrap();
        files.push(file);
        update({ ...block, files: [...files] });
      }
    });
  }
  return <section className={styles.form}>
    <p>Статус: {published ? "Опубликована" : "Черновик"}</p>
    <fieldset disabled={busy}>
      <label>Название статьи<input value={title} onChange={event => setTitle(event.target.value)} /></label>
      <fieldset>
        <legend>SEO и превью ссылки</legend>
        <p>Если поля пустые, используются название статьи и фрагмент её текста.</p>
        <label>SEO-заголовок<input value={seoTitle} maxLength={seoTitleLimit} onChange={event => setSeoTitle(event.target.value)} /></label>
        <label>SEO-описание<textarea value={seoDescription} maxLength={seoDescriptionLimit} rows={3} onChange={event => setSeoDescription(event.target.value)} /></label>
      </fieldset>
      <label>Категория<select value={categoryId} onChange={event => setCategoryId(event.target.value)}>
        <option value="">Без категории</option>
        {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select></label>
      {blocks.map((block, index) => <fieldset key={block.id} style={{ minWidth: 0, marginBlock: "1rem" }}>
        <legend>{block.type === "text" ? "Текст" : block.type === "photo" ? "Фото" : "Видео"}</legend>
        <button type="button" disabled={index === 0} onClick={() => move(index, -1)}>Выше</button>{" "}
        <button type="button" disabled={index === blocks.length - 1} onClick={() => move(index, 1)}>Ниже</button>{" "}
        <button type="button" onClick={() => setBlocks(blocks.filter(item => item.id !== block.id))}>Удалить блок</button>
        {block.type === "text" ? <>
          <label>Оформление<select value={block.heading ? "heading" : "text"} onChange={event => update({ ...block, heading: event.target.value === "heading" })}>
            <option value="text">Обычный текст</option><option value="heading">Заголовок</option>
          </select></label>
          <label>Шрифт<select value={block.font} onChange={event => update({ ...block, font: event.target.value })}>
            {fonts.map(font => <option key={font}>{font}</option>)}
          </select></label>
          <label>Цвет<input type="color" value={block.color} onChange={event => update({ ...block, color: event.target.value })} /></label>
          <label>Размер букв<select value={block.size} onChange={event => update({ ...block, size: Number(event.target.value) })}>
            {Array.from({ length: 43 }, (_, index) => 12 + index * 2).map(size => <option key={size} value={size}>{size} пикс.</option>)}
          </select></label>
          <label>Текст блока<textarea rows={5} value={block.text} style={{ fontFamily: block.font, color: block.color, fontSize: block.size, fontWeight: block.heading ? 700 : 400 }} onChange={event => update({ ...block, text: event.target.value })} /></label>
        </> : <>
          <label>{block.type === "photo" ? "Загрузить фото до 300 КБ каждое" : "Загрузить видео до 50 МБ"}
            <input type="file" multiple={block.type === "photo"} accept={Object.values(block.type === "photo" ? photoTypes : videoTypes).join(",")} onChange={event => {
              const selected = Array.from(event.target.files ?? []);
              event.target.value = "";
              if (selected.length) upload(block, selected);
            }} />
          </label>
          {block.type === "photo" ? <ArticlePhotos id={id} files={block.files} details={block.details} admin /> :
            block.files[0] && <video src={mediaUrl(id, block.files[0], true)} controls preload="metadata" style={{ maxWidth: "100%" }} />}
          {block.files.map((file, index) => {
            const details = block.details?.[file];
            const setDetails = (patch: ArticleMediaDetails[string]) => {
              update({ ...block, details: { ...block.details, [file]: { ...details, ...patch } } });
            };
            return <div key={file}>
              {block.type === "photo" ? (
                <label>Альтернативный текст для фото {index + 1}<input value={details?.alt ?? ""} maxLength={mediaTextLimit} onChange={event => setDetails({ alt: event.target.value })} /></label>
              ) : <>
                <label>Название видео<input value={details?.title ?? ""} maxLength={mediaTextLimit} onChange={event => setDetails({ title: event.target.value })} /></label>
                <label>Описание видео<textarea value={details?.description ?? ""} maxLength={mediaTextLimit} onChange={event => setDetails({ description: event.target.value })} /></label>
              </>}
              <button type="button" onClick={() => {
                const remaining = { ...block.details };
                delete remaining[file];
                update({ ...block, details: remaining, files: block.files.filter(item => item !== file) });
              }}>{block.type === "photo" ? `Удалить фото ${index + 1}` : "Удалить видео"}</button>
            </div>;
          })}
        </>}
      </fieldset>)}
      <p>{(["text", "photo", "video"] as const).map((type, index) =>
        <button key={type} type="button" onClick={() => add(type)} style={{ marginInlineEnd: ".5rem" }}>Добавить {["текст", "фото", "видео"][index]}</button>)}</p>
      <button type="button" onClick={() => save(false)}>Сохранить черновик</button>{" "}
      <button type="button" onClick={() => save(true)}>Опубликовать статью</button>
      {published && <button type="button" onClick={() => void run(async () => {
        if (!await unpublishArticle(id)) throw new Error("Статья не найдена.");
        setPublished(false);
        setMessage("Статья снята с публикации.");
      })}>Снять с публикации</button>}
      <details>
        <summary>Удалить статью</summary>
        <form action={deleteArticle.bind(null, id)}>
          <p>Статья будет удалена окончательно.</p>
          <button type="submit">Подтвердить удаление</button>
        </form>
      </details>
    </fieldset>
    {busy && <p role="status">Подождите…</p>}
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    {published && <a href={`/articles/${id}`}>Открыть опубликованную статью</a>}
  </section>;
}
