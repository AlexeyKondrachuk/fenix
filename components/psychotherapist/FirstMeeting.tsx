import styles from "./FirstMeeting.module.scss";

const steps = [
  { title: "Обсуждаем запрос", text: "Что беспокоит и какой помощи вы ожидаете." },
  { title: "Знакомимся с форматом", text: "Можно задать вопросы о работе и ходе консультаций." },
  { title: "Намечаем дальнейшие шаги", text: "Обсуждаем подходящий вариант терапии." },
];

export default function FirstMeeting() {
  return <section className={styles.panel} aria-labelledby="first-meeting-title">
    <h2 id="first-meeting-title">Как проходит первая встреча</h2>
    <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title} className={styles.step}>
      <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div><h3>{step.title}</h3><p>{step.text}</p></div>
    </li>)}</ol>
  </section>;
}
