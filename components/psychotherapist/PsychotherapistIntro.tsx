import Link from "next/link";
import { getContacts } from "../../lib/site";
import { getExperience } from "../../lib/experience";
import { specialists } from "../../lib/hero";
import SpecialistPhoto from "../SpecialistPhoto";
import ActionLink from "../ActionLink";
import ProfileIcon, { type ProfileIconName } from "../icons/ProfileIcon";
import SocialIcon from "../icons/SocialIcon";
import PhoneIcon from "../icons/PhoneIcon";
import FirstMeeting from "./FirstMeeting";
import styles from "./PsychotherapistIntro.module.scss";

const qualifications: { icon: ProfileIconName; text: string }[] = [
  { icon: "degree", text: "Кандидат медицинских наук" },
  { icon: "medicine", text: "Врач психиатр-психотерапевт, нарколог" },
  { icon: "psychology", text: "Клинический психолог" },
  { icon: "methods", text: "EMDR, ImTT, FLASH — терапевт, IFS практик (level 2)" },
];
const values: { icon: ProfileIconName; text: string }[] = [
  { icon: "shield", text: "Профессиональный подход" },
  { icon: "heart", text: "Безопасное пространство" },
  { icon: "sprout", text: "Забота о вашем благополучии" },
];

export default async function PsychotherapistIntro() {
  const contacts = await getContacts();
  const vk = contacts.adultVk || contacts.vk;
  const telegram = contacts.adultTelegram || contacts.telegram;
  return <section className={styles.intro} aria-labelledby="therapist-greeting">
    <aside className={styles.card} aria-label="О специалисте">
      <div className={styles.portrait}><SpecialistPhoto role="adult" alt={specialists.adult.fullName} /></div>
      <div className={styles.cardBody}>
      <h2>{specialists.adult.fullName}</h2><span className={styles.divider} aria-hidden="true" />
      <ul className={styles.qualifications}>{qualifications.map(item => <li key={item.icon}><ProfileIcon name={item.icon} /><span>{item.text}</span></li>)}</ul>
      {(contacts.adultPhone || contacts.adultEmail || vk || telegram) && <div className={styles.contacts}>
        <div className={styles.direct}>
          {contacts.adultPhone && <a className={styles.phone} href={`tel:${contacts.adultPhone.replace(/[^+\d]/g, "")}`}><PhoneIcon badge /><span>{contacts.adultPhone}</span></a>}
          {contacts.adultEmail && <a href={`mailto:${contacts.adultEmail}`}><ProfileIcon name="email" />{contacts.adultEmail}</a>}
        </div>
        {(vk || telegram) && <div className={styles.socials}>
          {vk && <a href={vk} aria-label={contacts.adultVk ? "ВКонтакте: Волков Виталий Владимирович" : "ВКонтакте центра «Феникс»"}><SocialIcon name="vk" /></a>}
          {telegram && <a href={telegram} aria-label={contacts.adultTelegram ? "Telegram: Волков Виталий Владимирович" : "Telegram центра «Феникс»"}><SocialIcon name="telegram" /></a>}
        </div>}
      </div>}
      </div>
    </aside>
    <div className={styles.copy}>
      <h1 id="therapist-greeting">Здравствуйте!</h1>
      <p>Меня зовут {specialists.adult.fullName}. Я врач-психотерапевт, психиатр-нарколог и клинический психолог, кандидат медицинских наук. Уже {getExperience()} я помогаю людям справляться с трудностями и улучшать качество жизни.</p>
      <p>В своей работе я придерживаюсь интегративного подхода: это значит, что я не ограничиваюсь одним методом, а подбираю техники и <a href="#methods">методы психотерапии</a> индивидуально под ваш личный запрос. Я глубоко убеждён: не существует одной «таблетки для всех». Каждый человек уникален, и моя задача — не лечить по шаблону, а помочь вам раскрыть ваш собственный путь к целостности и благополучию.</p>
      <p>На этом сайте вы найдёте информацию о направлениях моей работы, а также сможете записаться на <Link href="/sections/individual-therapy">индивидуальную</Link> или <Link href="/sections/group-therapy">групповую</Link> психотерапию.</p>
      <div className={styles.actions}><ActionLink href="#qualifications"><ProfileIcon name="certificate" />Мои дипломы и сертификаты</ActionLink><ActionLink href="/contacts"><PhoneIcon outlined />Записаться на консультацию</ActionLink></div>
      <ul className={styles.values}>{values.map(item => <li key={item.icon}><ProfileIcon name={item.icon} /><span>{item.text}</span></li>)}</ul>
      <FirstMeeting />
    </div>
  </section>;
}
