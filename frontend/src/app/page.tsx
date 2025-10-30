"use server";
import Image from "next/image";
import styles from "./page.module.css";
import YMap from "../components/map/YMap";
import { MockInitializer } from "@/components/MockInitializer";
import PreferAddressLink from "@/components/PreferAddsressLink";
import { initMocksServer } from "@/mocks/server";
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
      <h1 className={`${styles.title}`}>Отключения воды и света Владивосток</h1>
      <MockInitializer>
        <Search />
        <PreferAddressLink />
        <YMap />
      </MockInitializer>
    </>
  );
}
