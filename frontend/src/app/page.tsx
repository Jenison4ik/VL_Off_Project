"use server";
import Image from "next/image";
import styles from "./page.module.css";
import YMap from "../components/YMap";
import Users from "../components/Users";
import { MockInitializer } from "../components/MockInitializer";
export default async function Home() {
  return (
    <>
      <h1>Привет</h1>
      <YMap />
      <MockInitializer>
        <Users />
      </MockInitializer>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta, in
        tempora. Numquam, voluptatem atque? Soluta, a qui fugit voluptate facere
        reprehenderit corrupti quidem laborum necessitatibus non voluptas
        nostrum, quisquam ab?
      </p>
    </>
  );
}
