import type { SVGProps } from "react";

const icons = {
  education: <><path d="m3 12 21-8 21 8-21 8-21-8Z" /><path d="M11 15v12c8 6 18 6 26 0V15M42 14v13m-2 2h4" /></>,
  calendar: <><rect x="8" y="11" width="32" height="30" rx="3" /><path d="M8 20h32M16 6v10M32 6v10" /></>,
  layers: <><path d="m5 15 19-10 19 10-19 10L5 15Zm0 10 19 10 19-10M5 35l19 10 19-10" /></>,
  lotus: <><path d="M24 39C13 32 14 18 24 7c10 11 11 25 0 32Z" /><path d="M17 20c-5-5-9-6-9-6-2 8 0 14 3 18m20-12c5-5 9-6 9-6 2 8 0 14-3 18" /><path d="M24 39C13 43 4 35 2 25c10-3 19 2 22 14Zm0 0c11 4 20-4 22-14-10-3-19 2-22 14Z" /></>,
  shield: <><path d="M24 5c6 5 11 6 17 7v11c0 10-8 17-17 22C15 40 7 33 7 23V12c6-1 11-2 17-7Z" /><path d="m17 25 5 5 10-12" /></>,
  laptop: <><rect x="7" y="9" width="34" height="26" rx="2" /><path d="M11 35V13h26v22M3 35h42v2c-1 3-5 3-7 3H10c-2 0-6 0-7-3v-2Z" /></>,
};

export type AdvantageIconName = keyof typeof icons;

export default function AdvantageIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: AdvantageIconName }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{icons[name]}</svg>;
}
