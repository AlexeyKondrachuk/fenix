"use client";

/** Shared photo endpoint: changing a hero photo updates every specialist portrait. */
export default function SpecialistPhoto({ role, alt, className }: {
  role: "adult" | "child"; alt: string; className?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  const fallback = `/hero/${role}.jpg`;
  function loadFallback(image: HTMLImageElement) {
    if (image.getAttribute("src") !== fallback) image.src = fallback;
  }
  return <img src={`/api/hero/${role}`} alt={alt} className={className}
    ref={image => {
      if (image?.complete && image.naturalWidth === 0) loadFallback(image);
    }}
    onError={({ currentTarget }) => loadFallback(currentTarget)}
  />;
}
