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
    let mounted = true;
    async function initializeMocks() {
      try {
        if (process.env.NODE_ENV === "development") {
          // startWorker теперь идемпотентен и конкурентно-безопасен — другие инстансы будут ждать
          await startWorker();
        }
      } catch (err) {
        console.error("[MSW] Failed to start worker:", err);
      } finally {
        if (mounted) setMockReady(true);
      }
    }
    initializeMocks();
    return () => {
      mounted = false;
    };
  }, []);
  if (!isMockReady) {
    return <div>Loading mocks...</div>;
  }
  return <>{children}</>;
}
