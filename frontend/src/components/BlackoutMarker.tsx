"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { mixColors } from "@/utils/colorUtils";
import type { BlackoutByBuilding } from "@/types/Blackout";

/**
 * Тип событий для эмиттера
 */
type EmitterEvent = { type: "closeAll" } | { type: "closeExcept"; id: string };

/**
 * Интерфейс пропсов компонента BlackoutMarker
 */
interface BlackoutMarkerProps {
  id: string;
  data: BlackoutByBuilding;
  Marker: React.ComponentType<any>;
  emitter: {
    subscribe: (fn: (e: EmitterEvent) => void) => () => void;
    publish: (e: EmitterEvent) => void;
  };
  recordInteraction: (id: string) => void;
}

/**
 * Компонент отображает маркер на карте с popup'ом об отключениях
 */
export default function BlackoutMarker({
  id,
  data,
  Marker,
  emitter,
  recordInteraction,
}: BlackoutMarkerProps) {
  const [open, setOpen] = useState(false);

  // Цвета по типу отключения
  const colorByType = {
    electricity: "#f5841b",
    cold_water: "#0a12f5",
    hot_water: "#f50a0a",
    heat: "#0af531",
  };

  // Текст для popup'а по типу
  const typesText = new Map([
    ["electricity", "⚡ Отключение света"],
    ["cold_water", "❄️💧 Отключение холодной воды"],
    ["hot_water", "🔥💧 Отключение горячей воды"],
    ["heat", "🔥 Отключение отопления"],
  ]);

  /**
   * Вычисляем итоговый цвет маркера и элементы описания отключений.
   * Мемоизация нужна, чтобы не пересчитывать при каждом рендере.
   */
  const { mixedColor, blackoutElements, blackoutText } = useMemo(() => {
    const types = data.blackouts.map((item) => item.type);

    // Генерация списка описаний отключений
    const blackoutElements = data.blackouts.map((item, index) => (
      <strong key={`${item.type}-${index}`}>{typesText.get(item.type)}</strong>
    ));

    // Смешиваем цвета всех типов отключений
    let mixedColor = colorByType[types[0]];
    for (let i = 1; i < types.length; i++) {
      mixedColor = mixColors(mixedColor, colorByType[types[i]], 0.5);
    }

    const blackoutText = data.blackouts.map((item, index) => {
      return (
        <span key={`${item.type}-${index}`}>{"—  " + item.description}</span>
      );
    });

    return { mixedColor, blackoutElements, blackoutText };
  }, [data.blackouts]);

  /**
   * Подписка на события emitter'а: закрытие popup'ов других маркеров.
   */
  useEffect(() => {
    const unsubscribe = emitter.subscribe((event) => {
      if (
        event.type === "closeAll" ||
        (event.type === "closeExcept" && event.id !== id)
      ) {
        setOpen(false);
      }
    });
    return unsubscribe;
  }, [emitter, id]);

  /**
   * Обработчик клика по маркеру.
   * Открывает popup и сообщает другим маркерам закрыться.
   */
  const handleMarkerClick = useCallback(
    (e?: any) => {
      setOpen(true);
      emitter.publish({ type: "closeExcept", id });
      recordInteraction(id);

      // Если это событие карты — остановим всплытие
      e?.originalEvent?.stopPropagation?.();
    },
    [emitter, id, recordInteraction]
  );

  return (
    <Marker
      onClick={handleMarkerClick}
      coordinates={[
        parseFloat(data.coordinates[1]),
        parseFloat(data.coordinates[0]),
      ]}
      size="micro"
      color={{
        day: mixedColor,
        night: "#00ff00", // можно позже заменить на динамическую тему
      }}
      popup={{
        show: open,
        content: () => (
          <div
            style={{
              padding: "6px 10px",
              background: "#fff",
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {blackoutElements.map((el, i) => (
              <p key={i}>{el}</p>
            ))}
            <div>
              {blackoutText.map((el, i) => {
                console.log(1);
                return <p key={i}>{el}</p>;
              })}
            </div>
          </div>
        ),
      }}
    />
  );
}
