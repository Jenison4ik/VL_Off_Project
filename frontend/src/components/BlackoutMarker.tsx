"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { mixColors } from "@/utils/colorUtils";
import type { BlackoutByBuilding } from "@/types/Blackout";

/**
 * Тип событий для emitter'а маркеров.
 */
type EmitterEvent = { type: "closeAll" } | { type: "closeExcept"; id: string };

/**
 * Пропсы компонента BlackoutMarker.
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
 * Компонент маркера отключений на карте.
 * Отображает цветной маркер с popup'ом, в котором указаны типы и описания отключений.
 */
export default function BlackoutMarker({
  id,
  data,
  Marker,
  emitter,
  recordInteraction,
}: BlackoutMarkerProps) {
  const [open, setOpen] = useState(false);

  /** Цвета по типам отключений */
  const colorByType: Record<string, string> = {
    electricity: "#f7a500",
    cold_water: "#0a12f5",
    hot_water: "#0a12f5",
    heat: "#c20000",
  };

  /** Заголовки для popup'а по типам */
  const typesText = new Map([
    ["electricity", "⚡ Отключение света"],
    ["cold_water", "❄️💧 Отключение холодной воды"],
    ["hot_water", "🔥💧 Отключение горячей воды"],
    ["heat", "🔥 Отключение отопления"],
  ]);

  /**
   * Мемоизированный расчет данных для popup'а:
   * - смешанный цвет маркера
   * - список уникальных типов отключений
   * - список уникальных описаний
   */
  const { mixedColor, blackoutTypeElements, blackoutDescriptionElements } =
    useMemo(() => {
      // Уникальные типы отключений
      const uniqueTypes = Array.from(
        new Set(data.blackouts.map((b) => b.type))
      );

      // JSX для заголовков по типам
      const blackoutTypeElements = uniqueTypes.map((type, index) => (
        <strong key={type}>{typesText.get(type)}</strong>
      ));

      // Смешиваем цвета всех типов
      const mixedColor = uniqueTypes.reduce((acc, type, index) => {
        if (index === 0) return colorByType[type];
        return mixColors(acc, colorByType[type], 0.5);
      }, "");

      // Уникальные описания отключений
      const uniqueDescriptions = Array.from(
        new Set(data.blackouts.map((b) => b.description))
      );

      // JSX для описаний
      const blackoutDescriptionElements = uniqueDescriptions.map((desc, i) => (
        <span key={i}>{"— " + desc}</span>
      ));

      return { mixedColor, blackoutTypeElements, blackoutDescriptionElements };
    }, [data.blackouts]);

  /**
   * Подписка на события emitter'а.
   * Закрывает popup, если пришло событие закрытия всех или всех, кроме текущего.
   */
  useEffect(() => {
    const unsubscribe = emitter.subscribe((event) => {
      const shouldClose =
        event.type === "closeAll" ||
        (event.type === "closeExcept" && event.id !== id);

      if (shouldClose) setOpen(false);
    });

    return unsubscribe;
  }, [emitter, id]);

  /**
   * Обработчик клика по маркеру.
   * Открывает popup и уведомляет другие маркеры закрыться.
   */
  const handleMarkerClick = useCallback(
    (e?: any) => {
      setOpen(true);
      emitter.publish({ type: "closeExcept", id });
      recordInteraction(id);
      e?.originalEvent?.stopPropagation?.(); // останавливаем всплытие клика на карте
    },
    [emitter, id, recordInteraction]
  );

  /**
   * Popup-содержимое маркера.
   */
  const popupContent = (
    <div
      style={{
        padding: "6px 10px",
        background: "#fff",
        fontSize: 14,
        lineHeight: 1.4,
      }}
    >
      {blackoutTypeElements.map((el, i) => (
        <p key={`type-${i}`}>{el}</p>
      ))}
      {blackoutDescriptionElements.map((el, i) => (
        <p key={`desc-${i}`}>{el}</p>
      ))}
    </div>
  );

  /** Координаты для карты (в формате [долгота, широта]) */
  const coordinates = [
    parseFloat(data.coordinates[1]),
    parseFloat(data.coordinates[0]),
  ];

  return (
    <Marker
      onClick={handleMarkerClick}
      coordinates={coordinates}
      size="micro"
      color={{
        day: mixedColor,
        night: "#00ff00", // TODO: заменить на динамическую тему
      }}
      popup={{ show: open, content: () => popupContent }}
    />
  );
}
