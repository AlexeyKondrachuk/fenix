import { getConcerns } from "../../lib/concerns";
import ConcernIcon from "../icons/ConcernIcon";
import styles from "./ConcernsSection.module.scss";

export default async function ConcernsSection() {
  const content = await getConcerns();
  return <section id="concerns" className={styles.section} aria-labelledby="concerns-title">
    <h2 id="concerns-title" className={styles.heading}>{content.title}</h2>
    <p className={styles.subtitle}>{content.subtitle}</p>
    <ul className={styles.grid}>{content.cards.map((card, index) => <li className={styles.card} key={index}>
      <div className={styles.art}><ConcernIcon name={card.icon} /></div>
      <div className={styles.copy}><h3>{card.title}</h3><ul>{card.items.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
    </li>)}</ul>
  </section>;
}
