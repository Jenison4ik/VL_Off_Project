import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";

export function initMocksServer() {
  if (process.env.NODE_ENV === "development") {
    // Запускаем мок-сервер только в режиме разработки
    setupServer(...handlers).listen({
      onUnhandledRequest: "warn", // Логируем необработанные запросы
    });
    console.info("[MSW] Mock Service Worker для Node.js запущен.");
  }
}
