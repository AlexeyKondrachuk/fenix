export const navigation = [
  { label: "Психотерапевт", items: [
    { label: "Индивидуальная психотерапия", slug: "individual-therapy" },
    { label: "Групповая психотерапия", slug: "group-therapy" },
  ] },
  { label: "Детский психолог", items: [
    { label: "Консультация для детей", href: "/detskiy-psiholog" },
    { label: "Нейропсихологическая коррекция", slug: "neuropsychology" },
  ] },
  { label: "Направления", items: [
    { label: "Взрослым", href: "/#adults" },
    { label: "Детям и подросткам", href: "/#children" },
    { label: "Родителям", href: "/#parents" },
  ] },
  { label: "Тренинги", items: [
    { label: "Групповые тренинги", slug: "group-training" },
    { label: "Индивидуальные тренинги", slug: "individual-training" },
    { label: "Онлайн-тренинги", slug: "online-training" },
  ] },
] as const;

export const standalone = [
  { label: "Тренинги", slug: "training" },
  { label: "Медитации", slug: "meditations" },
  { label: "Тесты", slug: "tests" },
  { label: "Статьи", slug: "articles" },
  { label: "Контакты", slug: "contacts" },
] as const;
