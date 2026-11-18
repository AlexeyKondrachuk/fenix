"use client";

import { useRef, type ReactNode } from "react";
import { useClickOutside } from "../../hooks/useClockOutside";

export default function Dropdown({ className, label, trigger, children }: {
  className: string;
  label: string;
  trigger?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useClickOutside(ref, () => {
    if (ref.current?.open) ref.current.open = false;
  });

  return <details ref={ref} className={className} onKeyDown={event => {
    if (event.key !== "Escape" || !event.currentTarget.open) return;
    event.currentTarget.open = false;
    event.currentTarget.querySelector("summary")?.focus();
  }}>
    <summary aria-label={label} title={trigger ? label : undefined}>{trigger ?? label}</summary>
    {children}
  </details>;
}
