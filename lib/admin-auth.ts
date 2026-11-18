import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export function matches(actual: string, expected: string) {
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return null;
  return createHmac("sha256", secret).update(password).digest("hex");
}

export async function authorized() {
  const expected = sessionToken();
  return expected !== null && matches((await cookies()).get("fenix_admin")?.value ?? "", expected);
}


