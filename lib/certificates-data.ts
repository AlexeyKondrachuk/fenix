export type Certificate = { id: string; title: string; year: string; file: string };
export type Certificates = { title: string; items: Certificate[] };
export const certificateFile = /^[a-z0-9-]+\.jpg$/;
export function validCertificates(value: unknown): value is Certificates {
  if (!value || typeof value !== "object") return false;
  const v = value as Certificates;
  return typeof v.title === "string" && v.title.trim().length > 0 && v.title.length <= 200
    && Array.isArray(v.items) && v.items.length <= 100 && new Set(v.items.map(i => i?.id)).size === v.items.length
    && v.items.every(i => i && typeof i.id === "string" && /^[a-z0-9-]{1,100}$/.test(i.id)
      && typeof i.title === "string" && i.title.trim().length > 0 && i.title.length <= 300
      && typeof i.year === "string" && /^(?:\d{4}(?:[–-]\d{4})?)?$/.test(i.year)
      && typeof i.file === "string" && i.file.length <= 150 && certificateFile.test(i.file));
}
export const defaultCertificates: Certificates = { title: "Дипломы и сертификаты", items: [
  { id: "degree", title: "Диплом кандидата медицинских наук", year: "2013", file: "kandidat-medicinskiy-nauk-volkov.jpg" },
  { id: "transpersonal", title: "Трансперсональная психология и психотерапия · 240 часов", year: "2015", file: "transpersonalnyy-psiholog.jpg" },
  { id: "hypnosis", title: "Эриксоновский гипноз и эриксоновская терапия · 264 часа", year: "2011", file: "eriksonovskiy-gipnoz.jpg" },
  { id: "clinical", title: "Клиническая трансперсональная психотерапия · 96 часов", year: "2014", file: "transpersonalnaya-psihoterapiya.jpg" },
  { id: "bioenergy", title: "Биоэнергетический анализ А. Лоуэна · 40 часов", year: "2016", file: "bioenergetika-louena.jpg" },
  { id: "panic", title: "Психотерапия панических атак · 24 часа", year: "2016", file: "lechenie-panicheskih-atak.jpg" },
  { id: "feldenkrais", title: "Осознавание через движение по методу М. Фельденкрайза · 40 часов", year: "2016", file: "metod-feldenkrayza.jpg" },
  { id: "psychosomatic", title: "Телесно-ориентированная психотерапия в работе с психосоматическими расстройствами · 40 часов", year: "2016", file: "psihosomatika.jpg" },
] };
