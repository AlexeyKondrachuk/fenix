import type { SVGProps } from "react";
import type { TrainingIconName } from "../../lib/trainings-data";
export type TrainingSymbol = TrainingIconName | "calendar" | "clock" | "price" | "duration" | "people" | "info" | "arrow" | "leaf";
const paths = {
  target: <><circle cx="22" cy="25" r="17" /><circle cx="22" cy="25" r="11" /><circle cx="22" cy="25" r="5" /><path d="m22 25 20-20m-8 0v8h8" /></>,
  child: <><circle cx="24" cy="22" r="12" /><circle cx="10" cy="10" r="5" /><circle cx="38" cy="10" r="5" /><path d="M8 45c0-15 32-15 32 0M18 21h1m10 0h1m-12 6c4 3 8 3 12 0" /></>,
  bird: <><path d="M5 40c10-1 13-9 14-16C10 26 6 21 5 12c8 0 15 2 20 8 0-13 7-17 17-15-1 5-3 9-8 12l10 3-9 4c-1 17-15 23-30 16Z" /><path d="m10 43 24-25" /></>,
  breath: <><path d="M4 16h27c13 0 13-14 3-14-5 0-7 4-7 7M4 25h34c10 0 10 14 1 14-4 0-6-3-6-6M4 34h15c11 0 11 12 3 12" /></>,
  shield: <><path d="m24 3 18 7v12c0 10-9 18-18 23C15 40 6 32 6 22V10l18-7Z" /><path d="m16 23 6 6 11-13" /></>,
  lotus: <><path d="M24 41C11 31 15 17 24 5c9 12 13 26 0 36ZM18 21C12 14 7 13 7 13c-2 11 3 22 17 28m6-20c6-7 11-8 11-8 2 11-3 22-17 28" /><path d="M24 41C11 43 4 35 2 26c11-2 18 4 22 15Zm0 0c13 2 20-6 22-15-11-2-18 4-22 15Z" /></>,
  calendar: <><rect x="6" y="10" width="36" height="33" rx="4" /><path d="M6 20h36M15 5v11M33 5v11" /></>,
  clock: <><circle cx="24" cy="24" r="19" /><path d="M24 11v14l9 6" /></>,
  price: <><ellipse cx="18" cy="12" rx="13" ry="6" /><path d="M5 12v8c0 8 26 8 26 0v-8M5 21v8c0 8 26 8 26 0v-8M5 30v8c0 8 26 8 26 0v-8m4-18c15-6 16 7 1 8m0 0v9c13 1 16-6 10-10m-10 10v9c10 1 15-4 15-8" /></>,
  duration: <><path d="M12 4h24M12 44h24M14 4c0 15 20 25 20 40M34 4c0 15-20 25-20 40M15 13h18M15 36h18" /></>,
  people: <><circle cx="24" cy="12" r="7" /><circle cx="7" cy="19" r="5" /><circle cx="41" cy="19" r="5" /><path d="M12 44V33c0-14 24-14 24 0v11M1 42V32c0-6 5-9 10-8m36 18V32c0-6-5-9-10-8" /></>,
  info: <><circle cx="24" cy="24" r="20" /><path d="M24 21v15M22 21h2m-4 15h8M24 12v1" /></>,
  arrow: <><circle cx="24" cy="24" r="20" /><path d="M13 24h22m-9-9 9 9-9 9" /></>,
  leaf: <><path d="M24 44V24M24 31C7 33 3 22 3 12c15-1 23 5 21 19Zm0-7C23 8 32 2 45 3c0 13-7 22-21 21Z" /></>,
};
export default function TrainingIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: TrainingSymbol }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
