"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Header.module.scss";

export default function StickyMenu({ children, contacts }: { children: ReactNode; contacts: ReactNode }) {
  const marker = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!marker.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPinned(!entry.isIntersecting && entry.boundingClientRect.bottom <= 12);
    }, { rootMargin: "-12px 0px 0px 0px" });
    observer.observe(marker.current);
    return () => observer.disconnect();
  }, []);

  return <>
    <div className={styles.stickyMarker} ref={marker} aria-hidden="true" />
    <div className={styles.stickyMenu} data-pinned={pinned}>
      <div className={styles.capsule}>
        {children}
        {pinned && <div className={styles.capsuleContacts}>{contacts}</div>}
      </div>
    </div>
  </>;
}
