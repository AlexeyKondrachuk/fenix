export type ServicePrice = { name: string; price: string; note: string };
export type Prices = { title: string; services: ServicePrice[] };

export function validPrices(value: unknown): value is Prices {
  if (!value || typeof value !== "object") return false;
  const v = value as Prices;
  const text = (s: unknown, max: number, required = true) => typeof s === "string" && (!required || s.trim().length > 0) && s.length <= max;
  return text(v.title, 200) && Array.isArray(v.services) && v.services.length <= 100
    && v.services.every(s => s && text(s.name, 1000) && text(s.price, 100) && text(s.note, 2000, false));
}

export const defaultPrices: Prices = {
  title: "Стоимость услуг психотерапевта",
  services: [
    { name: "Психотерапевт, психолог онлайн (1 час)", price: "6 000 руб", note: "" },
    { name: "Психотерапевтический интенсив (10 дней, 90 часов)", price: "33 000 руб", note: "" },
    { name: "Долгосрочная психотерапия зависимого поведения (1 час)", price: "4 000 руб", note: "" },
    { name: "Психотерапевтическая группа «Свободное дыхание» (4 дня, 30 часов)", price: "12 000 руб", note: "" },
    { name: "Оказание медицинской психотерапевтической и психологической помощи военным, спасателям и гражданам, осуществляющим работу в зоне чрезвычайных ситуаций.", price: "По договорённости", note: "" },
  ],
};
