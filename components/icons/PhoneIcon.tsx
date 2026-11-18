import type { SVGProps } from "react";
import styles from "./PhoneIcon.module.scss";

export default function PhoneIcon({ outlined = true, badge = false, className, ...props }: SVGProps<SVGSVGElement> & { outlined?: boolean; badge?: boolean }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" className={[badge && styles.badge, className].filter(Boolean).join(" ")} fill={outlined ? "none" : "currentColor"} stroke={outlined ? "currentColor" : undefined} strokeWidth={outlined ? "1.6" : undefined} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-2 2a13 13 0 0 1-7-7l2-2-2-5Z" />
  </svg>;
}
