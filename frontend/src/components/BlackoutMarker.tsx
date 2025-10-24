"use client";

import { useState } from "react";

export default function BlackoutMarker({ data, Marker }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = (e: MouseEvent) => {
    console.log(e);
    e.stopPropagation(); // предотвратить клик по карте
    setIsOpen((prev) => !prev);
  };
  return (
    <Marker
      onClick={togglePopup}
      coordinates={[data.coordinates[1], data.coordinates[0]]}
      size="small"
      color={{
        day: `${data.type === "electricity" ? "#d33123ff" : "#353ad4ff"}`,
        night: "#00ff00",
      }}
      popup={{
        show: isOpen,
        content: () => (
          <div
            style={{
              padding: "6px 10px",
              background: "#fff",
              borderRadius: 8,
              //   boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              fontSize: 14,
            }}
          >
            <strong>
              {data.type === "electricity"
                ? "⚡ Отключение света"
                : "💧 Отключение воды"}
            </strong>
            <p>{data.description}</p>
          </div>
        ),
      }}
    />
  );
}
