/** Shared photo endpoint: changing a hero photo updates every specialist portrait. */
export default function SpecialistPhoto({ role, alt, className }: {
  role: "adult" | "child"; alt: string; className?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/api/hero/${role}`} alt={alt} className={className} />;
}
