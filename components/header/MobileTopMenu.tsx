"use client";

import WritePanel, { type WriteContacts } from "./WritePanel";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "../../lib/navigation";
import Dropdown from "./Dropdown";
import styles from "./Header.module.scss";
import MenuIcon from "../icons/MenuIcon";

export default function MobileTopMenu({ contacts }: { contacts: { adultPhone: string; childPhone: string; max: string; telegram: string; whatsapp: string; vk: string } & WriteContacts }) {
  const pathname = usePathname();
  return <nav className={styles.mobileTopMenu} aria-label="Специалисты">
    {navigation.slice(0, 2).map((group, index) => <Link className={styles.mobileSpecialistLink} key={group.label} href={index === 0 ? "/psyhoterapevt" : "/detskiy-psiholog"} aria-current={pathname === (index === 0 ? "/psyhoterapevt" : "/detskiy-psiholog") ? "page" : undefined}><MenuIcon name={index === 0 ? "therapist" : "child"} /><span>{group.label}</span></Link>)}
    <Dropdown className={styles.specialistDropdown} label="Позвонить" trigger={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-2 2a13 13 0 0 1-7-7l2-2-2-5Z" /></svg>}>
      <ul>{([{ key: "adultPhone", label: "Психотерапевт" }, { key: "childPhone", label: "Детский психолог" }] as const).map(({ key, label }) => <li key={key}>{contacts[key] ? <a href={`tel:${contacts[key].replace(/[^+\d]/g, "")}`}>{label}<br />{contacts[key]}</a> : <span className={styles.unavailablePhone}>{label}: телефон уточняется</span>}</li>)}</ul>
    </Dropdown>
    <Dropdown className={styles.specialistDropdown} label="Написать" trigger={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.8-3.6A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8 11.5h8" /></svg>}>
      <WritePanel contacts={contacts} />
    </Dropdown>
  </nav>;
}
