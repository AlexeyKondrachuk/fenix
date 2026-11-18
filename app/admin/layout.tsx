import { Suspense } from "react";
import { authorized } from "../../lib/admin-auth";
import AdminSidebar from "./AdminSidebar";
import styles from "./admin.module.scss";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!await authorized()) return children;
  return <div className={styles.shell}><Suspense><AdminSidebar /></Suspense><div className={styles.workspace}>{children}</div></div>;
}
