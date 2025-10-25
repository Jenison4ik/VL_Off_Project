"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initReactify } from "../services/initYandexMap";
import type { YMapLocationRequest } from "ymaps3";
import style from "../app/YMap.module.css";
import BlackoutMarker from "@/components/BlackoutMarker";
// === Типы ===
import { Blackout, BlackoutByBuilding } from "@/types/Blackout";
import getBlackouts from "@/services/getBlackouts";
import convertBlackouts from "@/utils/convertBlackouts";

type Evt = { type: "closeAll" } | { type: "closeExcept"; id: string };

// === Утилита для событий ===
function createEmitter() {
  const subs = new Set<(e: Evt) => void>();

  return {
    subscribe(fn: (e: Evt) => void) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
    publish(e: Evt) {
      subs.forEach((fn) => {
        try {
          fn(e);
        } catch (err) {
          console.error("Emitter handler error:", err);
        }
      });
    },
  };
}

// === Основной компонент карты ===
export default function YandexMap() {
  // --- refs и состояния ---
  const mapRef = useRef<any>(null);
  const emitterRef = useRef(createEmitter());
  const lastInteractionRef = useRef<{
    type: "marker" | "map" | null;
    ts: number;
    id?: string;
  }>({
    type: null,
    ts: 0,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [markerComponent, setMarkerComponent] = useState<any>(null);
  const [zoomControl, setZoomControl] = useState<any>(null);
  const [blackouts, setBlackouts] = useState<BlackoutByBuilding[]>([]);

  const LOCATION: YMapLocationRequest = {
    center: [131.884293, 43.119515],
    zoom: 13,
  };

  // === Хелпер для записи интеракций ===
  const recordInteraction = useCallback(
    (type: "marker" | "map", id?: string) => {
      lastInteractionRef.current = { type, ts: Date.now(), id };
    },
    []
  );

  // === Инициализация карты и UI-модулей ===
  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const reactify = await initReactify();
        if (!mounted) return;

        const components = reactify.module(window.ymaps3);
        setMapComponents(components);

        // Подключаем тему UI
        window.ymaps3.import.registerCdn(
          "https://cdn.jsdelivr.net/npm/{package}",
          "@yandex/ymaps3-default-ui-theme@latest"
        );
        const themeModule = await window.ymaps3.import(
          "@yandex/ymaps3-default-ui-theme"
        );

        const { YMapDefaultMarker, YMapZoomControl } =
          reactify.module(themeModule);
        setMarkerComponent(() => YMapDefaultMarker);
        setZoomControl(() => YMapZoomControl);

        // Слушатель fullscreen
        const handleFullscreenChange = () => {
          setIsFullscreen(Boolean(document.fullscreenElement));
          mapRef.current?.container?.fitToViewport?.();
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        cleanup = () =>
          document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
          );
      } catch (err: any) {
        if (mounted) setError(err.message || "Ошибка во время загрузки карты");
      }
    })();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, []);

  // === Загрузка данных точек ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("api/v1/blackouts");
        if (!res.ok) throw new Error("Ошибка загрузки данных");

        const blackouts = await getBlackouts();
        const blackoutsByBuilding = convertBlackouts(blackouts);
        setBlackouts(blackoutsByBuilding);
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить точки");
      }
    })();
  }, []);

  // === Переключение fullscreen ===
  const toggleFullscreen = useCallback(() => {
    if (!mapRef.current?.container) return;

    try {
      if (isFullscreen) document.exitFullscreen();
      else mapRef.current.container.requestFullscreen();
    } catch (err: any) {
      setError(err.message || "Ошибка при переходе в fullscreen");
    }
  }, [isFullscreen]);

  // === Обработка клика по карте ===
  const onMapClick = useCallback(
    (e: Event) => {
      const last = lastInteractionRef.current;
      const now = Date.now();

      // Если только что был клик по маркеру — игнорируем
      if (last.type === "marker" && now - last.ts < 100) {
        recordInteraction("map");
        return;
      }

      emitterRef.current.publish({ type: "closeAll" });
      recordInteraction("map");
    },
    [recordInteraction]
  );

  // === Обработка ошибок и состояния ===
  if (error) {
    return (
      <div
        className={style.map}
        style={{ border: "1px solid red", padding: 16 }}
      >
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!mapComponents || !markerComponent || !zoomControl) {
    return <div>Загрузка карты...</div>;
  }

  // === Деструктурируем компоненты карты ===
  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapControls,
    YMapControl,
    YMapDefaultFeaturesLayer,
    YMapListener,
  } = mapComponents;

  const YMapZoomControl = zoomControl;
  let counter = 0;
  // === Рендер карты ===
  return (
    <div
      className={style.map}
      style={{
        width: "100%",
        height: isFullscreen ? "100vh" : "500px",
        position: isFullscreen ? "fixed" : "relative",
        top: 0,
        left: 0,
        zIndex: isFullscreen ? 9999 : 1,
      }}
    >
      <YMap location={LOCATION} zoomRange={{ min: 12, max: 20 }} ref={mapRef}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        {/* --- Маркеры --- */}
        {blackouts.map((b, i) => {
          try {
            const id = `${i}`;
            return (
              <BlackoutMarker
                key={id}
                id={id}
                data={b}
                Marker={markerComponent}
                emitter={emitterRef.current}
                recordInteraction={(id: string) =>
                  recordInteraction("marker", id)
                }
              />
            );
          } catch (error) {
            console.error("Error rendering blackout marker:", error);
            return null;
          }
        })}

        {/* --- Кнопки управления --- */}
        <YMapControls position="top right">
          <YMapControl>
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`button ${isFullscreen ? "exit-fullscreen" : "fullscreen"}`}
              title={isFullscreen ? "Выйти из полного экрана" : "На весь экран"}
            >
              {isFullscreen ? "⤡" : "⤢"}
            </button>
          </YMapControl>
        </YMapControls>

        <YMapControls position="left">
          <YMapZoomControl />
        </YMapControls>

        {/* --- Обработчик кликов по карте --- */}
        <YMapListener onClick={onMapClick} />
      </YMap>
    </div>
  );
}
