"use client";

import { useEffect, useState, useCallback } from "react";

type Evt = { type: "closeAll" } | { type: "closeExcept"; id: string };

export default function BlackoutMarker({
  id,
  data,
  Marker,
  emitter,
  recordInteraction,
}: {
  id: string;
  data: any;
  Marker: any;
  emitter: {
    subscribe: (fn: (e: Evt) => void) => () => void;
    publish: (e: Evt) => void;
  };
  recordInteraction: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

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
      coordinates={[data.coordinates[1], data.coordinates[0]]}
      size="micro"
      color={{
        day: `${data.type === "electricity" ? "#f17126ff" : "#2696f1ff"}`,
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
