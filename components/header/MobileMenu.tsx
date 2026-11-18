"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import HomeIcon from "./HomeIcon";
import MenuIcon from "../icons/MenuIcon";
import styles from "./Header.module.scss";

export default function MobileMenu() {
  const pathname = usePathname();
  return <nav className={styles.mobileMenu} aria-label="Мобильное меню">
    <Link href="/" aria-current={pathname === "/" ? "page" : undefined} aria-label="Главная"><HomeIcon /></Link>
    <Link href="/treningi" aria-current={pathname === "/treningi" ? "page" : undefined}><MenuIcon name="training" />Тренинги</Link>
    <Link href="/sections/meditations" aria-current={pathname === "/sections/meditations" ? "page" : undefined}><MenuIcon name="meditation" />Медитации</Link>
    <Link href="/sections/tests" aria-current={pathname === "/sections/tests" ? "page" : undefined}><MenuIcon name="tests" />Тесты</Link>
    <Link href="/articles" aria-current={pathname === "/articles" ? "page" : pathname.startsWith("/articles/") ? "location" : undefined}><MenuIcon name="articles" />Статьи</Link>
  </nav>;
}
