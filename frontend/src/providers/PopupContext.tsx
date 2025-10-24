"use client";

import { createContext, useContext, useCallback, useRef } from "react";

type PopupContextType = {
  registerCloser: (fn: () => void) => void;
  closeAll: () => void;
};

const PopupContext = createContext<PopupContextType | null>(null);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const closersRef = useRef<Set<() => void>>(new Set());

  const registerCloser = useCallback((fn: () => void) => {
    closersRef.current.add(fn);
    return () => closersRef.current.delete(fn);
  }, []);

  const closeAll = useCallback(() => {
    closersRef.current.forEach((fn) => fn());
  }, []);

  return (
    <PopupContext.Provider value={{ registerCloser, closeAll }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopupContext() {
  const ctx = useContext(PopupContext);
  if (!ctx)
    throw new Error("usePopupContext must be used within PopupProvider");
  return ctx;
}
