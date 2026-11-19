import Link from "next/link";
import styles from "../site.module.scss";
import { specialists } from "../../lib/hero";
import SpecialistPhoto from "../../components/SpecialistPhoto";
import ActionLink from "../../components/ActionLink";
import ProfileIcon, { type ProfileIconName } from "../../components/icons/ProfileIcon";
import HelpIllustration from "../../components/HelpIllustration";
import TrainingIcon from "../../components/icons/TrainingIcon";
import Reviews from "../../components/reviews/Reviews";
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
  { title: "Семейное консультирование", href: "/contacts", description: "Встречи с семейным психологом по вопросам отношений и воспитания." },
];

const meetingSteps = [
  { title: "Договариваемся о времени", text: "Позвоните или напишите специалисту и коротко расскажите, что вас привело.", icon: <TrainingIcon name="calendar" /> },
  { title: "Знакомимся", text: "Расскажите, что вас беспокоит, и задайте свои вопросы. Если вы обращаетесь по поводу ребёнка, поделитесь наблюдениями о том, что ему даётся трудно.", icon: <ProfileIcon name="conversation" /> },
  { title: "Намечаем план", text: "Специалист предложит подходящий формат. Вместе вы обсудите цели и частоту следующих встреч.", icon: <ProfileIcon name="checklist" /> },
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

export default async function Home({ searchParams }: { searchParams: Promise<{ reviewPage?: string | string[] }> }) {
  const { reviewPage } = await searchParams;
  return <>
    <main className={`${styles.publicMain} ${styles.home}`}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>Психологический центр «Феникс»</p>
          <h1>Быть собой.<br />Чувствовать опору.</h1>
          <p>Психологическая помощь взрослым, детям и родителям в Тольятти и онлайн.</p>
          <ActionLink href="/contacts">Записаться на консультацию</ActionLink>
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
            <div><h3>Родителям</h3><p>Семейные консультации, на которых можно обсудить отношения с ребёнком и понять, как поддержать его дома.</p><Link href="/contacts">Связаться с семейным психологом</Link></div>
            <HelpIllustration scene="parents" className={styles.helpIllustration} />
          </li>
        </ul>
      </section>
      <section className={styles.storyBand} aria-labelledby="meeting-title">
        <div className={styles.content}>
          <h2 id="meeting-title">Как проходит первая встреча</h2>
          <ol className={styles.steps} role="list">
            {meetingSteps.map(({ title, text, icon }, index) => (
              <li key={title}>
                <span className={styles.stepIcon}>{icon}</span>
                <div>
                  <h3><span aria-hidden="true">{index + 1}. </span>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <svg className={styles.storyWave} viewBox="0 0 1120 56" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H1120V10C1082 10 1080 46 1014 51C950 56 920 38 850 36C773 33 725 55 639 54C536 53 498 31 425 33C353 35 324 50 251 46C173 42 132 16 78 18C41 19 23 28 0 27Z" />
        </svg>
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
      <Reviews className={styles.content} requestedPage={reviewPage} />
      <section className={styles.content}>
        <div className={styles.booking}>
          <div>
            <h2>Запись на первую встречу</h2>
            <p>Свяжитесь со специалистом, чтобы задать вопросы и выбрать время. Приём проходит очно в Тольятти. Индивидуальные консультации для взрослых доступны и онлайн.</p>
          </div>
          <ActionLink href="/contacts">Телефоны и мессенджеры</ActionLink>
        </div>
      </section>
    </main>
  </>;
}
