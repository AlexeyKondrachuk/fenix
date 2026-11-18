const paths = {
  pin: "M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0ZM14.5 9a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",
  laptop: "M4 17V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v11M4 17l-2 3h20l-2-3H4Z",
  therapist: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 22a9 9 0 0 1 18 0",
  child: "M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6 22v-2a6 6 0 0 1 12 0v2ZM7 4a3 3 0 0 0-2 5.5A6 6 0 0 0 1 15v3m16-14a3 3 0 0 1 2 5.5 6 6 0 0 1 4 5.5v3",
  training: "m1 8 11-5 11 5-11 5L1 8Zm4 2v7c4 4 10 4 14 0v-7",
  meditation: "M12 21C6 16 7 9 12 3c5 6 6 13 0 18Zm0 0C5 21 2 17 1 12c3 0 5 1 7 3m4 6c7 0 10-4 11-9-3 0-5 1-7 3M5 12 4 6c2 0 4 2 5 3m10 3 1-6c-2 0-4 2-5 3",
  tests: "M9 4H5a2 2 0 0 0-2 2v15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a2 2 0 0 0-2-2h-4M9 2h6v5H9zM7 11h2m3 0h5M7 16h2m3 0h5",
  articles: "M12 5C9 2 5 2 2 4v16c3-2 7-2 10 1 3-3 7-3 10-1V4c-3-2-7-2-10 1Zm0 0v16",
} as const;

export default function MenuIcon({ name }: { name: keyof typeof paths }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={paths[name]} />
  </svg>;
}
