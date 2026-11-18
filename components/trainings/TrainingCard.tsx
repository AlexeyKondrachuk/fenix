import Link from "next/link";
import type { Training } from "../../lib/trainings-data";
import TrainingIcon from "../icons/TrainingIcon";
import TrainingDates from "./TrainingDates";
import TrainingFacts from "./TrainingFacts";
import styles from "./trainings.module.scss";
export default function TrainingCard({ training }: { training: Training }) {
  return <article className={styles.card}>
    <Link className={styles.cardLink} href={`/treningi/${training.slug}`}>
      <header className={styles.cardHeader}><TrainingIcon name={training.icon} /><div><h3>{training.title}</h3>{training.badge && <span className={styles.badge}>{training.badge}</span>}</div><TrainingIcon name="arrow" /></header>
      {training.photos[0] && <img className={styles.cardPhoto} src={`/api/training-images/${training.photos[0]}`} alt={training.title} loading="lazy" />}
      <div className={styles.cardBody}><p>{training.summary}</p><div className={styles.cardInfo}><TrainingFacts training={training} /><TrainingDates dates={training.dates} /></div><span className={styles.more}>Подробнее о тренинге <span aria-hidden="true">↗</span></span></div>
    </Link>
  </article>;
}
