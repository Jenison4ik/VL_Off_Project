"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initReactify } from "../services/initYandexMap";
import type { YMapLocationRequest } from "ymaps3";
import style from "../app/YMap.module.css";
import BlackoutMarker from "@/components/BlackoutMarker"; // 👈 отдельный компонент маркера

type Blackout = {
  coordinates: [number, number];
  type: string;
  description: string;
};

export default function YandexMap() {
  const mapRef = useRef<any>(null);
  const [components, setComponents] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);

  const LOCATION: YMapLocationRequest = {
    center: [131.884293, 43.119515],
    zoom: 13,
  };
  function handleMapClick(e: Event) {
    console.log(e.target);
  }
  // === Инициализация карты ===
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let mounted = true;

    (async () => {
      try {
        const reactify = await initReactify();
        if (!mounted) return;

        const mapComponents = reactify.module(window.ymaps3);
        setComponents(mapComponents);

        window.ymaps3.import.registerCdn(
          "https://cdn.jsdelivr.net/npm/{package}",
          "@yandex/ymaps3-default-ui-theme@latest"
        );

        const themeModule = await window.ymaps3.import(
          "@yandex/ymaps3-default-ui-theme"
        );
        const { YMapDefaultMarker } = reactify.module(themeModule);
        setMarker(() => YMapDefaultMarker);

        const onFullscreenChange = () => {
          setIsFullscreen(Boolean(document.fullscreenElement));
          mapRef.current?.container?.fitToViewport?.();
        };

        document.addEventListener("fullscreenchange", onFullscreenChange);
        cleanup = () =>
          document.removeEventListener("fullscreenchange", onFullscreenChange);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || "Ошибка во время загрузки карты");
      }
    })();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, []);

  // === Загрузка данных ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/blackouts");
        if (!res.ok) throw new Error("Ошибка загрузки данных");
        const data = await res.json();
        setBlackouts(data);
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить точки");
      }
    })();
  }, []);

  // === Переключение fullscreen ===
  const toggleFullscreen = useCallback(() => {
    try {
      if (!mapRef.current?.container) return;
      if (isFullscreen) document.exitFullscreen();
      else mapRef.current.container.requestFullscreen();
    } catch (err: any) {
      setError(err.message || "Ошибка при переходе в fullscreen");
    }
  }, [isFullscreen]);

  if (error)
    return (
      <div
        className={style.map}
        style={{ border: "1px solid red", padding: 16 }}
      >
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  if (!components || !Marker) return <div>Загрузка карты...</div>;

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapControls,
    YMapControl,
    YMapDefaultFeaturesLayer,
    YMapListener,
  } = components;

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
      <YMap
        location={LOCATION}
        zoomRange={{ min: 12, max: 20 }}
        ref={mapRef}
        onActionStart
      >
        <YMapDefaultSchemeLayer
          onClick={(e: Event) => {
            console.log(e.target);
          }}
        />
        <YMapDefaultFeaturesLayer />

        {/* ✅ Маркеры теперь рендерятся отдельно, без влияния на карту */}
        {blackouts.map((b, i) => (
          <BlackoutMarker key={i} data={b} Marker={Marker} />
        ))}

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
      </YMap>
    </div>
  );
}
