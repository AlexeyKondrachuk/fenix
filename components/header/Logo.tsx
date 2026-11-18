import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";

export default function Logo() {
  return <Link href="/" className={styles.logo} aria-label="Феникс — главная">
    <Image className={styles.phoenix} src="/brand/phoenix.webp" alt="" width={157} height={188} unoptimized />
    <span className={styles.logoText}>
      <span className={styles.wordmark}>ФЕНИКС</span>
      <span>Центр психотерапии,<br />тренинга и детской<br />нейропсихологии</span>
    </span>
  </Link>;
}
