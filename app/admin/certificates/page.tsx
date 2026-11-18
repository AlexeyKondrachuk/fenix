import { redirect } from "next/navigation";
import { authorized } from "../../../lib/admin-auth";
import { getCertificates } from "../../../lib/certificates";
import CertificatesEditor from "./CertificatesEditor";
import styles from "../../site.module.scss";
export const dynamic = "force-dynamic";
export default async function CertificatesAdmin() {
  if (!await authorized()) redirect("/admin");
  return <main className={styles.content}><h1>Дипломы и сертификаты</h1><CertificatesEditor initial={await getCertificates()} /></main>;
}
