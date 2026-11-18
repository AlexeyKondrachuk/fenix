"use server";

import { redirect } from "next/navigation";
import { authorized } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";

export async function createArticleCategory(formData: FormData) {
  if (!await authorized()) redirect("/admin");
  const value = formData.get("name");
  const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (!name || name.length > 80) redirect("/admin/articles?categoryError=1");
  await db().articleCategory.upsert({ where: { name }, update: {}, create: { name } });
  redirect("/admin/articles?categorySaved=1");
}
