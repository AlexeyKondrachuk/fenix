import { cache } from "react";
import { db } from "./db";
import { defaultPrices, validPrices, type Prices } from "./prices-data";

export const getPrices = cache(async (): Promise<Prices> => {
  const saved = await db().pricesContent.findUnique({ where: { id: 1 } });
  return saved && validPrices(saved.content) ? saved.content : defaultPrices;
});
