import { BlackoutByID } from "@/types/Blackout";
import getServerUrl from "@/services/getServerUrl";

export default async function getBlackoutsByID(
  id: string
): Promise<BlackoutByID> {
  const { baseUrl, isServer } = getServerUrl();

  const data = await fetch(baseUrl + "/api/v1/blackouts/" + id);
  if (data.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!data.ok) {
    throw new Error(`Ошибка сервера: ${data.status}`);
  }
  return await data.json();
}
