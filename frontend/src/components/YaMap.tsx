'use client';

import { useEffect, useState } from 'react';
import type { YMapLocationRequest } from 'ymaps3';
import { initReactify } from '../services/yandex-map';

export default function YandexMap() {
  const [components, setComponents] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const mapComponents = await initReactify();
      setComponents(mapComponents);
    })();
  }, []);

  if (!components) return <div>Загрузка карты...</div>;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = components;

  const LOCATION: YMapLocationRequest = {
    center: [37.588144, 55.733842],
    zoom: 9,
  };

  return (
    <div style={{width: '600px', height: '400px'}}>
    <YMap location={LOCATION}>
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      <YMapMarker coordinates={[37.588144, 55.733842]} draggable={true}>
        <div className="p-2 bg-red-500 text-white rounded">Перетащи меня</div>
      </YMapMarker>
    </YMap>
    </div>
  );
}
