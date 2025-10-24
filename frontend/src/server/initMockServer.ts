import { server } from "@/mocks/node";

export function initMocksServer() {
  if (process.env.NODE_ENV === "development") {
    // Запускаем мок-сервер только в режиме разработки
    server.listen({
      onUnhandledRequest: "warn", // Логируем необработанные запросы
    });
    console.info("[MSW] Mock Service Worker для Node.js запущен.");
  }
}
