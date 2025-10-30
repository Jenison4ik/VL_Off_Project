"use client";

import styles from "@/app/page.module.scss";
import { MockInitializer } from "@/components/MockInitializer";
import Search from "@/components/Search";

export default function MainHeader() {
  return (
    <header className={styles.header}>
      <div className={`${styles.content}`}>
        <a href="/">
          <img src="/logo.svg" alt="VL RU" />
        </a>

        <h1 className={styles.title}>Коммунальные услуги во Владивостоке</h1>

        <MockInitializer>
          <Search />
        </MockInitializer>
      </div>
    </header>
  );
}
