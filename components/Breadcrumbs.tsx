import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
    <ol>{items.map((item, index) => <li key={`${index}-${item.label}`}>
      {index > 0 && <span aria-hidden="true">/</span>}
      {index < items.length - 1 && item.href
        ? <Link href={item.href}>{item.label}</Link>
        : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}
    </li>)}</ol>
  </nav>;
}
