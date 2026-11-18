import Footer from "../components/footer/Footer";
import Link from "next/link";
import Header from "../components/header/Header";
import styles from "./site.module.scss";
import { specialists } from "../lib/hero";
import SpecialistPhoto from "../components/SpecialistPhoto";
import ActionLink from "../components/ActionLink";
import ProfileIcon, { type ProfileIconName } from "../components/icons/ProfileIcon";
import HelpIllustration from "../components/HelpIllustration";
import TrainingIcon from "../components/icons/TrainingIcon";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Психологическая помощь в Тольятти и онлайн",
  description: "Центр «Феникс». Индивидуальная и групповая психотерапия для взрослых, детская нейропсихология и семейные консультации.",
};

const formats = [
  { title: "Индивидуальная психотерапия", href: "/psyhoterapevt", description: "Личные встречи со специалистом очно или онлайн." },
  { title: "Групповая психотерапия", href: "/treningi#schedule", description: "Работа со своим запросом в группе. Ближайшие встречи есть в расписании." },
  { title: "Нейропсихологическая коррекция", href: "/detskiy-psiholog", description: "Индивидуальные занятия для дошкольников с трудностями развития." },
  { title: "Семейное консультирование", href: "/sections/contacts", description: "Встречи с семейным психологом по вопросам отношений и воспитания." },
];

const specialistCards = [
  {
    specialist: specialists.adult,
    qualifications: "Врач-психотерапевт, психиатр-нарколог, клинический психолог, кандидат медицинских наук",
    directions: [
      ["EMDR", "certificate"], ["Flash", "methods"], ["КПТ", "infinity"], ["ImTT", "infinity"], ["IFS (Level 2)", "levels"],
    ],
  },
  {
    specialist: specialists.child,
    qualifications: "Клинический психолог, нейропсихолог, семейный психолог",
    directions: [
      ["Семейная психология", "people"], ["Детская психология", "person"],
      ["Сенсомоторная интеграция", "sprout"], ["Коррекция нарушений развития", "adjustments"],
    ],
  },
] satisfies {
  specialist: (typeof specialists)[keyof typeof specialists];
  qualifications: string;
  directions: [string, ProfileIconName][];
}[];

export default function Home() {
  return <>
    <Header />
    <main className={`${styles.publicMain} ${styles.home}`}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>Психологический центр «Феникс»</p>
          <h1>Быть собой.<br />Чувствовать опору.</h1>
          <p>Психологическая помощь взрослым, детям и родителям в Тольятти и онлайн.</p>
          <ActionLink href="/sections/contacts">Записаться на консультацию</ActionLink>
          <a href="#specialists">Выбрать специалиста <span aria-hidden="true">↓</span></a>
          <small>Работаем с 2012 года · Конфиденциально</small>
        </div>
        <div className={styles.heroPhotos}>
          {Object.entries(specialists).map(([role, specialist]) => <Link key={role} href={specialist.href} className={styles.heroPortrait}>
            <SpecialistPhoto role={role as "adult" | "child"} alt="" />
            <span><small>{specialist.audience}</small><strong>{specialist.displayName}</strong></span>
          </Link>)}
        </div>
      </header>
      <section id="specialists" className={`${styles.content} ${styles.specialists}`} aria-labelledby="specialists-title">
        <h2 id="specialists-title">Специалисты центра</h2>
        <div className={styles.specialistCards}>
          {specialistCards.map(({ specialist: { fullName, href }, qualifications, directions }) => (
            <Link className={styles.specialistCard} key={href} href={href} aria-label={fullName}>
              <div className={styles.specialistCardHeading}>
                <h3>{fullName}</h3>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{qualifications}</p>
              <ul className={styles.specialistDirections}>
                {directions.map(([label, icon]) => (
                  <li key={label}><ProfileIcon name={icon} />{label}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>
      <section id="directions" className={styles.content}>
        <h2>Кому мы помогаем</h2>
        <ul className={`${styles.cards} ${styles.helpCards}`}>
          <li id="adults">
            <div><h3>Взрослым</h3><p>С тревогой и паническими атаками, переживанием утраты, семейными конфликтами и трудностями на работе.</p><Link href="/psyhoterapevt#concerns">С чем работает психотерапевт</Link></div>
            <HelpIllustration scene="adults" className={styles.helpIllustration} />
          </li>
          <li id="children">
            <div><h3>Детям</h3><p>Нейропсихологическая помощь при трудностях развития. Одно из основных направлений — занятия по сенсомоторной интеграции для детей 3–7 лет.</p><Link href="/detskiy-psiholog">О детском приёме</Link></div>
            <HelpIllustration scene="children" className={styles.helpIllustration} />
          </li>
          <li id="parents">
            <div><h3>Родителям</h3><p>Семейные консультации, на которых можно обсудить отношения с ребёнком и понять, как поддержать его дома.</p><Link href="/sections/contacts">Связаться с семейным психологом</Link></div>
            <HelpIllustration scene="parents" className={styles.helpIllustration} />
          </li>
        </ul>
      </section>
      <section className={styles.storyBand}>
        <div className={styles.content}>
          <h2>Как проходит первая встреча</h2>
          <ol className={styles.steps}>
            <li><span className={styles.stepIcon}><TrainingIcon name="calendar" /></span><div><h3>Договариваемся о времени</h3><p>Позвоните или напишите специалисту и коротко расскажите, что вас привело.</p></div></li>
            <li><span className={styles.stepIcon}><ProfileIcon name="people" /></span><div><h3>Знакомимся и обсуждаем запрос</h3><p>Расскажите, что вас беспокоит, и задайте свои вопросы. Если вы обращаетесь по поводу ребёнка, поделитесь наблюдениями о том, что ему даётся трудно.</p></div></li>
            <li><span className={styles.stepIcon}><TrainingIcon name="target" /></span><div><h3>Намечаем дальнейшую работу</h3><p>Специалист предложит подходящий формат. Вместе вы обсудите цели и частоту следующих встреч.</p></div></li>
          </ol>
        </div>
      </section>
      <section className={styles.content}>
        <h2>Форматы работы</h2>
        <ul className={`${styles.cards} ${styles.formats}`}>
          {formats.map(({ title, href, description }) => (
            <li key={title}>
              <Link href={href}><h3>{title}</h3><span aria-hidden="true">↗</span></Link>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.content}>
        <div className={styles.booking}>
          <div>
            <h2>Запись на первую встречу</h2>
            <p>Свяжитесь со специалистом, чтобы задать вопросы и выбрать время. Приём проходит очно в Тольятти. Индивидуальные консультации для взрослых доступны и онлайн.</p>
          </div>
          <ActionLink href="/sections/contacts">Телефоны и мессенджеры</ActionLink>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
