import styles from "./trainings.module.scss";
export default function TrainingPhotos({ photos, title }: { photos: string[]; title: string }) {
  if (!photos.length) return null;
  return <section className={styles.photos} aria-labelledby="training-photos-title"><h2 id="training-photos-title">Фотографии</h2><div>{photos.map((file, index) => <a key={`${file}-${index}`} href={`/api/training-images/${file}`} target="_blank" rel="noopener noreferrer" aria-label={`Открыть фото ${index + 1}: ${title}`}><img src={`/api/training-images/${file}`} alt={`${title} — фото ${index + 1}`} loading="lazy" /></a>)}</div></section>;
}
