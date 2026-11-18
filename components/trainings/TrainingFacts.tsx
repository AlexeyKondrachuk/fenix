import TrainingIcon from "../icons/TrainingIcon";
import type { TrainingData } from "../../lib/trainings-data";
import styles from "./trainings.module.scss";
export default function TrainingFacts({ training }: { training: TrainingData }) {
  const facts = [
    { icon: "duration" as const, label: "Продолжительность", text: training.duration },
    { icon: "clock" as const, label: "Время", text: training.time },
    { icon: "price" as const, label: "Стоимость", text: training.price },
    ...(training.requirements ? [{ icon: "people" as const, label: "Условия участия", text: training.requirements }] : []),
  ];
  return <dl className={styles.facts}>{facts.map(f => <div key={f.icon}><TrainingIcon name={f.icon} /><div><dt>{f.label}</dt><dd>{f.text}</dd></div></div>)}</dl>;
}
