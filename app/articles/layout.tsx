import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { siteUrl } from "../../lib/article-seo";

export const metadata = { metadataBase: new URL(siteUrl() || "http://localhost:3100") };

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <><Header />{children}<Footer /></>;
}
