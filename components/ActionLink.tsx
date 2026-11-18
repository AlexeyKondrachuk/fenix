import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ActionLink.module.scss";

export default function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className={styles.button} href={href}>{children}</Link>;
}
