export const PRACTICE_STARTED = { year: 2004, month: 5, day: 1 } as const;

/** Completed years of practice, with the anniversary evaluated in Samara time. */
export function getExperienceYears(asOf: Date = new Date()): number {
  if (!Number.isFinite(asOf.getTime())) throw new RangeError("Invalid experience date");
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Samara", year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(asOf);
  const part = (type: string) => Number(parts.find(item => item.type === type)?.value);
  const beforeAnniversary = part("month") < PRACTICE_STARTED.month
    || (part("month") === PRACTICE_STARTED.month && part("day") < PRACTICE_STARTED.day);
  return Math.max(0, part("year") - PRACTICE_STARTED.year - Number(beforeAnniversary));
}

export function formatYears(years: number): string {
  if (!Number.isInteger(years) || years < 0) throw new RangeError("Years must be a non-negative integer");
  const lastTwo = years % 100;
  const last = years % 10;
  const word = lastTwo >= 11 && lastTwo <= 14 ? "лет"
    : last === 1 ? "год" : last >= 2 && last <= 4 ? "года" : "лет";
  return `${years} ${word}`;
}

export function getExperience(asOf: Date = new Date()): string {
  return formatYears(getExperienceYears(asOf));
}
