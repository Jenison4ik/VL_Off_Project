import { setupServer } from "msw/node";
import { handlers } from "./handlers";

let server: ReturnType<typeof setupServer> | null = null;

export function initMocksServer() {
  if (process.env.NODE_ENV !== "development") return;

  if (!server) {
    server = setupServer(...handlers);
    server.listen({ onUnhandledRequest: "warn" });
    console.info("[MSW] Mock Server Node запущен.");
  }

  return server;
}
