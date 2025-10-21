'use client';

import React from 'react';
import ReactDOM from 'react-dom';

// declare global {
//   interface Window {
//     ymaps3?: any;
//   }
// }

// Загружаем API Яндекс.Карт
export async function initReactify() {
  // Дожидаемся, пока скрипт подгрузится
  if (!window.ymaps3) {
    await new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src =
        'https://api-maps.yandex.ru/v3/?apikey=[API_KEY]=ru_RU';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  const ymaps3 = window.ymaps3;

  // Импорт reactify и ожидание готовности API
  const [ymaps3React] = await Promise.all([
    ymaps3.import('@yandex/ymaps3-reactify'),
    ymaps3.ready,
  ]);

  // Привязка React и ReactDOM
  const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

  // Возвращаем готовые компоненты
  return reactify.module(ymaps3);
}
