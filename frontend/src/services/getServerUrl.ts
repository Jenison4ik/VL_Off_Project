// Получение server url и определение среды выполнения
export default function getServerUrl() {
  const isServer = typeof window === "undefined";
  let baseUrl = "";

  if (isServer) {
    // Внутри Docker контейнера используем внутренний адрес nginx
    // Если INTERNAL_API_URL установлена, используем её (для Docker)
    const internalApiUrl = process.env.INTERNAL_API_URL;
    if (internalApiUrl) {
      baseUrl = internalApiUrl;
    } else if (process.env.NODE_ENV === "development") {
      baseUrl = "localhost:3000";
    } else {
      baseUrl = process.env.NEXT_PUBLIC_HOST_NAME as string;
      if (!baseUrl) {
        throw new Error(
          "Переменная окружения NEXT_PUBLIC_HOST_NAME не установлена!"
        );
      }
    }
  }

  return { baseUrl, isServer };
}
