import Image from "next/image";
import styles from "./page.module.css";
import YMap from "../components/YMap";

export default function Home() {
  return (
    <>
    <h1>Привет</h1>
    <YMap/>
    </>
  );
}
