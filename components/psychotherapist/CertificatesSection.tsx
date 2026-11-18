import { getCertificates } from "../../lib/certificates";
import CertificateGallery from "./CertificateGallery";
import styles from "./CertificateGallery.module.scss";
export default async function CertificatesSection() {
  const content = await getCertificates();
  if (!content.items.length) return null;
  return <section id="qualifications" className={styles.section} aria-labelledby="certificates-title">
    <h2 id="certificates-title" className={styles.heading}>{content.title}</h2>
    <CertificateGallery items={content.items} />
  </section>;
}
