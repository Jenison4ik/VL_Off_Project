import { BlackoutByID } from "@/types/Blackout";
import getServerUrl from "@/services/getServerUrl";
import { cache } from "react";

//cache, чтобы использовать и для страницы, и для metadata
export default cache(async (id: string): Promise<BlackoutByID> => {
  const { baseUrl, isServer } = getServerUrl();

  // Всегда используем HTTPS, если сервер поддерживает
  const protocol = baseUrl.startsWith("http://") ? "https://" : "";

  const url = `${protocol}${baseUrl}/api/v1/blackouts/${id}`;

  const data = await fetch(url, {
    // на сервере Next.js fetch умеет следовать редиректам
    redirect: "follow",
    // контроль кэширования
    next: { revalidate: 60 }, // обновлять кэш каждые 60 секунд
  });

  if (data.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!data.ok) {
    throw new Error(`Ошибка сервера: ${data.status}`);
  }

  return await data.json();
});
