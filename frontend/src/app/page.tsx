"use server";
import Image from "next/image";
import styles from "./page.module.css";
import YMap from "../components/map/YMap";
import { MockInitializer } from "@/components/MockInitializer";

export default async function Home() {
  return (
    <>
      <h1>Привет</h1>
      <MockInitializer>
        <YMap />
      </MockInitializer>
      <p>
        Проект представляет собой редизайн сайта **VL-OFF** — сервиса, который
        информирует жителей Владивостока об отключениях воды, света и других
        коммунальных услуг. Цель проекта — улучшить пользовательский опыт за
        счёт обновлённого интерфейса, удобной навигации и современной визуальной
        концепции, сохранив при этом основную функциональность и актуальность
        данных.
      </p>
    </>
  );
}
