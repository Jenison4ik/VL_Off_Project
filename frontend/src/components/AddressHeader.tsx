"use server";

import styles from "@/app/page.module.scss";
import { MockInitializer } from "@/components/MockInitializer";
import Search from "@/components/Search";
import PreferAddress from "@/components/PreferAddressBtn";

export default async function AddressHeader({
  titleProp,
  id,
}: {
  titleProp: string;
  id: string;
}) {
  return (
    <header className={styles.header}>
      <div className={`${styles.content}`}>
        <a href="/">
          <img src="/logo.svg" alt="VL RU" />
        </a>

        <h1 className={styles.title}>
          Коммунальные услуги по адресу <br />
          {titleProp}
        </h1>
        <PreferAddress id={id} />
      </div>
    </header>
  );
}
