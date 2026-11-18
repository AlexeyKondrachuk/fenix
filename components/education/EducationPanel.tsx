import ProfileIcon from "../icons/ProfileIcon";
import EducationTimeline from "./EducationTimeline";
import styles from "./EducationPanel.module.scss";

type EducationPanelProps = {
  title: string;
  items: string[];
  theme?: "gold" | "peach";
  id?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
};

export default function EducationPanel({
  title,
  items,
  theme = "gold",
  id,
  headingLevel: Heading = "h2",
  className = "",
}: EducationPanelProps) {
  return <section id={id} className={`${styles.panel} ${theme === "peach" ? styles.peach : ""} ${className}`} aria-label={title}>
    <Heading className={styles.heading}><ProfileIcon name="degree" /><span>{title}</span></Heading>
    <EducationTimeline items={items} />
  </section>;
}
