import { redirect } from "next/navigation";
import { authorized } from "../../../lib/admin-auth";
import { getConcerns } from "../../../lib/concerns";
import ConcernsEditor from "./ConcernsEditor";
import styles from "../../site.module.scss";

export const dynamic = "force-dynamic";
export default async function ConcernsAdmin() {
  if (!await authorized()) redirect("/admin");
  return <main className={styles.content}><h1>С чем я работаю</h1><ConcernsEditor initial={await getConcerns()} /></main>;
}
