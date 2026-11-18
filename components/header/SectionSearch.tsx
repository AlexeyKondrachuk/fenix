"use client";

import { useState } from "react";
import Dropdown from "./Dropdown";
import styles from "./Header.module.scss";

const sections = [
  { href: "/treningi", label: "Тренинги", keywords: "расписание группы психотерапия интенсив даты стоимость" },
  { href: "/#directions", label: "Направления", keywords: "помощь консультация психология" },
  { href: "/psyhoterapevt", label: "Психотерапевт", keywords: "психотерапия взрослые" },
  { href: "/detskiy-psiholog", label: "Детский психолог", keywords: "дети подростки" },
  { href: "/#parents", label: "Родителям", keywords: "родители семья" },
];

export default function SectionSearch() {
  const [query, setQuery] = useState("");
  const words = query.trim().toLocaleLowerCase("ru").split(/\s+/);
  const results = sections.filter(({ label, keywords }) =>
    words.every(word => `${label} ${keywords}`.toLocaleLowerCase("ru").includes(word))
  );

  return <Dropdown className={styles.search} label="Поиск" trigger={<>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" />
      </svg><span>Поиск</span>
    </>}>
    <div className={styles.searchPanel}>
      <label>Поиск по разделам
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      {results.length ? <ul>{results.map(({ href, label }) =>
        <li key={href}><a href={href} onClick={event => {
          const panel = event.currentTarget.closest("details");
          if (panel) {
            panel.open = false;
            panel.querySelector("summary")?.focus();
          }
        }}>{label}</a></li>
      )}</ul> : <p role="status">Разделы не найдены.</p>}
    </div>
  </Dropdown>;
}
