// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

let worker: ReturnType<typeof setupWorker> | null = null;

export async function startWorker() {
  // if (typeof window === "undefined") return; // не на сервере
  // if (process.env.NODE_ENV !== "development") return; // только dev

  // if (!worker) {
  //   worker = setupWorker(...handlers); // создаём воркер только здесь, в браузере
  // }
  worker = setupWorker(...handlers);
  await worker.start({
    onUnhandledRequest: "bypass",
  });

  console.info("[MSW] Mock Service Worker started.");
}
