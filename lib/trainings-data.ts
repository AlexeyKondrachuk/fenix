export const trainingIcons = { target: "Интенсив", child: "Внутренний ребёнок", bird: "Поддержка", breath: "Дыхание", shield: "Границы", lotus: "Личностная работа" } as const;
export type TrainingIconName = keyof typeof trainingIcons;
export type TrainingDate = { start: string; end: string; note: string };
export type TrainingData = {
  slug: string; title: string; summary: string; description: string; duration: string; time: string;
  price: string; requirements: string; badge: string; icon: TrainingIconName; dates: TrainingDate[];
  photos: string[]; published: boolean; position: number;
};
export type Training = TrainingData & { id: string };
export const trainingSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const trainingPhoto = /^[a-f0-9-]{36}\.jpg$/;
export const trainingId = /^[a-f0-9-]{36}$/;
export function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function validTraining(value: unknown): value is TrainingData {
  if (!value || typeof value !== "object") return false;
  const v = value as TrainingData;
  const text = (s: unknown, max: number, required = true) => typeof s === "string" && s.length <= max && (!required || s.trim().length > 0);
  return text(v.slug, 120) && trainingSlug.test(v.slug) && text(v.title, 250) && text(v.summary, 1500)
    && text(v.description, 40000) && text(v.duration, 200) && text(v.time, 300) && text(v.price, 100)
    && text(v.requirements, 1000, false) && text(v.badge, 100, false) && Object.hasOwn(trainingIcons, v.icon)
    && typeof v.published === "boolean" && Number.isInteger(v.position) && v.position >= 0 && v.position <= 10000
    && Array.isArray(v.dates) && v.dates.length <= 50 && v.dates.every(d => d && typeof d.start === "string" && typeof d.end === "string" && validDate(d.start) && validDate(d.end) && d.end >= d.start && text(d.note, 300, false))
    && Array.isArray(v.photos) && v.photos.length <= 12 && v.photos.every(p => typeof p === "string" && trainingPhoto.test(p));
}
export const emptyTraining: TrainingData = { slug: "", title: "", summary: "", description: "", duration: "", time: "", price: "", requirements: "", badge: "", icon: "target", dates: [], photos: [], published: false, position: 0 };
const session = (start: string, end: string, note = ""): TrainingDate => ({ start, end, note });
export const defaultTrainings: TrainingData[] = [
  { ...emptyTraining, slug: "psihoterapevticheskiy-intensiv", title: "Психотерапевтический интенсив", summary: "Ключевой курс, основа для других групп.", description: "Базовый курс групповой психотерапевтической работы. Интенсив проходит в течение 10 дней.\n\nКурс открыт для всех желающих. Перед записью свяжитесь со специалистом, чтобы обсудить ваш запрос, формат участия и подготовку к группе.", duration: "10 дней", time: "с 9:00 до 18:00", price: "33 000 руб.", requirements: "Для всех желающих", badge: "Базовый курс", icon: "target", dates: [session("2026-12-04", "2026-12-13"), session("2027-04-02", "2027-04-11"), session("2027-08-06", "2027-08-15")], published: true, position: 0 },
  { ...emptyTraining, slug: "vnutrenniy-rebenok", title: "Группа «Внутренний ребёнок — исцеление детских травм»", summary: "Работа с детскими травмами, восстановление ресурса и целостности.", description: "Групповая работа с опытом детства и внутренними ресурсами.\n\nУсловие участия — пройденный 10-дневный психотерапевтический интенсив. Подробности программы и готовность к участию обсуждаются со специалистом перед записью.", duration: "8 дней", time: "с 9:00 до 18:00", price: "35 000 руб.", requirements: "Пройден 10-дневный интенсив", icon: "child", dates: [session("2026-11-07", "2026-11-14"), session("2027-06-05", "2027-06-12")], published: true, position: 1 },
  { ...emptyTraining, slug: "antistress", title: "Поддерживающая группа «АнтиСтресс»", summary: "Практика для опытных: снижение стресса, восстановление ресурса и внутреннего баланса.", description: "Поддерживающая группа выходного дня. Практический формат для участников с опытом дыхательных техник.\n\nГруппа проходит без теоретической части. Перед записью уточните у специалиста, подходит ли вам этот формат.", duration: "2 дня (сб–вс)", time: "с 9:00 до 18:00", price: "10 000 руб.", requirements: "Опыт в дыхательных техниках (без теории)", icon: "bird", dates: [session("2026-10-31", "2026-11-01"), session("2027-01-23", "2027-01-24")], published: true, position: 2 },
  { ...emptyTraining, slug: "svobodnoe-dyhanie", title: "Тренинг «Свободное дыхание»", summary: "Интенсивная дыхательная практика для глубокой эмоциональной разгрузки и восстановления ресурсов.", description: "Четырёхдневный тренинг с дыхательными практиками и групповой работой.\n\nВ четверг и пятницу занятия проходят вечером, в субботу и воскресенье — в течение дня. Перед записью обсудите со специалистом подготовку и условия участия.", duration: "4 дня", time: "чт–пт 16:00–21:00; сб–вс 9:00–18:00", price: "12 000 руб.", icon: "breath", dates: [session("2027-02-04", "2027-02-07"), session("2027-05-20", "2027-05-23")], published: true, position: 3 },
  { ...emptyTraining, slug: "moi-granitsy", title: "Группа «Мои границы»", summary: "Развитие здоровых личных границ, уверенности и уважения к своим потребностям.", description: "Групповая работа с личными границами и отношением к собственным потребностям.\n\nДля участия необходим опыт в психотерапии. В пятницу занятия проходят вечером, в субботу и воскресенье — в течение дня.", duration: "3 дня", time: "пт 16:00–21:00; сб–вс 9:00–18:00", price: "12 000 руб.", requirements: "Опыт в психотерапии", icon: "shield", dates: [session("2027-02-26", "2027-02-28")], published: true, position: 4 },
  { ...emptyTraining, slug: "zhenskaya-gruppa", title: "Психотерапевтическая женская группа", summary: "Темы: последствия измен, насилия, работа с сексуальностью и образом себя.", description: "Женская психотерапевтическая группа для работы с личной историей, отношениями и образом себя.\n\nВ пятницу занятия проходят вечером, в субботу и воскресенье — в течение дня. Детали программы и условия участия можно уточнить у специалиста.", duration: "3 дня", time: "пт 16:00–21:00; сб–вс 9:00–18:00", price: "12 000 руб.", icon: "lotus", dates: [session("2026-10-23", "2026-10-25", "Группа 1"), session("2027-03-26", "2027-03-28", "Группа 2, новый набор")], published: true, position: 5 },
];
