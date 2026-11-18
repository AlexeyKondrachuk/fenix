"use client";

import { useState } from "react";
import { mediaUrl } from "../lib/articles";

export default function ArticlePhotos({ id, files, admin = false }: { id: string; files: string[]; admin?: boolean }) {
  const [index, setIndex] = useState(0);
  if (!files.length) return null;
  const current = index % files.length;
  return <figure style={{ marginInline: 0 }}>
    <img src={mediaUrl(id, files[current], admin)} alt={`Фото ${current + 1}`} style={{ maxWidth: "100%", maxHeight: "65vh" }} />
    {files.length > 1 && <figcaption>
      <button type="button" onClick={() => setIndex((current + files.length - 1) % files.length)}>Предыдущее фото</button>
      {" "}{current + 1} / {files.length}{" "}
      <button type="button" onClick={() => setIndex((current + 1) % files.length)}>Следующее фото</button>
    </figcaption>}
  </figure>;
}
