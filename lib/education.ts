import { cache } from "react";
import { db } from "./db";
import defaults from "./education-default.json";

export type Education = { description: string; items: string[] };

export function validEducation(value: unknown): value is Education {
  if (!value || typeof value !== "object" || !("description" in value) || !("items" in value)) return false;
  return typeof value.description === "string" && value.description.trim().length > 0 && value.description.length <= 5000
    && Array.isArray(value.items) && value.items.length <= 200
    && value.items.every(item => typeof item === "string" && item.trim().length > 0 && item.length <= 5000);
}

export const getEducation = cache(async (): Promise<Education> => {
  const saved = await db().educationContent.findUnique({ where: { id: 1 } });
  return saved && validEducation(saved) ? { description: saved.description, items: saved.items } : defaults;
});
