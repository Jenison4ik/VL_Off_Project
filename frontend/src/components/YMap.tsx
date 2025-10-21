'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { initReactify } from '../services/yandex-map';
import type { YMapLocationRequest } from 'ymaps3';
import style from "../app/YMap.module.css"

export default function YandexMap() {
  const mapRef = useRef<any>(null);
  const [components, setComponents] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const LOCATION: YMapLocationRequest = {
    center: [131.884293, 43.119515],
    zoom: 13,
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      // Инициальзация reactify и получение компонентов карты
      const mapComponents = await initReactify();
      setComponents(mapComponents);

      const onFullscreenChange = () => {
        setIsFullscreen(Boolean(document.fullscreenElement));
      };

      // Отслеживание изменений полноэкранного режима
      document.addEventListener('fullscreenchange', onFullscreenChange);
      cleanup = () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    })();

    return () => cleanup?.();
  }, []);

  const onClickFullscreen = useCallback(() => {
    if (!mapRef.current) return;

    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      mapRef.current.container.requestFullscreen();
    }
  }, [isFullscreen]);

  if (!components) return <div>Загрузка карты...</div>;

  const { YMap, YMapDefaultSchemeLayer, YMapControls, YMapControl, YMapDefaultFeaturesLayer } = components;

  return (
    <div className={style.map} style={isFullscreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 } : { width: '700px', height: '500px' }}>
      <YMap
        location={LOCATION}
        zoomRange={{ min: 12, max: 16 }}
        ref={mapRef}
        style={{ width: '100%', height: '100%', border: isFullscreen ? '2px solid red' : 'none' }}
      >
        {/* Слой карты */}
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        {/* Контролы */}
        <YMapControls position="top right">
          <YMapControl>
            <button
              type="button"
              onClick={onClickFullscreen}
              className={`button ${isFullscreen ? 'exit-fullscreen' : 'fullscreen'}`}
            >
              {isFullscreen ? '⤡' : '⤢'}
            </button>
          </YMapControl>
        </YMapControls>
      </YMap>
    </div>
  );
}
