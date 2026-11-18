import { cache } from "react";
import { db } from "./db";
import { validTraining, type Training } from "./trainings-data";
function decode(row: { id: string; slug: string; title: string; published: boolean; position: number; content: unknown }): Training | null {
  const data = { ...(row.content && typeof row.content === "object" ? row.content : {}), slug: row.slug, title: row.title, published: row.published, position: row.position };
  return validTraining(data) ? { ...data, id: row.id } : null;
}
export const getTrainings = cache(async (admin = false) => {
  const rows = await db().training.findMany({ where: admin ? {} : { published: true }, orderBy: [{ position: "asc" }, { title: "asc" }] });
  return rows.map(decode).filter((item): item is Training => item !== null);
});
export const getTraining = cache(async (slug: string) => {
  const row = await db().training.findUnique({ where: { slug } });
  return row?.published ? decode(row) : null;
});
export const getAdminTraining = cache(async (id: string) => {
  const row = await db().training.findUnique({ where: { id } });
  return row ? decode(row) : null;
});
