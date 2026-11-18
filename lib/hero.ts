import { join } from "node:path";
import { uploadRoot } from "./article-storage";

export const heroDirectory = join(uploadRoot, "hero");
export const specialists = {
  adult: { name: "Виталий Волков", displayName: "Виталий Владимирович", fullName: "Волков Виталий Владимирович", title: "Психотерапевт", audience: "Для взрослых", href: "/psyhoterapevt" },
  child: { name: "Алла Волкова", displayName: "Алла Владимировна", fullName: "Волкова Алла Владимировна", title: "Детский психолог", audience: "Для детей и родителей", href: "/detskiy-psiholog" },
} as const;

export function isHeroRole(role: string): role is keyof typeof specialists {
  return role === "adult" || role === "child";
}
