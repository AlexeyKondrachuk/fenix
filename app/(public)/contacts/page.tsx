import type { Metadata } from "next";
import Breadcrumbs from "../../../components/Breadcrumbs";
import YandexMap from "../../../components/YandexMap/YandexMap";
import MenuIcon from "../../../components/icons/MenuIcon";
import PhoneIcon from "../../../components/icons/PhoneIcon";
import SocialIcon from "../../../components/icons/SocialIcon";
import { getContacts, messengers, specialistContacts } from "../../../lib/site";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Контакты — Феникс",
  description:
    "Контакты центра «Феникс» в Тольятти. Запись к психотерапевту, детскому и семейному психологу.",
};

export default async function ContactsPage() {
  const contacts = await getContacts();
  const people = [
    {
      name: "Волков Виталий Владимирович",
      role: "Врач-психотерапевт",
      caption: "Помощь взрослым",
      icon: "therapist" as const,
      phone: contacts.adultPhone,
    },
    {
      name: "Волкова Алла Владимировна",
      role: "Детский и семейный психолог",
      caption: "Помощь детям и родителям",
      icon: "child" as const,
      phone: contacts.childPhone,
    },
  ];
  return (
    <>
      <main className={styles.main}>
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]}
        />
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Центр «Феникс»</p>
          <h1>Будем на связи</h1>
          <p>
            Позвоните или напишите специалисту, чтобы задать вопрос и
            договориться о первой встрече.
          </p>
        </header>
        <section aria-labelledby="specialists-title">
          <h2 id="specialists-title" className={styles.sectionTitle}>
            Запись к специалистам
          </h2>
          <div className={styles.cards}>
            {people.map((person, index) => (
              <article className={styles.card} key={person.name}>
                <span className={styles.icon}>
                  <MenuIcon name={person.icon} />
                </span>
                <p className={styles.caption}>{person.caption}</p>
                <h3>{person.name}</h3>
                <p className={styles.role}>{person.role}</p>
                <div className={styles.contactRow}>
                  {person.phone && (
                    <a
                      className={styles.phone}
                      href={`tel:${person.phone.replace(/[^+\d]/g, "")}`}
                    >
                      <PhoneIcon badge />
                      {person.phone}
                    </a>
                  )}
                  <div className={styles.channels}>
                    {specialistContacts[index].fields.map(
                      ({ key, label, type }) => {
                        const channel = messengers.find(
                          (messenger) => messenger.label === label,
                        )?.key;
                        if (channel === "max" || channel === "whatsapp") return null;
                        const contact =
                          contacts[key] || (channel ? contacts[channel] : "");
                        if (!contact) return null;
                        return (
                          <a
                            key={key}
                            href={
                              type === "email" ? `mailto:${contact}` : contact
                            }
                            aria-label={label}
                          >
                            {channel === "vk" || channel === "telegram" ? (
                              <SocialIcon name={channel} />
                            ) : (
                              label
                            )}
                          </a>
                        );
                      },
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.location} aria-labelledby="location-title">
          <div className={styles.locationInfo}>
            <p className={styles.eyebrow}>Личная встреча</p>
            <h2 id="location-title">Как нас найти</h2>
            {contacts.address ? (
              <>
                <address>{contacts.address}</address>
                <p className={styles.note}>
                  Перед визитом договоритесь со специалистом о дате и времени
                  встречи.
                </p>
                <a
                  className={styles.route}
                  href={`https://yandex.ru/maps/?text=${encodeURIComponent(contacts.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Открыть в Яндекс Картах ↗
                </a>
              </>
            ) : (
              <p>Уточните адрес при записи к специалисту.</p>
            )}
          </div>
          {contacts.address && (
            <YandexMap center={contacts.address} hintContent="Центр «Феникс»" />
          )}
        </section>
      </main>
    </>
  );
}
