import { randomUUID } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { authorized } from "../../../lib/admin-auth";
import { heroDirectory, isHeroRole, specialists } from "../../../lib/hero";
import styles from "../../site.module.scss";

async function savePhoto(data: FormData) {
  "use server";
  if (!await authorized()) redirect("/admin");
  const role = String(data.get("role") ?? "");
  const file = data.get("photo");
  const limit = 300 * 1024;
  if (file instanceof File && file.size > limit) redirect("/admin/hero?status=too-large");
  if (!isHeroRole(role) || !(file instanceof File) || !file.size) {
    redirect("/admin/hero?status=invalid");
  }
  let photo: Buffer;
  try {
    const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25_000_000 });
    const { format } = await image.metadata();
    if (format !== "jpeg" && format !== "png" && format !== "webp") throw new Error("Unsupported format");
    photo = await image.rotate().resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
  } catch {
    redirect("/admin/hero?status=invalid");
  }

  const temporary = join(heroDirectory, randomUUID() + ".tmp");
  try {
    await mkdir(heroDirectory, { recursive: true });
    await writeFile(temporary, photo, { flag: "wx" });
    await rename(temporary, join(heroDirectory, role + ".webp"));
  } catch {
    redirect("/admin/hero?status=failed");
  } finally {
    await rm(temporary, { force: true }).catch(() => {});
  }
  redirect("/admin/hero?status=saved");
}

export default async function HeroAdmin({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!await authorized()) redirect("/admin");
  const { status } = await searchParams;
  return <main className={styles.content}>
    <h1>Фото на главной</h1>
    <p>Загрузите JPEG, PNG или WebP размером до 300 КБ.</p>
    {status === "too-large" && <p role="alert">Фото должно быть не больше 300 КБ.</p>}
    {status === "saved" && <p role="status">Фото сохранено.</p>}
    {status === "invalid" && <p role="alert">Проверьте формат и размер изображения.</p>}
    {status === "failed" && <p role="alert">Не удалось сохранить фото. Попробуйте ещё раз.</p>}
    {Object.entries(specialists).map(([role, specialist]) => <section key={role}>
      <h2>{specialist.title}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/hero/${role}`} width={160} height={160} style={{ objectFit: "cover" }} alt={specialist.name} />
      <form action={savePhoto} className={styles.form}>
        <input type="hidden" name="role" value={role} />
        <label>Новое фото<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required /></label>
        <button>Заменить фото</button>
      </form>
    </section>)}
  </main>;
}
