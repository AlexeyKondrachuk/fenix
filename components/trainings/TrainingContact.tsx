import { getContacts } from "../../lib/site";
import ActionLink from "../ActionLink";
import TrainingIcon from "../icons/TrainingIcon";
import styles from "./trainings.module.scss";
export default async function TrainingContact() {
  const contacts = await getContacts();
  return <aside className={styles.contact} id="training-contact"><TrainingIcon name="people" /><div><h2>Хотите принять участие в тренинге?</h2><p>Свяжитесь с нами, чтобы уточнить детали и записаться.</p></div>
    {contacts.adultPhone ? <a className={styles.phone} href={`tel:${contacts.adultPhone.replace(/[^+\d]/g, "")}`}>{contacts.adultPhone}</a> : <ActionLink href="/contacts">Связаться с центром →</ActionLink>}
  </aside>;
}
