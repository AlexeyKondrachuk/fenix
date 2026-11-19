import type { SVGProps } from "react";

const paths = {
  degree: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v6c4 3 8 3 12 0v-6M3 10v8" /></>,
  medicine: <><path d="M12 3v19M9 2h6M6 6h12c0 5-12 3-12 8 0 3 12 1 12 5 0 2-6 3-10 1" /><path d="M9 5c-4 0-5 4 0 5m6 2c4 2 4 5 0 6" /></>,
  psychology: <><path d="M12 3v18M8 21h8M3 4h4m10 0h4M5 4v6c0 5 14 5 14 0V4" /></>,
  methods: <><path d="m3 8 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5" /></>,
  certificate: <><path d="M14 19H3V4h18v10M7 8h10M7 12h5M7 16h3" /><circle cx="17" cy="16" r="3" /><path d="m15 19-1 4 3-1 3 1-1-4" /></>,
  shield: <><path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6l9-4Z" /><path d="m8 12 3 3 5-6" /></>,
  heart: <path d="M12 21 3.5 12.5a5.5 5.5 0 0 1 8-7.5l.5.5.5-.5a5.5 5.5 0 0 1 8 7.5L12 21Z" />,
  sprout: <><path d="M12 22V11M12 15C5 16 2 12 2 7c7 0 10 3 10 8ZM12 11c0-6 4-9 10-9 0 6-4 10-10 9Z" /></>,
  email: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7M3 18l6-6m12 6-6-6" /></>,
  phone: <path d="M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-2 2a13 13 0 0 1-7-7l2-2-2-5Z" />,
  infinity: <path d="M12 12c-2.4-3-4-4.5-6-4.5a4.5 4.5 0 1 0 0 9c2 0 3.6-1.5 6-4.5Zm0 0c2.4-3 4-4.5 6-4.5a4.5 4.5 0 1 1 0 9c-2 0-3.6-1.5-6-4.5Z" />,
  levels: <path d="M3 20v-5h4v5Zm7 0V9h4v11Zm7 0V3h4v17Z" />,
  person: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  people: <><circle cx="8" cy="7" r="3" /><circle cx="17" cy="8" r="3" /><path d="M2 21v-3a6 6 0 0 1 12 0v3m2-8a6 6 0 0 1 6 6v2" /></>,
  conversation: <><path d="M4 4h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8l-4 3v-3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="M19 8h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2v3l-4-3h-5M6 9h7" /></>,
  checklist: <><rect x="4" y="4" width="16" height="18" rx="2" /><rect x="9" y="2" width="6" height="4" rx="1" /><path d="m7 11 1.5 1.5L11 10m2 2h4m-10 4 1.5 1.5L11 15m2 2h4" /></>,
  adjustments: <><path d="M3 6h5m4 0h9M3 12h10m4 0h4M3 18h4m4 0h10" /><circle cx="10" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="9" cy="18" r="2" /></>,
};

export type ProfileIconName = keyof typeof paths;

export default function ProfileIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: ProfileIconName }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

