import { BlackoutByID } from "@/types/Blackout";
import getServerUrl from "@/services/getServerUrl";
import { cache } from "react";

//cache, потому что вызываем и для странмцы и для metadata см. https://nextjs.org/docs/app/getting-started/metadata-and-og-images#streaming-metadata
export default cache(async (id: string): Promise<BlackoutByID> => {
  const { baseUrl, isServer } = getServerUrl();
  let data: Response;
  if (isServer) {
    data = await fetch("http://" + baseUrl + "/api/v1/blackouts/" + id, {
      redirect: "follow",
      // контроль кэширования
      next: { revalidate: 60 },
    });
  } else {
    data = await fetch("/api/v1/blackouts/" + id, {
      redirect: "follow",
      // контроль кэширования
      next: { revalidate: 60 },
    });
  }
  if (data.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!data.ok) {
    throw new Error(`Ошибка сервера: ${data.status}`);
  }
  return await data.json();
});
