import type { Metadata } from "next";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SpecialistPhoto from "../../../components/SpecialistPhoto";
import ProfileIcon from "../../../components/icons/ProfileIcon";
import PhoneIcon from "../../../components/icons/PhoneIcon";
import SocialIcon from "../../../components/icons/SocialIcon";
import ActionLink from "../../../components/ActionLink";
import EducationPanel from "../../../components/education/EducationPanel";
import ChildPsychologyDetails from "../../../components/child-psychologist/ChildPsychologyDetails";
import Reviews from "../../../components/reviews/Reviews";
import { getContacts } from "../../../lib/site";
import { childEducation } from "../../../lib/child-education";
import layout from "../psyhoterapevt/page.module.scss";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Детский психолог Волкова Алла Владимировна — Феникс",
  description: "Детский клинический психолог, нейропсихолог Алла Владимировна Волкова. Сенсомоторная интеграция и нейрокоррекция для детей от 3 до 7 лет в центре «Феникс».",
};

const fullName = "Волкова Алла Владимировна";
const qualifications = [
  { icon: "psychology", text: "Детский клинический психолог" },
  { icon: "degree", text: "Нейропсихолог" },
  { icon: "sprout", text: "Специалист в области детского развития и сенсомоторной интеграции" },
] as const;

export default async function ChildPsychologistPage({ searchParams }: { searchParams: Promise<{ reviewPage?: string | string[] }> }) {
  const { reviewPage } = await searchParams;
  const contacts = await getContacts();
  const phone = contacts.childPhone || "+7 (927) 891-16-66";
  const email = contacts.childEmail || "psy63@mail.ru";
  const vk = contacts.childVk || contacts.vk;
  const telegram = contacts.childTelegram || contacts.telegram;

  return <main className={layout.main}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Детский психолог" }]} />
    <section className={styles.intro} aria-labelledby="child-greeting">
      <aside className={styles.card} aria-label="О специалисте">
        <div className={styles.portrait}><SpecialistPhoto role="child" alt={fullName} /></div>
        <div className={styles.cardBody}>
          <h2>{fullName}</h2><span className={styles.divider} aria-hidden="true" />
          <ul className={styles.qualifications}>{qualifications.map(item => <li key={item.icon}><ProfileIcon name={item.icon} /><span>{item.text}</span></li>)}</ul>
          <div className={styles.contacts}>
            <div className={styles.direct}>
              <a className={styles.phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`}><PhoneIcon badge /><span>{phone}</span></a>
              <a href={`mailto:${email}`}><ProfileIcon name="email" />{email}</a>
            </div>
            {(vk || telegram) && <div className={styles.socials}>
              {vk && <a href={vk} aria-label="ВКонтакте"><SocialIcon name="vk" /></a>}
              {telegram && <a href={telegram} aria-label="Telegram"><SocialIcon name="telegram" /></a>}
            </div>}
          </div>
        </div>
      </aside>
      <div className={styles.copy}>
        <h1 id="child-greeting">Детский психолог</h1>
        <p>Меня зовут Алла Владимировна, я детский психолог, специалист по сенсомоторной интеграции и нейрокоррекции.</p>
        <p>Я провожу индивидуальную коррекционную работу с детьми с особенностями развития (РАС, СДВГ, ЗПР, ЗПРР) в возрасте от 3 до 7 лет. Занятия проводятся совместно с мамой и ребенком.</p>
        <p>Консультирую по вопросам возрастной психологии и детско-родительских отношений, а также помогаю разобраться в связи тела и психики. Создаю комфортное пространство, где каждый ребенок может простроить целостную систему тела и раскрыть свой потенциал.</p>
        <p>Не работаю по запросам с трудностями обучения в школе и детьми старше 7 лет.</p>
        <div className={styles.actions}><ActionLink href="#child-education"><ProfileIcon name="certificate" />Профессиональная подготовка</ActionLink><ActionLink href={`tel:${phone.replace(/[^+\d]/g, "")}`}><PhoneIcon outlined />Записаться на консультацию</ActionLink></div>
        <EducationPanel id="child-education" className={styles.education} title="Профессиональная подготовка и деятельность" theme="peach" items={childEducation.map(([year, text]) => `${year} – ${text}`)} />
      </div>
    </section>
    <ChildPsychologyDetails phone={phone} />
    <Reviews specialist="child" requestedPage={reviewPage} />
  </main>;
}
