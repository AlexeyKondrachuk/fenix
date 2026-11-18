"use client";

import { useState } from "react";
import styles from "../site.module.scss";

export default function BackupDownload() {
  const [busy, setBusy] = useState<"database" | "media" | null>(null);
  const [message, setMessage] = useState("");
  async function download(kind: "database" | "media") {
    setBusy(kind);
    setMessage("");
    try {
      const response = await fetch(kind === "media" ? "/api/admin/backup/media" : "/api/admin/backup", { method: "POST" });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Не удалось скачать копию.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = response.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] || (kind === "media" ? "fenix-media.tar.gz" : "fenix.dump");
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setMessage("Файл передан браузеру для сохранения.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось скачать копию. Попробуйте снова.");
    } finally {
      setBusy(null);
    }
  }
  return <section aria-labelledby="backup-heading">
    <h2 id="backup-heading">Резервные копии сайта</h2>
    <p>Для полной копии содержимого скачайте оба файла: базу с настройками и статьями и архив фото и видео. В окне сохранения браузера выберите внешний диск или флешку. Если файл сохраняется автоматически, включите в настройках браузера запрос места сохранения.</p>
    <p>Архив материалов сохраняет папки статей и имена файлов. Подготовка и скачивание большого архива могут занять несколько минут.</p>
    <div className={styles.form}>
      <button type="button" disabled={busy !== null} onClick={() => download("database")}>{busy === "database" ? "Подготавливаем копию…" : "Скачать базу данных"}</button>
      <button type="button" disabled={busy !== null} onClick={() => download("media")}>{busy === "media" ? "Готовим и скачиваем архив…" : "Скачать фото и видео"}</button>
    </div>
    <p role="status" aria-live="polite">{message}</p>
  </section>;
}
