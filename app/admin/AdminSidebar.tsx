"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { logout } from "./actions";
import styles from "./admin.module.scss";

export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const articles = pathname.startsWith("/admin/articles");
  const hero = pathname === "/admin/hero";
  const education = pathname === "/admin/education";
  const concerns = pathname === "/admin/concerns";
  const prices = pathname === "/admin/prices";
  const certificates = pathname === "/admin/certificates";
  const trainings = pathname === "/admin/trainings";
  const contacts = pathname === "/admin" && params.get("section") === "contacts";
  return <aside className={styles.sidebar}>
    <Link href="/admin" className={styles.brand}>ФЕНИКС<span>Управление сайтом</span></Link>
    <nav aria-label="Разделы админки">
      <Link href="/admin" aria-current={!articles && !contacts && !hero && !education && !concerns && !prices && !certificates && !trainings ? "page" : undefined}>Обзор</Link>
      <Link href="/admin/hero" aria-current={hero ? "page" : undefined}>Фото на главной</Link>
      <Link href="/admin/education" aria-current={education ? "page" : undefined}>Образование</Link>
      <Link href="/admin/concerns" aria-current={concerns ? "page" : undefined}>С чем я работаю</Link>
      <Link href="/admin/prices" aria-current={prices ? "page" : undefined}>Цены</Link>
      <Link href="/admin/certificates" aria-current={certificates ? "page" : undefined}>Дипломы и сертификаты</Link>
      <Link href="/admin/trainings" aria-current={trainings ? "page" : undefined}>Тренинги</Link>
      <Link href="/admin?section=contacts" aria-current={contacts ? "page" : undefined}>Контакты</Link>
      <Link href="/admin/articles" aria-current={articles ? "page" : undefined}>Статьи</Link>
    </nav>
    <div className={styles.bottom}><Link href="/">Открыть сайт ↗</Link><form action={logout}><button type="submit">Выйти из админки</button></form></div>
  </aside>;
}
