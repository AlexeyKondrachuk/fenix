export default function SocialIcon({ name }: { name: "telegram" | "vk" }) {
  return name === "telegram"
    ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m21 3-4 18-6-5-3 3 1-6 9-7-11 6-5-2Z" /></svg>
    : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6c1 8 5 12 10 12V6m0 8c3 0 5-4 8-8m-8 7c4 0 6 3 8 5" /></svg>;
}
