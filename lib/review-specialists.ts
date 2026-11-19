export const reviewSpecialists = {
  adult: "Волков Виталий Владимирович",
  child: "Волкова Алла Владимировна",
  center: "Центр «Феникс» / оба специалиста",
} as const;

export function isReviewSpecialist(value: unknown): value is keyof typeof reviewSpecialists {
  return typeof value === "string" && Object.hasOwn(reviewSpecialists, value);
}
