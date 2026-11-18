import AdvantageIcon, { type AdvantageIconName } from "../icons/AdvantageIcon";
import styles from "./AdvantagesSection.module.scss";

const advantages: { icon: AdvantageIconName; title: string; description: string }[] = [
  { icon: "education", title: "Медицинское образование и научная подготовка", description: "Профессиональный взгляд на психическое здоровье." },
  { icon: "calendar", title: "Более 20 лет практики", description: "Многолетний опыт работы с различными психологическими и психическими состояниями." },
  { icon: "layers", title: "Интегративный подход", description: "Индивидуальный подбор психотерапевтических методов и техник." },
  { icon: "lotus", title: "Современные методы психотерапии", description: "EMDR, ImTT, FLASH, IFS — эффективные и научно обоснованные подходы." },
  { icon: "shield", title: "Конфиденциальность и уважение", description: "Бережное и уважительное отношение к вашей истории, опыту и границам." },
  { icon: "laptop", title: "Очно и онлайн", description: "Консультации в Тольятти и дистанционно — в удобном и комфортном для вас формате." },
];

export default function AdvantagesSection() {
  return <section className={styles.section} aria-labelledby="advantages-title">
    <h2 id="advantages-title" className={styles.heading}>Мои преимущества</h2>
    <ul className={styles.grid}>
      {advantages.map(item => <li key={item.icon} className={styles.card}>
        <span className={styles.icon}><AdvantageIcon name={item.icon} /></span>
        <div className={styles.copy}><h3>{item.title}</h3><p>{item.description}</p></div>
      </li>)}
    </ul>
  </section>;
}
