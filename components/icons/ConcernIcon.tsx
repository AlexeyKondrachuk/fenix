import type { SVGProps } from "react";
import type { ConcernIconName } from "../../lib/concerns-data";

const gold = "#b69438";
const paths = {
  anxiety: <><path d="M56 78c-8-17 8-25 8-43C64 8 25 5 19 29l-6 16 7 4v13h15l3 16" /><g stroke={gold}><ellipse cx="42" cy="32" rx="15" ry="10" /><ellipse cx="42" cy="32" rx="8" ry="14" transform="rotate(-35 42 32)" /><path d="m30 28 22 10-16-17 4 25" /></g></>,
  self: <><path d="M43 67C21 53 24 33 42 15c18 18 22 38 1 52ZM31 58C17 53 11 40 10 27c12 1 22 7 26 15m16 0c5-9 13-13 24-15-1 12-6 26-19 32" /><path stroke={gold} d="M43 67C24 73 12 63 5 49c18-6 31 1 38 18Zm0 0c19 6 31-4 38-18-18-6-31 1-38 18Z" /></>,
  mood: <><g stroke={gold}><circle cx="59" cy="29" r="14" /><path d="M59 5V0M59 58v-6M35 29h-7m62 0h-8M42 12l-5-5m44 44-5-5m0-34 5-5" /></g><path d="M24 68c-21-1-20-24-4-26-1-27 35-31 40-4 23 0 24 30 3 30H24Z" /></>,
  trauma: <><path d="M43 76 15 48C-9 20 23-2 43 23 63-2 95 20 71 48L43 76Z" /><path stroke={gold} d="m43 23-8 15 13 5-12 11 10 9-3 13" /></>,
  crisis: <><path d="m4 69 18-26 13 15 17-31 30 42M52 27V5" /><path stroke={gold} d="M52 7h20l-6 7 6 7H52M20 83c44-9 45-18 31-23-13-5-4-12 5-15" /></>,
  health: <><path d="M13 81V52c0-13 20-14 22-24-12-30 27-34 20-3-3 14 22 12 22 28v28M24 60v21m42-21v21" /><path stroke={gold} d="M31 69c-1-24 13-29 30-27-1 21-11 29-30 27Zm-4 7 27-28" /></>,
  addiction: <><path d="m40 53-16 11C5 77-6 55 10 44l17-12c12-8 24 4 17 14m2-12L62 23c19-13 30 9 14 20L59 55c-12 8-24-4-17-14" /><path stroke={gold} d="m28 53 32-23M18 20l-7-6m25-2-1-9M61 9l4-7" /></>,
  body: <><path d="M23 82c-4-16 8-25 3-37-8-13 3-20 5-26C26-6 61-6 57 19c1 7 13 14 5 26-4 12 9 21 4 37M32 35c8 5 16 5 24 0" /><path stroke={gold} d="M23 84c-6-22 53-23 44-51M25 67c-9-23 42-18 38-38" /></>,
  family: <><circle cx="21" cy="28" r="11" /><circle cx="65" cy="28" r="11" /><path d="M4 75V58c0-20 30-24 33-2m12 0c3-22 33-18 33 2v17" /><circle cx="43" cy="55" r="9" /><path d="M29 80c0-24 28-24 28 0" /><path stroke={gold} d="M21 9C24-2 38-2 43 8 49-2 62-2 65 9" /></>,
  relationship: <><path d="M21 56C6 47-2 19 15 12c22-10 29 9 23 18l5 6-6 2v9l-9 2-3 10m37-3C77 47 85 19 68 12c-22-10-29 9-23 18l-5 6 6 2v9l9 2 3 10" /><path stroke={gold} d="M11 44c5 24 22 33 32 41 10-8 27-17 32-41" /></>,
};

export default function ConcernIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: ConcernIconName }) {
  return <svg width="96" height="110" viewBox="0 0 90 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M7 59C-9 88 14 104 36 86s49-10 38-27S23 30 7 59Z" fill="#e7ebdd" opacity=".6" stroke="none" />{paths[name]}
  </svg>;
}
