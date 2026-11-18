"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("fenix_admin", "", { path: "/", maxAge: 0 });
  cookieStore.set("fenix_admin", "", { path: "/admin", maxAge: 0 });
  redirect("/admin");
}
