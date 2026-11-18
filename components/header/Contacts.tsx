import WritePanel from "./WritePanel";
import { getContacts, messengers, phones } from "../../lib/site";
import ReadingMode from "./ReadingMode";
import MenuIcon from "../icons/MenuIcon";
import PhoneIcon from "../icons/PhoneIcon";
import Dropdown from "./Dropdown";
import SectionSearch from "./SectionSearch";
import styles from "./Header.module.scss";

export default async function Contacts({ compact = false }: { compact?: boolean }) {
  const contacts = await getContacts();
  const activePhones = phones.filter(({ key }) => contacts[key]);
  const activeMessengers = messengers.filter(({ key }) => contacts[key]);
  
  const phoneList = <ul className={styles.phoneList}>
    {activePhones.map(({ key, label }) => <li key={key}>
      <a href={`tel:${contacts[key].replace(/[^+\d]/g, "")}`}>
        <PhoneIcon outlined width={17} height={17} />
        {contacts[key]}
      </a>
      <small className={styles.phoneLabel}>
        <MenuIcon name={key === "adultPhone" ? "therapist" : "child"} />
        {compact ? (key === "adultPhone" ? "Взрослым" : "Детям и родителям") : label}
      </small>
    </li>)}
  </ul>;

  return <div className={compact ? styles.contacts : `${styles.contacts} ${styles.fullContacts}`}>
    {activePhones.length > 0 && <div className={styles.desktopPhones}>{phoneList}</div>}
    <div className={styles.actions}>
      <Dropdown className={styles.messengers} label={"\u041d\u0430\u043f\u0438\u0441\u0430\u0442\u044c"} trigger={<><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.8-3.6A8.5 8.5 0 1 1 21 11.5Z" /></svg>{!compact && <span>{"\u041d\u0430\u043f\u0438\u0441\u0430\u0442\u044c"}</span>}</>}><WritePanel contacts={contacts} /></Dropdown>
      {!compact && <Dropdown className={styles.mobileCall} label="Позвонить" trigger={<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-2 2a13 13 0 0 1-7-7l2-2-2-5Z" /></svg>}>
        {!activePhones.length && <p className={styles.phoneList}>Телефоны специалистов скоро появятся.</p>}
        {phoneList}
      </Dropdown>}
      {!compact && <ReadingMode />}
      {!compact && <SectionSearch />}
    </div>
  </div>;
}
