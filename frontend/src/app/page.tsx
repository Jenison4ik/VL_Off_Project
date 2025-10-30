import styles from "./page.module.scss";
import YMap from "../components/map/YMap";
import { MockInitializer } from "@/components/MockInitializer";
import PreferAddressLink from "@/components/PreferAddsressLink";
import MainHeader from "@/components/MainHeader";

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
      <MainHeader />
      <div className={styles.content}>
        <MockInitializer>
          <PreferAddressLink />
          <YMap />
        </MockInitializer>
      </div>
    </>
  );
}
