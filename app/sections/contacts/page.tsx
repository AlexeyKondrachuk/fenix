import type { Metadata } from "next";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Breadcrumbs from "../../../components/Breadcrumbs";
import YandexMap from "../../../components/YandexMap/YandexMap";
import MenuIcon from "../../../components/icons/MenuIcon";
import PhoneIcon from "../../../components/icons/PhoneIcon";
import { getContacts, messengers, specialistContacts } from "../../../lib/site";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Контакты — Феникс", description: "Контакты центра «Феникс» в Тольятти. Запись к психотерапевту, детскому и семейному психологу." };

export default async function ContactsPage() {
  const contacts = await getContacts();
  const people = [
    { name: "Волков Виталий Владимирович", role: "Врач-психотерапевт", caption: "Помощь взрослым", icon: "therapist" as const, phone: contacts.adultPhone },
    { name: "Волкова Алла Владимировна", role: "Детский и семейный психолог", caption: "Помощь детям и родителям", icon: "child" as const, phone: contacts.childPhone },
  ];
  return <><Header /><main className={styles.main}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
    <header className={styles.intro}><p className={styles.eyebrow}>Центр «Феникс»</p><h1>Будем на связи</h1><p>Позвоните или напишите специалисту, чтобы задать вопрос и договориться о первой встрече.</p></header>
    <section aria-labelledby="specialists-title"><h2 id="specialists-title" className={styles.sectionTitle}>Запись к специалистам</h2>
      <div className={styles.cards}>{people.map((person, index) => <article className={styles.card} key={person.name}>
        <span className={styles.icon}><MenuIcon name={person.icon} /></span><p className={styles.caption}>{person.caption}</p>
        <h3>{person.name}</h3><p className={styles.role}>{person.role}</p>
        {person.phone && <a className={styles.phone} href={`tel:${person.phone.replace(/[^+\d]/g, "")}`}><PhoneIcon />{person.phone}</a>}
        <div className={styles.channels}>{specialistContacts[index].fields.map(({ key, label, type }) => contacts[key] && <a key={key} href={type === "email" ? `mailto:${contacts[key]}` : contacts[key]}>{label}<span aria-hidden="true">↗</span></a>)}</div>
        {!person.phone && !specialistContacts[index].fields.some(({ key }) => contacts[key]) && <p className={styles.note}>Контакты специалиста скоро появятся.</p>}
      </article>)}</div>
    </section>
    {messengers.some(({ key }) => contacts[key]) && <section className={styles.community} aria-labelledby="community-title"><div><h2 id="community-title">Центр в соцсетях и мессенджерах</h2><p>Выберите удобный способ связи.</p></div><div className={styles.channels}>{messengers.map(({ key, label }) => contacts[key] && <a key={key} href={contacts[key]}>{label}<span aria-hidden="true">↗</span></a>)}</div></section>}
    <section className={styles.location} aria-labelledby="location-title"><div className={styles.locationInfo}><p className={styles.eyebrow}>Личная встреча</p><h2 id="location-title">Как нас найти</h2>
      {contacts.address ? <><address>{contacts.address}</address><p className={styles.note}>Перед визитом договоритесь со специалистом о дате и времени встречи.</p><a className={styles.route} href={`https://yandex.ru/maps/?text=${encodeURIComponent(contacts.address)}`} target="_blank" rel="noopener noreferrer">Открыть в Яндекс Картах ↗</a></> : <p>Уточните адрес при записи к специалисту.</p>}
      </div>{contacts.address && <YandexMap center={contacts.address} hintContent="Центр «Феникс»" />}</section>
  </main><Footer /></>;
}
