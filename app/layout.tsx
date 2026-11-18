import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: { default: "Феникс — центр психологии", template: "%s | Феникс" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body><Providers>{children}</Providers></body></html>;
}