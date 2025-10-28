"use server";
import getBlackoutsByID from "@/services/getBlackoutsByID";
import { notFound } from "next/navigation";
import { initMocksServer } from "@/mocks/server";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    initMocksServer();
    const info = await getBlackoutsByID(id);
    return (
      <div>
        <h1>{info.address}</h1>
        <p>{info.blackouts[0].description}</p>
      </div>
    );
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      notFound();
    }
    throw error; // для других ошибок ― пробрасываем дальше
  }
}
