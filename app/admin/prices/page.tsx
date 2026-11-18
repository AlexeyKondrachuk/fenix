import { redirect } from "next/navigation";
import { authorized } from "../../../lib/admin-auth";
import { getPrices } from "../../../lib/prices";
import PricesEditor from "./PricesEditor";
import styles from "../../site.module.scss";

export const dynamic = "force-dynamic";
export default async function PricesAdmin() {
  if (!await authorized()) redirect("/admin");
  return <main className={styles.content}><h1>Стоимость услуг</h1><PricesEditor initial={await getPrices()} /></main>;
}
