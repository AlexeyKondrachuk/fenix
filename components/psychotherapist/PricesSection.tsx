import { getPrices } from "../../lib/prices";
import styles from "./PricesSection.module.scss";

export default async function PricesSection() {
  const content = await getPrices();
  return <section id="prices" className={styles.section} aria-labelledby="prices-title">
    <h2 id="prices-title" className={styles.heading}>{content.title}</h2>
    <dl className={styles.prices}>{content.services.map((service, index) => <div key={index} className={styles.row}>
      <dt><span>{service.name}</span>{service.note && <details className={styles.note}><summary aria-label={`Подробнее: ${service.name}`}>i</summary><p>{service.note}</p></details>}</dt>
      <dd><span>{service.price}</span></dd>
    </div>)}</dl>
  </section>;
}
