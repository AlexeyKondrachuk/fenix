import { cache } from "react";
import { join } from "node:path";
import { uploadRoot } from "./article-storage";
import { db } from "./db";
import { defaultCertificates, validCertificates, type Certificates } from "./certificates-data";
export const certificateDirectory = join(uploadRoot, "certificates");
export const getCertificates = cache(async (): Promise<Certificates> => {
  const saved = await db().certificatesContent.findUnique({ where: { id: 1 } });
  return saved && validCertificates(saved.content) ? saved.content : defaultCertificates;
});
