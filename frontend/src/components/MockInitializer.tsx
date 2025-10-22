"use client";

import { useEffect, useState } from "react";
import { startWorker } from "@/mocks/browser.js";
export function MockInitializer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMockReady, setMockReady] = useState(false);

  useEffect(() => {
    async function initializeMocks() {
      if (process.env.NODE_ENV === "development") {
        await startWorker();
        console.info("[MSW] Worker started and ready to intercept requests.");
      }
      setMockReady(true);
    }
    initializeMocks();
  }, []);
  if (!isMockReady) {
    return <div>Loading mocks...</div>;
  }
  return <>{children}</>;
}
