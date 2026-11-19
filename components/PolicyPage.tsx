import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import styles from "./PolicyPage.module.scss";

export default function PolicyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className={styles.page}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: title }]} />
    <h1>{title}</h1><p className={styles.date}>Редакция от 13 ноября 2026 года</p>
    {children}
    <section><h2>Обращения по вопросам персональных данных</h2><p>Для уточнения порядка обработки данных, реализации своих прав или отзыва согласия свяжитесь с центром через <Link href="/contacts">раздел «Контакты»</Link>. Укажите суть обращения и способ обратной связи. Не направляйте медицинские документы и сведения о здоровье через общедоступные каналы связи.</p></section>
  </main>;
}
