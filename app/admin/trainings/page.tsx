import Link from "next/link";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { authorized } from "../../../lib/admin-auth";
import { getAdminTraining, getTrainings } from "../../../lib/trainings";
import { emptyTraining, trainingId } from "../../../lib/trainings-data";
import TrainingEditor from "./TrainingEditor";
import styles from "./trainings-admin.module.scss";
import site from "../../site.module.scss";
export const dynamic = "force-dynamic";
export default async function AdminTrainings({ searchParams }: { searchParams: Promise<{ id?: string; new?: string; saved?: string }> }) {
  if (!await authorized()) redirect("/admin");
  const query = await searchParams;
  const training = query.id && trainingId.test(query.id) ? await getAdminTraining(query.id) : null;
  const trainings = await getTrainings(true);
  if (query.new === "1" || query.id) return <main className={site.content}><Link href="/admin/trainings">← Все тренинги</Link><h1>{query.new === "1" ? "Новый тренинг" : "Редактирование тренинга"}</h1>
    {query.new === "1" ? <TrainingEditor key="new" id={randomUUID()} initial={{ ...emptyTraining, position: trainings.length }} /> : training ? <TrainingEditor key={training.id} id={training.id} initial={training} saved={query.saved === "1"} /> : <p>Тренинг не найден.</p>}
  </main>;
  return <main className={site.content}><h1>Тренинги</h1><div className={styles.topLinks}><Link href="/admin/trainings?new=1">+ Добавить тренинг</Link><Link href="/treningi" target="_blank">Открыть страницу на сайте ↗</Link></div>
    <p>Управляйте программой, датами, стоимостью и фотографиями. Чтобы убрать тренинг с сайта, снимите отметку «Опубликован» в редакторе.</p>
    <ul className={styles.list}>{trainings.map(t => <li key={t.id}><div><Link href={`/admin/trainings?id=${t.id}`}>{t.title}</Link><span>{t.published ? "Опубликован" : "Черновик"} · {t.price} · Порядок: {t.position}</span></div><Link href={`/admin/trainings?id=${t.id}`}>Редактировать →</Link></li>)}</ul>
  </main>;
}
