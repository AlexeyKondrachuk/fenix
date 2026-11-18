import Image from "next/image";
import MobileMenu from "./MobileMenu";
import Contacts from "./Contacts";
import Logo from "./Logo";
import Menu from "./Menu";
import StickyMenu from "./StickyMenu";
import MenuIcon from "../icons/MenuIcon";
import MobileTopMenu from "./MobileTopMenu";
import { getContacts } from "../../lib/site";
import styles from "./Header.module.scss";

export default async function Header() {
  const contacts = await getContacts();
  return <>
    <header className={styles.header}>
      <Image className={styles.neurons} src="/brand/header-neurons.png" alt=""
        width={1280} height={100} loading="eager" fetchPriority="high" unoptimized />
      <div className={styles.inner}>
        <p className={styles.tagline}><span>Создаём персональное пространство для ваших изменений</span></p>
        <div className={styles.identity}>
          <Logo />
          <div className={styles.location}>
            <strong><MenuIcon name="pin" />Тольятти</strong>
            <ul aria-label="Форматы встреч">
              <li><MenuIcon name="child" />Очно</li>
              <li><MenuIcon name="laptop" />Онлайн</li>
            </ul>
          </div>
          <MobileTopMenu contacts={contacts} />
          <Contacts />
        </div>
      </div>
    </header>
    <StickyMenu contacts={<Contacts compact />}><Menu /></StickyMenu>
    <MobileMenu />
  </>;
}
