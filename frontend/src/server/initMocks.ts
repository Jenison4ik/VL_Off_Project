// src/server/initMocks.ts
export function initMocks() {
  if (process.env.NODE_ENV !== "development") {
    return Promise.resolve(); // ничего не делаем
  }

  if (typeof window === "undefined") {
    // Серверная среда
    return import("@/mocks/node.js").then(({ server }) => {
      server.listen();
    });
  } else {
    // Клиентская среда
    return import("@/mocks/browser.js").then(({ startWorker }) => {
      return startWorker();
    });
  }
}
