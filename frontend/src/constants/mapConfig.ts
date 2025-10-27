import type { YMapLocationRequest } from "ymaps3";

export const MAP_CONFIG = {
  LOCATION: {
    center: [131.884293, 43.119515] as [number, number],
    zoom: 13,
  } as YMapLocationRequest,
  ZOOM_RANGE: {
    min: 12,
    max: 20,
  },
  CLUSTER_GRID_SIZE: 64,
  INTERACTION_DELAY: 100, // мс
  ZOOM_INCREMENT: 2,
  ANIMATION_DURATION: 300,
} as const;

export const MAP_STYLES = {
  FULLSCREEN: {
    width: "100%",
    height: "100vh",
    position: "fixed" as const,
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  NORMAL: {
    width: "100%",
    height: "500px",
    position: "relative" as const,
    top: 0,
    left: 0,
    zIndex: 1,
  },
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
} as const;
