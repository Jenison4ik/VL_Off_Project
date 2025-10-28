// Получение server url и определение среды выполнения
export default function getServerUrl() {
  const isServer = typeof window === "undefined";
  let baseUrl = "";

  if (isServer) {
    if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
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
