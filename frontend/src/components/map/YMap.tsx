"use client";
//Стоило бы сделать декомпозицию
import { useEffect, useRef, useState, useCallback } from "react";
import { initReactify } from "@/services/initYandexMap";
import type { YMapLocationRequest } from "ymaps3";
import style from "@/components/map/YMap.module.css";
import BlackoutMarker from "@/components/map/BlackoutMarker";
import { BlackoutByBuilding } from "@/types/Blackout";
import getBlackouts from "@/services/getBlackouts";
import convertBlackouts from "@/utils/convertBlackouts";
import MapLoading from "@/components/map/MapLoading";
import MapError from "@/components/map/MapError";

type Evt = { type: "closeAll" } | { type: "closeExcept"; id: string };

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

export default function YandexMap() {
  const mapRef = useRef<any>(null);
  const emitterRef = useRef(createEmitter());
  const lastInteractionRef = useRef<{
    type: "marker" | "map" | null;
    ts: number;
    id?: string;
  }>({ type: null, ts: 0 });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [markerComponent, setMarkerComponent] = useState<any>(null);
  const [zoomControl, setZoomControl] = useState<any>(null);
  const [clusterer, setClusterer] = useState<any>(null);
  const [blackouts, setBlackouts] = useState<BlackoutByBuilding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const LOCATION: YMapLocationRequest = {
    center: [131.884293, 43.119515],
    zoom: 13,
  };

  const recordInteraction = useCallback(
    (type: "marker" | "map", id?: string) => {
      lastInteractionRef.current = { type, ts: Date.now(), id };
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      const reactify = await initReactify();
      if (!mounted) return;

      const components = reactify.module(window.ymaps3);
      setMapComponents(components);

      window.ymaps3.import.registerCdn(
        "https://cdn.jsdelivr.net/npm/{package}",
        "@yandex/ymaps3-clusterer@0.0.1"
      );
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

      const clusterModule = reactify.module(
        await ymaps3.import("@yandex/ymaps3-clusterer@0.0.1")
      );
      setClusterer(clusterModule);
    };

    const loadData = async () => {
      const data = await getBlackouts();
      if (!mounted) return;
      setBlackouts(convertBlackouts(data));
    };

    setIsLoading(true);

    (async () => {
      try {
        // Выполняем параллельно
        await Promise.all([initMap(), loadData()]);

        // После загрузки подписываем fullscreen
        const handleFullscreenChange = () => {
          setIsFullscreen(Boolean(document.fullscreenElement));
          mapRef.current?.container?.fitToViewport?.();
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () =>
          document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
          );
      } catch (err: any) {
        if (mounted)
          setError(err.message || "Ошибка загрузки карты или данных");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!mapRef.current?.container) return;
    try {
      if (isFullscreen) document.exitFullscreen();
      else mapRef.current.container.requestFullscreen();
    } catch (err: any) {
      setError(err.message || "Ошибка fullscreen");
    }
  }, [isFullscreen]);

  const onMapClick = useCallback(() => {
    const last = lastInteractionRef.current;
    const now = Date.now();
    if (last.type === "marker" && now - last.ts < 100) return;
    emitterRef.current.publish({ type: "closeAll" });
    recordInteraction("map");
  }, [recordInteraction]);

  // === Состояния ===
  if (error) {
    return <MapError />;
  }
  if (isLoading) {
    return <MapLoading />;
  }

  // === Извлекаем компоненты карты ===
  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapControls,
    YMapControl,
    YMapListener,
    YMapMarker,
  } = mapComponents;
  const { YMapClusterer, clusterByGrid } = clusterer;
  const YMapZoomControl = zoomControl;

  // === Подготовка данных для кластерера ===
  const features = blackouts.map((b, i) => ({
    type: "Feature",
    id: i,
    geometry: {
      type: "Point",
      coordinates: [parseFloat(b.coordinates[1]), parseFloat(b.coordinates[0])],
    },
    properties: { blackout: b },
  }));

  // === Рендер маркера ===
  const renderMarker = (feature: any) => {
    const blackoutData = feature.properties.blackout;
    const id = String(feature.id);
    return (
      <BlackoutMarker
        key={id}
        id={id}
        data={blackoutData}
        Marker={markerComponent}
        emitter={emitterRef.current}
        recordInteraction={(id: string) => recordInteraction("marker", id)}
      />
    );
  };

  // === Рендер кластера ===
  const renderCluster = (coordinates: [number, number], features: any[]) => {
    const handleClusterClick = () => {
      if (!mapRef.current) return;
      const map = mapRef.current;
      const currentZoom = map.zoom || 13;
      map.update({
        location: { center: coordinates, zoom: Math.min(currentZoom + 2, 20) },
        duration: 300,
      });
    };
    return (
      <YMapMarker coordinates={coordinates} onClick={handleClusterClick}>
        <div className={style.cluster}>{features.length}</div>
      </YMapMarker>
    );
  };

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
        <YMapClusterer
          marker={renderMarker}
          cluster={renderCluster}
          method={clusterByGrid({ gridSize: 64 })}
          features={features}
        />
        <YMapControls position="top right">
          <YMapControl>
            {typeof window !== "undefined" && window.innerWidth > 768 && (
              <button
                onClick={toggleFullscreen}
                title="Полный экран"
                className={`${style.fullscreenbtn}`}
              >
                {isFullscreen ? "⤡" : "⤢"}
              </button>
            )}
          </YMapControl>
        </YMapControls>
        <YMapControls position="left">
          {typeof window !== "undefined" && window.innerWidth > 768 && (
            <YMapZoomControl />
          )}
        </YMapControls>
        <YMapListener onClick={onMapClick} />
      </YMap>
    </div>
  );
}
