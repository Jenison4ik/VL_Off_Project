"use client";

import { Blackout, BlackoutByBuilding } from "@/types/Blackout";
import { useEffect, useState, useCallback } from "react";
import { mixColors } from "@/utils/colorUtils";

type Evt = { type: "closeAll" } | { type: "closeExcept"; id: string };

export default function BlackoutMarker({
  id,
  data,
  Marker,
  emitter,
  recordInteraction,
}: {
  id: string;
  data: BlackoutByBuilding;
  Marker: any;
  emitter: {
    subscribe: (fn: (e: Evt) => void) => () => void;
    publish: (e: Evt) => void;
  };
  recordInteraction: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const colorByType = {
    electricity: "#f5841b",
    cold_water: "#0a12f5",
    hot_water: "#f50a0a",
    heat: "#0af531",
  };
  useEffect(() => {
    const types = data.blackouts.map((item, index) => {
      return item.type;
    });
    let color = colorByType[types[0]];
    types.forEach((element, index) => {
      color = mixColors(color, colorByType[element], 0.5);
    });
    setColor(color);
  });
  useEffect(() => {
    const unsub = emitter.subscribe((e) => {
      if (e.type === "closeAll") {
        setOpen(false);
      } else if (e.type === "closeExcept") {
        if (e.id !== id) setOpen(false);
      }
    });
    return unsub;
  }, [emitter, id]);

  const onMarkerClick = useCallback(
    (e?: any) => {
      // открываем себя и просим закрыть остальные
      setOpen(true);
      emitter.publish({ type: "closeExcept", id });
      recordInteraction(id);
      // при необходимости остановите всплытие ymaps-события, если доступно:
      try {
        e?.originalEvent?.stopPropagation?.();
      } catch {}
    },
    [emitter, id, recordInteraction]
  );
  return (
    <Marker
      // style={{
      //   boxShadow: "none",
      //   outline: "none",
      //   border:
      // }}
      onClick={onMarkerClick}
      coordinates={[
        parseFloat(data.coordinates[1]),
        parseFloat(data.coordinates[0]),
      ]}
      size="micro"
      color={{
        day: `${color}`,
        night: "#00ff00",
      }}
      popup={{
        show: open,
        content: () => (
          <div
            style={{
              padding: "6px 10px",
              background: "#fff",
              //   boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              fontSize: 14,
            }}
          >
            <strong>
              {data.blackouts[0].type === "electricity"
                ? "⚡ Отключение света"
                : "💧 Отключение воды"}
            </strong>
            <p>{data.blackouts[0].description}</p>
          </div>
        ),
      }}
    />
  );
}
