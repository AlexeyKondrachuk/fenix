"use client";

import { useState } from "react";
import styles from "./Header.module.scss";

export default function ReadingMode() {
  const [enabled, setEnabled] = useState(false);

  return <button className={styles.readingMode} type="button"
    aria-label="Режим повышенной читаемости" title="Режим повышенной читаемости" aria-pressed={enabled}
    onClick={() => {
      document.documentElement.toggleAttribute("data-reading-mode", !enabled);
      setEnabled(!enabled);
    }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </button>;
}
