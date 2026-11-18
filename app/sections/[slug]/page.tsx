import Footer from "../../../components/footer/Footer";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "../../../components/header/Header";
import Contacts from "../../../components/header/Contacts";
import { navigation, standalone } from "../../../lib/navigation";
import styles from "../../site.module.scss";

export const dynamic = "force-dynamic";

export default async function Section({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "articles") redirect("/articles");
  const section = [...standalone, ...navigation.flatMap(group => [...group.items])]
    .find(item => "slug" in item && item.slug === slug);
  if (!section) notFound();

  return <>
    <Header />
    <main className={`${styles.content} ${styles.publicMain}`}>
      <h1>{section.label}</h1>
      {slug === "contacts" ? <Contacts /> : <p>Раздел готовится к публикации.</p>}
      <Link href="/">На главную</Link>
    </main>
    <Footer />
  </>;
}
