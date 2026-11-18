import type { TrainingDate } from "../../lib/trainings-data";
import TrainingIcon from "../icons/TrainingIcon";
import styles from "./trainings.module.scss";
const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
export function dateRange(date: TrainingDate) {
  return date.start === date.end ? dateFormat.format(new Date(date.start)) : `${dateFormat.format(new Date(date.start))} — ${dateFormat.format(new Date(date.end))}`;
}
export default function TrainingDates({ dates }: { dates: TrainingDate[] }) {
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Samara" }).format(new Date());
  return <div className={styles.dates}><h3><TrainingIcon name="calendar" />Даты</h3>
    {dates.length ? <ul>{dates.map((d, i) => <li key={i}><span>{dateRange(d)}</span>{d.note && <small>{d.note}</small>}{d.end < today && <small className={styles.past}>Завершено</small>}</li>)}</ul> : <p>Даты уточняются</p>}
  </div>;
}
