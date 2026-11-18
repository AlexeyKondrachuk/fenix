import ProfileIcon from "../icons/ProfileIcon";
import ActionLink from "../ActionLink";
import PhoneIcon from "../icons/PhoneIcon";
import styles from "./ChildPsychologyDetails.module.scss";

const services = [
  { icon: "psychology", title: "Психологическая диагностика", text: "Комплексная оценка психического развития ребёнка с учётом его возраста и индивидуальных особенностей." },
  { icon: "sprout", title: "Консультации по развитию", text: "Помощь в вопросах поведения, возрастных кризисов, готовности к детскому саду и адаптации к новой обстановке." },
  { icon: "heart", title: "Поддержка родителей", text: "Консультации по детско-родительским отношениям и тренинги по семейной психологии." },
] as const;

const signals = [
  { icon: "heart", title: "Эмоции и поведение", items: ["Плаксивость, непослушание, агрессия или замкнутость", "Страхи и тревожные состояния", "Повышенная конфликтность, усиленная привязанность к маме или папе"] },
  { icon: "sprout", title: "Общение и адаптация", items: ["Трудная адаптация в детском саду или непривычном месте", "Сложности в отношениях со сверстниками и взрослыми", "Вопросы о самочувствии и частых болезнях в связи с психологическим состоянием"] },
  { icon: "shield", title: "Перемены в семье", items: ["Развод родителей", "Потеря близкого человека или другая стрессовая ситуация", "Появление нового члена семьи"] },
] as const;

const methods = ["Работа с рефлексами", "Сенсомоторная интеграция", "Метод замещающего онтогенеза", "Логопедия", "Телесно-ориентированные занятия", "Арт-терапия", "Песочная терапия", "Игровые технологии"];

export default function ChildPsychologyDetails({ phone }: { phone: string }) {
  return <div className={styles.details}>
    <section className={styles.section} aria-labelledby="child-help-title">
      <div className={styles.heading}>
        <h2 id="child-help-title">Как может помочь детский психолог</h2>
        <p>Здоровье ребёнка — первостепенная забота родителей. Консультация помогает разобраться в психологических трудностях и подобрать индивидуальный курс коррекции. Обратиться можно и с профилактической целью.</p>
      </div>
      <div className={styles.cards}>{services.map(service => <article className={styles.card} key={service.title}>
        <span className={styles.icon}><ProfileIcon name={service.icon} /></span>
        <h3>{service.title}</h3><p>{service.text}</p>
      </article>)}</div>
    </section>

    <section className={styles.section} aria-labelledby="child-signals-title">
      <div className={styles.heading}><h2 id="child-signals-title">Когда стоит обратиться</h2><p>Поводом для консультации могут стать изменения в поведении, трудности общения или переживания, с которыми ребёнку и семье сложно справиться самостоятельно.</p></div>
      <div className={styles.cards}>{signals.map(signal => <article className={styles.card} key={signal.title}>
        <span className={styles.icon}><ProfileIcon name={signal.icon} /></span>
        <h3>{signal.title}</h3><ul>{signal.items.map(item => <li key={item}>{item}</li>)}</ul>
      </article>)}</div>
    </section>

    <section className={`${styles.section} ${styles.neuro}`} aria-labelledby="child-neuro-title">
      <div className={styles.heading}>
        <span className={styles.icon}><ProfileIcon name="psychology" /></span>
        <h2 id="child-neuro-title">Детский нейропсихолог в Тольятти</h2>
        <p>Нейропсихолог изучает связь между работой мозга и психическими процессами. На диагностике специалист оценивает память, мышление, внимание и индивидуальные особенности развития ребёнка.</p>
        <p>Например, то, как музыка связана с эмоциями, а запахи — с воспоминаниями и зрительными образами, помогает понять связь органов чувств и работы мозга.</p>
      </div>
      <div className={styles.neuroReasons}>
        <h3>С какими запросами обращаются</h3>
        <ul>
          <li>Трудности с усидчивостью и удержанием внимания, гиперактивность.</li>
          <li>Неловкость движений — ребёнок часто роняет предметы или натыкается на них в знакомом помещении.</li>
          <li>Сенсомоторная алалия, РАС, СДВГ, задержка психического или психоречевого развития.</li>
        </ul>
        <p className={styles.note}>Программа подбирается индивидуально — после общения с семьёй и диагностики.</p>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="child-program-title">
      <div className={styles.heading}><h2 id="child-program-title">Программа нейропсихологической коррекции</h2><p>Занятия направлены на развитие высших психических функций и гармонизацию развития ребёнка. Работа с сенсомоторной сферой сочетается с упражнениями и игровыми методами, подобранными по результатам диагностики.</p></div>
      <dl className={styles.facts}>
        <div><dt>Продолжительность программы</dt><dd>3–9 месяцев</dd></div>
        <div><dt>Частота занятий</dt><dd>1–2 раза в неделю</dd></div>
      </dl>
      <p className={styles.caption}>Это ориентировочные сроки. Длительность и режим занятий специалист определяет для каждого ребёнка.</p>
      <h3>Методы работы</h3>
      <ul className={styles.methods}>{methods.map(method => <li key={method}><ProfileIcon name="sprout" /><span>{method}</span></li>)}</ul>
    </section>

    <section className={`${styles.section} ${styles.booking}`} aria-labelledby="child-booking-title">
      <div className={styles.heading}><h2 id="child-booking-title">Как записаться и подготовиться</h2><p>Консультации и коррекционные занятия проводятся по предварительной записи.</p></div>
      <ol className={styles.steps}>
        <li><span className={styles.icon}><ProfileIcon name="phone" /></span><div><h3>Свяжитесь с центром</h3><p>Расскажите, что вас беспокоит, и уточните порядок консультации.</p></div></li>
        <li><span className={styles.icon}><ProfileIcon name="certificate" /></span><div><h3>Подготовьте информацию</h3><p>ФИО и возраст ребёнка, описание трудностей, заключения логопеда, дефектолога или невролога, если вы уже обращались к этим специалистам.</p></div></li>
        <li><span className={styles.icon}><ProfileIcon name="psychology" /></span><div><h3>Дождитесь анализа данных</h3><p>Обработка предоставленной информации занимает около 2–3 рабочих дней. Эти данные помогут приступить к составлению индивидуальной программы.</p></div></li>
      </ol>
      <div className={styles.principles}>
        <p><ProfileIcon name="shield" /><span>Коррекционные занятия проходят без инвазивных вмешательств и медикаментов.</span></p>
        <p><ProfileIcon name="heart" /><span>Родители получают информацию о действиях специалиста и целях каждого этапа работы.</span></p>
      </div>
      <ActionLink href={`tel:${phone.replace(/[^+\d]/g, "")}`}><PhoneIcon outlined />Записаться на консультацию</ActionLink>
    </section>
  </div>;
}
