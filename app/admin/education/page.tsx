import { redirect } from "next/navigation";
import { authorized } from "../../../lib/admin-auth";
import { getEducation } from "../../../lib/education";
import EducationEditor from "./EducationEditor";
import styles from "../../site.module.scss";

export const dynamic = "force-dynamic";
export default async function EducationAdmin() {
  if (!await authorized()) redirect("/admin");
  return <main className={styles.content}><h1>Образование и экспертность</h1><EducationEditor initial={await getEducation()} /></main>;
}
