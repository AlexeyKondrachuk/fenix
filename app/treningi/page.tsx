import type { Metadata } from "next";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import ActionLink from "../../components/ActionLink";
import TrainingIcon from "../../components/icons/TrainingIcon";
import TrainingCard from "../../components/trainings/TrainingCard";
import TrainingContact from "../../components/trainings/TrainingContact";
import { getTrainings } from "../../lib/trainings";
import styles from "../../components/trainings/trainings.module.scss";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Психологические тренинги — Феникс", description: "Расписание психотерапевтических групп и тренингов центра «Феникс». Программы, даты, стоимость и условия участия." };
const benefits = [
  { icon: "people" as const, text: "Групповая психотерапия" }, { icon: "lotus" as const, text: "Глубокая личностная работа" },
  { icon: "shield" as const, text: "Поддержка и безопасная среда" }, { icon: "leaf" as const, text: "Осознанность, ресурсы и изменения" },
];
export default async function TrainingsPage() {
  const trainings = await getTrainings();
  const years = [...new Set(trainings.flatMap(t => t.dates.flatMap(d => [d.start.slice(0, 4), d.end.slice(0, 4)])))].sort();
  const period = years.length ? years[0] === years[years.length - 1] ? ` на ${years[0]} год` : ` на ${years[0]}–${years[years.length - 1]} гг.` : "";
  return <><Header /><main className={styles.main}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Психологические тренинги" }]} />
    <section className={styles.hero}><div className={styles.heroCopy}><span className={styles.eyebrow}>В пространстве «Феникса»</span><h1>Психологические<br />тренинги</h1><p>Профессиональная групповая работа в безопасной и поддерживающей атмосфере</p><ActionLink href="#schedule">Посмотреть расписание <span aria-hidden="true">→</span></ActionLink></div><div className={styles.room}><img src="/trainings/training-room.webp" alt="Светлая комната с креслами для групповых тренингов" width={554} height={284} fetchPriority="high" /></div></section>
    <ul className={styles.benefits}>{benefits.map(b => <li key={b.icon}><TrainingIcon name={b.icon} /><span>{b.text}</span></li>)}</ul>
    <section id="schedule" className={styles.schedule} aria-labelledby="schedule-title"><h2 id="schedule-title" className={styles.sectionTitle}>Расписание психотерапевтических групп{period}</h2>
      {trainings.length ? <div className={styles.grid}>{trainings.map(t => <TrainingCard key={t.id} training={t} />)}</div> : <p className={styles.empty}>Расписание готовится. Свяжитесь с центром, чтобы узнать о ближайших группах.</p>}
    </section>
    <aside className={styles.notice}><TrainingIcon name="info" /><p><strong>Важно знать:</strong> для участия в некоторых группах требуется определённый опыт: прохождение интенсива или работа в психотерапии и дыхательных техниках. Перед записью рекомендуем уточнить детали у специалистов.</p></aside>
    <TrainingContact />
  </main><Footer /></>;
}
