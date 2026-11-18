"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { navigation, standalone } from "../../lib/navigation";
import { useClickOutside } from "../../hooks/useClockOutside";
import MenuIcon from "../icons/MenuIcon";
import HomeIcon from "./HomeIcon";
import styles from "./Header.module.scss";

const icons = { training: "training", meditations: "meditation", tests: "tests", articles: "articles" } as const;

export default function Menu() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  const [open, setOpen] = useState<string | null>(null);

  const activeGroup = useRef<HTMLLIElement>(null);
  useClickOutside(activeGroup, () => setOpen(null));

  return (
    <nav
      className={styles.menu}
      aria-label="Основное меню"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        event.currentTarget
          .querySelector<HTMLButtonElement>('[aria-expanded="true"]')
          ?.focus();
        setOpen(null);
      }}
    >
      <ul className={styles.menuList}>
        <li>
          <Link
            className={styles.home}
            aria-current={pathname === "/" ? "page" : undefined}
            href="/"
            aria-label="Главная"
            onClick={() => setOpen(null)}
          >
            <HomeIcon />
          </Link>
        </li>
        {navigation.slice(0, 2).map(({ label, items }, index) => (
          <li
            key={label}
            className={styles.menuGroup}
            data-active={pathname === (index === 0 ? "/psyhoterapevt" : "/detskiy-psiholog") || items.some(item => isActive("href" in item ? item.href : `/sections/${item.slug}`)) || undefined}
            ref={open === label ? activeGroup : null}
            onMouseEnter={() => setOpen(label)}
            onMouseLeave={event => {
              if (!event.currentTarget.contains(document.activeElement)) {
                setOpen(current => current === label ? null : current);
              }
            }}
          >
            <Link href={index === 0 ? "/psyhoterapevt" : "/detskiy-psiholog"} className={styles.specialistLink} aria-current={pathname === (index === 0 ? "/psyhoterapevt" : "/detskiy-psiholog") ? "page" : undefined} onClick={() => setOpen(null)}><MenuIcon name={index === 0 ? "therapist" : "child"} />{label}</Link>
            <button
              type="button"
              aria-label={index === 0 ? "Направления психотерапии" : "Направления детской психологии"}
              aria-expanded={open === label}
              aria-controls={`menu-group-${index}`}
              onClick={event => {
                const mouseHover = event.detail > 0 && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
                setOpen(current => current === label && !mouseHover ? null : label);
              }}
            >
              <span className={styles.chevron} aria-hidden="true" />
            </button>
            <ul
              id={`menu-group-${index}`}
              className={styles.dropdown}
              hidden={open !== label}
            >
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    aria-current={isActive("href" in item ? item.href : `/sections/${item.slug}`) ? "page" : undefined}
                    href={"href" in item ? item.href : `/sections/${item.slug}`}
                    onClick={() => setOpen(null)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
        {standalone.map(({ label, slug }) => slug !== "contacts" && (
          <li key={slug}>
            <Link aria-current={isActive(slug === "articles" ? "/articles" : slug === "training" ? "/treningi" : `/sections/${slug}`) ? (pathname === "/articles" || slug !== "articles" ? "page" : "location") : undefined} href={slug === "articles" ? "/articles" : slug === "training" ? "/treningi" : `/sections/${slug}`} onClick={() => setOpen(null)}>
              <MenuIcon name={icons[slug]} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
