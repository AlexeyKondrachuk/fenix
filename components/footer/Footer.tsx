import Link from "next/link";
import { getContacts } from "../../lib/site";
import styles from "./Footer.module.scss";
import MenuIcon from "../icons/MenuIcon";
import PhoneIcon from "../icons/PhoneIcon";

function SocialLinks({ telegram, vk }: { telegram: string; vk: string }) {
  return <div className={styles.socials}>
    {telegram && <a href={telegram} aria-label="Telegram"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m21 3-4 18-6-5-3 3 1-6 9-7-11 6-5-2Z" /></svg></a>}
    {vk && <a href={vk} aria-label="ВКонтакте"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6c1 8 5 12 10 12V6m0 8c3 0 5-4 8-8m-8 7c4 0 6 3 8 5" /></svg></a>}
  </div>;
}

export default async function Footer() {
  const contacts = await getContacts();
  const specialists = [
    { name: "Волков Виталий Владимирович", role: "Врач-психотерапевт, директор", phone: contacts.adultPhone, href: "/sections/individual-therapy" },
    { name: "Волкова Алла Владимировна", role: "Детский нейропсихолог", phone: contacts.childPhone, href: "/detskiy-psiholog" },
  ];
  return <footer className={styles.footer}>
    <div className={styles.columns}>
      <nav aria-labelledby="footer-navigation"><h2 id="footer-navigation">Навигация</h2><ul>
        <li><Link href="/psyhoterapevt"><MenuIcon name="therapist" />Психотерапевт</Link></li>
        <li><Link href="/detskiy-psiholog"><MenuIcon name="child" />Детский психолог</Link></li>
        <li><Link href="/treningi"><MenuIcon name="training" />Тренинги</Link></li>
        <li><Link href="/sections/meditations"><MenuIcon name="meditation" />Медитации</Link></li>
        <li><Link href="/sections/tests"><MenuIcon name="tests" />Тесты</Link></li>
        <li><Link href="/articles"><MenuIcon name="articles" />Статьи</Link></li>
      </ul></nav>
      <nav aria-labelledby="footer-information"><h2 id="footer-information">Полезная информация</h2><ul>
        <li><Link href="/">О центре</Link></li>
        <li><Link href="/contacts">Контакты</Link></li>
        <li><Link href="/privacy-policy">Политика конфиденциальности</Link></li>
        <li><Link href="/personal-data-policy">Политика обработки персональных данных</Link></li>
      </ul></nav>
      <section className={styles.specialists} aria-labelledby="footer-specialists"><h2 id="footer-specialists">Наши специалисты</h2>
        {specialists.map(person => <div className={styles.person} key={person.href}>
          <h3><Link href={person.href}>{person.name}</Link></h3><p>{person.role}</p>
          <div className={styles.contactRow}>{person.phone ? <a className={styles.phone} href={`tel:${person.phone.replace(/[^+\d]/g, "")}`}><span className={styles.phoneIcon}><PhoneIcon /></span>{person.phone}</a> : <span>Телефон уточняется</span>}<SocialLinks telegram={contacts.telegram} vk={contacts.vk} /></div>
        </div>)}
      </section>
    </div>
    <div className={styles.legal}><span>{new Date().getFullYear()} © ООО «Медицинский центр „Феникс“»</span><span>Медицинская лицензия ЛО-63-01-002460</span><span>ИНН: 6324025856</span><span>ОГРН: 1126324001033</span></div>
  </footer>;
}
