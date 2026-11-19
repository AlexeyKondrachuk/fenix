import type { Metadata } from "next";
import Breadcrumbs from "../../../components/Breadcrumbs";
import PsychotherapistIntro from "../../../components/psychotherapist/PsychotherapistIntro";
import EducationSection from "../../../components/psychotherapist/EducationSection";
import AdvantagesSection from "../../../components/psychotherapist/AdvantagesSection";
import ConcernsSection from "../../../components/psychotherapist/ConcernsSection";
import PricesSection from "../../../components/psychotherapist/PricesSection";
import CertificatesSection from "../../../components/psychotherapist/CertificatesSection";
import Reviews from "../../../components/reviews/Reviews";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Психотерапевт Волков Виталий Владимирович — Феникс", description: "Врач-психотерапевт, клинический психолог, кандидат медицинских наук. Индивидуальная и групповая психотерапия в центре «Феникс»." };

export default async function PsychotherapistPage({ searchParams }: { searchParams: Promise<{ reviewPage?: string | string[] }> }) {
  const { reviewPage } = await searchParams;
  return <main className={styles.main}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Психотерапевт" }]} />
    <PsychotherapistIntro />
    <EducationSection />
    <AdvantagesSection />
    <ConcernsSection />
    <PricesSection />
    <section id="methods" className={styles.details}><h2>Методы психотерапии</h2><p>Интегративный подход позволяет сочетать разные методы с учётом вашего запроса. В моей практике — EMDR, ImTT, FLASH и IFS. Подходящий формат работы мы обсудим на первой консультации.</p></section>
    <CertificatesSection />
    <Reviews specialist="adult" requestedPage={reviewPage} />
  </main>;
}
