import { cache } from "react";
import { db } from "./db";
import { defaultConcerns, validConcerns, type Concerns } from "./concerns-data";

export const getConcerns = cache(async (): Promise<Concerns> => {
  const saved = await db().concernsContent.findUnique({ where: { id: 1 } });
  return saved && validConcerns(saved.content) ? saved.content : defaultConcerns;
});
