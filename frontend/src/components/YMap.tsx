"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initReactify } from "../services/initYandexMap";
import type { YMapLocationRequest } from "ymaps3";
import style from "../app/YMap.module.css";

export default function YandexMap() {
  const mapRef = useRef<any>(null);
  const [components, setComponents] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // начальное положение карты
  const LOCATION: YMapLocationRequest = {
    center: [131.884293, 43.119515],
    zoom: 13,
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let mounted = true;

    (async () => {
      try {
        const mapComponents = await initReactify();
        if (!mounted) return;

        setComponents(mapComponents);

        // обработчик изменения fullscreen
        const onFullscreenChange = () => {
          const isFs = Boolean(document.fullscreenElement);
          setIsFullscreen(isFs);

          // пересчитывание карты
          if (mapRef.current?.container?.fitToViewport) {
            mapRef.current.container.fitToViewport();
          }
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

  // переключение полноэкранного режима
  const onClickFullscreen = useCallback(() => {
    try {
      if (!mapRef.current?.container) return;

      if (isFullscreen) {
        document.exitFullscreen();
      } else {
        mapRef.current.container.requestFullscreen();
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при переходе в полноэкранный режим");
    }
  }, [isFullscreen]);

  // ошибка
  if (error) {
    return (
      <div
        className={style.map}
        style={{
          width: "700px",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid red",
        }}
      >
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
      </div>
    );
  }

  // пока карта не инициализирована
  if (!components) return <div>Загрузка карты...</div>;

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapControls,
    YMapControl,
    YMapDefaultFeaturesLayer,
  } = components;

  return (
    <div
      className={style.map}
      style={{
        width: "100%",
        height: isFullscreen ? "100vh" : "500px",
        margin: 0,
        padding: 0,
        position: isFullscreen ? "fixed" : "relative",
        top: isFullscreen ? 0 : undefined,
        left: isFullscreen ? 0 : undefined,
        zIndex: isFullscreen ? 9999 : 1,
      }}
    >
      <YMap
        location={LOCATION}
        zoomRange={{ min: 12, max: 16 }}
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
      >
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        {/* контролы */}
        <YMapControls position="top right">
          <YMapControl>
            <button
              type="button"
              onClick={onClickFullscreen}
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
