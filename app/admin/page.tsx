import { revalidatePath } from "next/cache";
import { db } from "../../lib/db";
import { getContacts, messengers, phones, specialistContacts } from "../../lib/site";
import type { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authorized, matches, sessionToken } from "../../lib/admin-auth";

import styles from "../site.module.scss";
import BackupDownload from "./BackupDownload";

export const metadata: Metadata = { title: "Админка", robots: { index: false, follow: false } };

async function login(data: FormData) {
  "use server";
  const token = sessionToken();
  if (!token || !matches(String(data.get("password") ?? ""), process.env.ADMIN_PASSWORD ?? "")) {
    redirect("/admin?error=login");
  }
  const cookieStore = await cookies();
  cookieStore.set("fenix_admin", "", { path: "/admin", maxAge: 0 });
  cookieStore.set("fenix_admin", token, {
    path: "/", httpOnly: true, sameSite: "strict",
    secure: process.env.SITE_URL?.startsWith("https://") ?? false,
  });
  redirect("/admin");
}

async function saveContacts(data: FormData) {
  "use server";
  if (!await authorized()) redirect("/admin");

  const adultPhone = String(data.get("adultPhone") ?? "").trim();
  const childPhone = String(data.get("childPhone") ?? "").trim();
  for (const phone of [adultPhone, childPhone]) {
    if (phone && (phone.length > 32 || !/^\+?[\d ()-]+$/.test(phone) ||
        !/^\d{7,15}$/.test(phone.replace(/\D/g, "")))) {
      redirect("/admin?section=contacts&error=phone");
    }
  }
  const readLink = (key: string) => {
    const value = String(data.get(key) ?? "").trim();
    if (!value) return "";
    const url = URL.parse(value);
    if (!url || url.protocol !== "https:" || url.username || url.password || value.length > 500) {
      redirect("/admin?section=contacts&error=link");
    }
    return url.href;
  };
  const readEmail = (key: string) => {
    const value = String(data.get(key) ?? "").trim();
    if (value && (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) redirect("/admin?section=contacts&error=email");
    return value;
  };
  const contacts = {
    address: String(data.get("address") ?? "").trim().slice(0, 500),
    adultPhone, childPhone,
    max: readLink("max"), telegram: readLink("telegram"),
    whatsapp: readLink("whatsapp"), vk: readLink("vk"),
    adultMax: readLink("adultMax"), adultWhatsapp: readLink("adultWhatsapp"), adultEmail: readEmail("adultEmail"),
    childMax: readLink("childMax"), childWhatsapp: readLink("childWhatsapp"), childEmail: readEmail("childEmail"),
    adultTelegram: readLink("adultTelegram"), adultVk: readLink("adultVk"),
    childTelegram: readLink("childTelegram"), childVk: readLink("childVk"),
  };
  await db().siteContacts.upsert({
    where: { id: 1 },
    create: { id: 1, ...contacts },
    update: contacts,
  });
  revalidatePath("/");
  revalidatePath("/contacts");
  redirect("/admin?section=contacts&saved=1");
}


type Props = { searchParams: Promise<{ error?: string; section?: string; saved?: string }> };

export default async function Admin({ searchParams }: Props) {
  const { error, section, saved } = await searchParams;
  if (!await authorized()) return <main className={styles.content}>
    <h1>Вход в админку</h1>
    {error === "login" && <p role="alert">Проверьте пароль.</p>}
    <form action={login} className={styles.form}>
      <label>Пароль<input name="password" type="password" autoComplete="current-password" required /></label>
      <button>Войти</button>
    </form>
  </main>;

  const contacts = section === "contacts" ? await getContacts() : null;

  return <main className={styles.content}>
    <h1>Админка</h1>
    {!contacts && <BackupDownload />}
    {contacts && <section aria-labelledby="contact-heading">
      <h2 id="contact-heading">Контакты</h2>
      <p>Пустые поля скрываются на сайте.</p>
      {saved === "1" && <p role="status">Контакты сохранены.</p>}
      {error === "phone" && <p role="alert">Проверьте формат телефонов.</p>}
      {error === "link" && <p role="alert">Вставьте полные ссылки, начинающиеся с https://.</p>}
      <form action={saveContacts} className={styles.form}>
        <label>Адрес центра<input name="address" maxLength={500} defaultValue={contacts.address} /></label>
        {phones.map(({ key, label }) => <label key={key}>{label}
          <input type="tel" name={key} maxLength={32} defaultValue={contacts[key]} />
        </label>)}
        {specialistContacts.map(group => <fieldset key={group.label}><legend>{group.label}</legend>{group.fields.map(({key, label, type}) => <label key={key}>{label}<input type={type} name={key} maxLength={type === "email" ? 254 : 500} defaultValue={contacts[key]} placeholder={type === "email" ? "name@example.ru" : "https://"} /></label>)}</fieldset>)}
        {error === "email" && <p role="alert">{"\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 email."}</p>}
        {messengers.map(({ key, label }) => <label key={key}>{label}
          <input type="url" name={key} maxLength={500} defaultValue={contacts[key]} />
        </label>)}
        <button>Сохранить контакты</button>
      </form>
    </section>}

  </main>;
}
