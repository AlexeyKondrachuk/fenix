import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { connection } from "next/server";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return <><Header />{children}<Footer /></>;
}
