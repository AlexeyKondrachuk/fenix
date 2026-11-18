import { cache } from "react";
import { db } from "./db";

export const phones = [
  { key: "adultPhone", label: "Врач-психотерапевт" },
  { key: "childPhone", label: "Детский и семейный психолог" },
] as const;

export const messengers = [
  { key: "max", label: "MAX" },
  { key: "telegram", label: "Telegram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "vk", label: "VK" },
] as const;

export const specialistContacts = [
  { label: "\u041f\u0441\u0438\u0445\u043e\u0442\u0435\u0440\u0430\u043f\u0435\u0432\u0442", fields: [
    { key: "adultVk", label: "VK", type: "url" }, { key: "adultTelegram", label: "Telegram", type: "url" },
    { key: "adultMax", label: "MAX", type: "url" }, { key: "adultWhatsapp", label: "WhatsApp", type: "url" }, { key: "adultEmail", label: "Email", type: "email" },
  ] },
  { label: "\u0414\u0435\u0442\u0441\u043a\u0438\u0439 \u043f\u0441\u0438\u0445\u043e\u043b\u043e\u0433", fields: [
    { key: "childVk", label: "VK", type: "url" }, { key: "childTelegram", label: "Telegram", type: "url" },
    { key: "childMax", label: "MAX", type: "url" }, { key: "childWhatsapp", label: "WhatsApp", type: "url" }, { key: "childEmail", label: "Email", type: "email" },
  ] },
] as const;

const emptyContacts = {
  address: "г. Тольятти, ул. Офицерская, 31, офис 10",
  adultMax: "", adultWhatsapp: "", adultEmail: "", childMax: "", childWhatsapp: "", childEmail: "",
  adultTelegram: "", adultVk: "", childTelegram: "", childVk: "",
  adultPhone: "",
  childPhone: "",
  max: "",
  telegram: "",
  whatsapp: "",
  vk: "",
};

export const getContacts = cache(async () => {
  return await db().siteContacts.findUnique({ where: { id: 1 } }) ?? emptyContacts;
});
