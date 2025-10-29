"use server";
import getBlackoutsByID from "@/services/getBlackoutsByID";
import { notFound } from "next/navigation";
import { initMocksServer } from "@/mocks/server";
import { BlackoutByID } from "@/types/Blackout";

export default async function BlackoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    initMocksServer();
    const info = await getBlackoutsByID(id);
    const typesText = new Map([
      ["electricity", "⚡ Отключение света"],
      ["cold_water", "❄️💧 Отключение холодной воды"],
      ["hot_water", "🔥💧 Отключение горячей воды"],
      ["heat", "🔥 Отключение отопления"],
    ]);
    return (
      <div>
        <p>vdfvs</p>
        <h1>
          <span className="address">{info.address}</span> Отключения
        </h1>
        {info.blackouts.map((el, i) => (
          <div key={i}>
            <h3>{typesText.get(el.type)}</h3>
            <p>{el.description}</p>
          </div>
        ))}
      </div>
    );
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      notFound();
    }
    throw error; // для других ошибок ― пробрасываем дальше
  }
}
