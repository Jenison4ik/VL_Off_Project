"use client";
import { ReactNode, createContext, useContext, useState } from "react";

type PopupContextType = {
  popup: boolean;
  togglePopup: () => void;
};

export const PopupContext = createContext<PopupContextType | undefined>(
  undefined
);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup((prev) => !prev);
  };

  return (
    <PopupContext.Provider value={{ popup, togglePopup }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}
