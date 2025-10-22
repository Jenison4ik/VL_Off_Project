import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

let worker: ReturnType<typeof setupWorker> | null = null;
let started = false;
let startPromise: Promise<ReturnType<typeof setupWorker>> | null = null;

export async function startWorker() {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development")
    return null; // не на сервере и только dev

  if (started && worker) {
    return worker; //Отдаём уже запущенный воркер
  }

  if (startPromise) {
    // кто-то уже запустил — ждём
    return startPromise;
  }

  if (!worker) {
    worker = setupWorker(...handlers);
  }

  startPromise = (async () => {
    try {
      // start возвращает promise — ждём его
      await worker!.start({
        onUnhandledRequest: "bypass",
      });
      started = true;
      console.info("[MSW] Mock Service Worker started.");
      return worker!;
    } finally {
      // сбрасываем промис после завершения (успех/ошибка) чтобы возможные последующие попытки могли переинициализировать
      startPromise = null;
    }
  })();

  return startPromise;
}
