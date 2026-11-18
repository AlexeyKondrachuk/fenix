import { getEducation } from "../../lib/education";
import Image from "next/image";
import ProfileIcon from "../icons/ProfileIcon";
import EducationPanel from "../education/EducationPanel";
import styles from "./EducationSection.module.scss";

const badges = [
  { file: "ifs", description: "IFS — терапия внутренних семейных систем" },
  { file: "emdr", description: "EMDR Europe — европейская ассоциация EMDR" },
  { file: "institute", description: "Институт психотерапии" },
  { file: "emdr-online", description: "EMDRIA — международная ассоциация EMDR" },
  { file: "e1", description: "Профессиональное образование в психотерапии" },
];

export default async function EducationSection() {
  const education = await getEducation();
  return <section id="education" className={styles.section} aria-labelledby="education-title">
    <div className={styles.intro}>
      <div className={styles.motif} aria-hidden="true"><ProfileIcon name="degree" /><span /></div>
      <h2 id="education-title">Моё образование<br />и экспертность</h2>
      <p>{education.description}</p>
      <ul className={styles.methods} aria-label="Образование и профессиональные подходы">
        {badges.map(({ file, description }) => <li key={file} tabIndex={0} aria-describedby={`education-badge-${file}`}>
          <Image src={`/education/${file}.webp`} alt="" width={74} height={74} />
          <span id={`education-badge-${file}`} role="tooltip" className={styles.badgeTooltip}>{description}</span>
        </li>)}
      </ul>
    </div>
    <EducationPanel title="Образование и повышение квалификации" items={education.items} headingLevel="h3" />
  </section>;
}
