import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import TrainingIcon from "../../../../components/icons/TrainingIcon";
import TrainingFacts from "../../../../components/trainings/TrainingFacts";
import TrainingDates from "../../../../components/trainings/TrainingDates";
import TrainingContact from "../../../../components/trainings/TrainingContact";
import TrainingPhotos from "../../../../components/trainings/TrainingPhotos";
import { getTraining } from "../../../../lib/trainings";
import { siteUrl } from "../../../../lib/article-seo";
import styles from "../../../../components/trainings/trainings.module.scss";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const training = await getTraining((await params).slug);
  if (!training) notFound();
  const title = training.seoTitle?.trim() || training.title;
  const description = training.seoDescription?.trim() || training.summary;
  const origin = siteUrl();
  const url = origin ? `${origin}/treningi/${training.slug}` : undefined;
  return {
    title, description,
    ...(url ? { alternates: { canonical: url }, robots: { index: true, follow: true } } : {}),
    openGraph: { type: "website", title, description, url },
    twitter: { card: "summary", title, description },
  };
}
export default async function TrainingPage({ params }: Props) {
  const training = await getTraining((await params).slug);
  if (!training) notFound();
  return <main className={styles.main}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Тренинги", href: "/treningi" }, { label: training.title }]} />
    <article><header className={styles.detailHeader}><TrainingIcon name={training.icon} /><div>{training.badge && <span className={styles.badge}>{training.badge}</span>}<h1>{training.title}</h1><p>{training.summary}</p></div></header>
      <div className={styles.detailGrid}><section className={styles.description}><h2>О тренинге</h2>{training.description.split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</section><aside className={styles.detailFacts}><TrainingFacts training={training} /><TrainingDates dates={training.dates} /><Link className={styles.enroll} href="#training-contact">Уточнить детали и записаться →</Link></aside></div>
      <TrainingPhotos photos={training.photos} title={training.title} />
    </article><TrainingContact /><Link className={styles.back} href="/treningi">← Все тренинги</Link>
  </main>;
}
