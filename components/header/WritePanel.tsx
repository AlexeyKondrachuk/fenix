"use client";

import { useState } from "react";
import MenuIcon from "../icons/MenuIcon";
import SocialIcon from "../icons/SocialIcon";
import styles from "./Header.module.scss";

export type WriteContacts = { adultTelegram?: string; adultVk?: string; childTelegram?: string; childVk?: string; adultMax?: string; adultWhatsapp?: string; adultEmail?: string; childMax?: string; childWhatsapp?: string; childEmail?: string };

export default function WritePanel({ contacts }: { contacts: WriteContacts }) {
  const [selected, setSelected] = useState<"adult" | "child" | null>(null);
  const links = selected === "adult" ? { telegram: contacts.adultTelegram, vk: contacts.adultVk, max: contacts.adultMax, whatsapp: contacts.adultWhatsapp, email: contacts.adultEmail } : { telegram: contacts.childTelegram, vk: contacts.childVk, max: contacts.childMax, whatsapp: contacts.childWhatsapp, email: contacts.childEmail };
  const channels = ["telegram", "vk", "max", "whatsapp", "email"] as const;
  const labels = { telegram: "Telegram", vk: "VK", max: "MAX", whatsapp: "WhatsApp", email: "Email" };
  return <div className={styles.writePanel}>
    <p>Кому вы хотите написать?</p>
    <div className={styles.specialistChoices}>{(["adult", "child"] as const).map(key => <button type="button" key={key} aria-pressed={selected === key} onClick={() => setSelected(key)}><MenuIcon name={key === "adult" ? "therapist" : "child"} />{key === "adult" ? "Психотерапевт" : "Детский психолог"}</button>)}</div>
    {selected && <div className={styles.writeNetworks} aria-live="polite">{!Object.values(links).some(Boolean) ? <p>Контакты этого специалиста скоро появятся.</p> : channels.map(key => links[key] && <a key={key} href={key === "email" ? `mailto:${links[key]}` : links[key]} aria-label={`${labels[key]}: ${selected === "adult" ? "психотерапевт" : "детский психолог"}`}>
      {key === "telegram" || key === "vk" ? <SocialIcon name={key} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{key === "email" ? <><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" /></> : <><path d="M21 11a9 9 0 0 1-9 9H3l2-4a9 9 0 1 1 16-5Z" /><path d="M8 11h8" /></>}</svg>}<span>{labels[key]}</span></a>)}</div>}
  </div>;
}
