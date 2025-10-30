import styles from "./page.module.scss";
import YMap from "../components/map/YMap";
import { MockInitializer } from "@/components/MockInitializer";
import PreferAddressLink from "@/components/PreferAddsressLink";
import Search from "@/components/Search";

export async function generateMetadata() {
  return {
    title: {
      default: "VL Off Отключения",
      template: "%s || VL Off Отключения",
    },
  };
}

export default async function Home() {
  return (
    <>
      <header className={`${styles.header}`}>
        <a href="/">Главная</a>
        <h1 className={` ${styles.title}`}>
          Коммунальные услуги во Владивостоке
        </h1>
        <MockInitializer>
          <Search />
        </MockInitializer>
      </header>
      <div className={`${styles.content}`}>
        <MockInitializer>
          <PreferAddressLink />
          <YMap />
        </MockInitializer>
      </div>
    </>
  );
}
