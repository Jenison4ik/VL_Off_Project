import { BlackoutByBuilding } from "@/types/Blackout";
import { MAP_CONFIG, BREAKPOINTS } from "@/constants/mapConfig";

export function prepareFeaturesForClusterer(blackouts: BlackoutByBuilding[]) {
  return blackouts.map((b, i) => ({
    type: "Feature",
    id: i,
    geometry: {
      type: "Point",
      coordinates: [parseFloat(b.coordinates[1]), parseFloat(b.coordinates[0])],
    },
    properties: { blackout: b },
  }));
}

export function handleClusterClick(
  coordinates: [number, number],
  mapRef: React.RefObject<any>
) {
  if (!mapRef.current) return;
  const map = mapRef.current;
  const currentZoom = map.zoom || MAP_CONFIG.LOCATION.zoom;
  map.update({
    location: { 
      center: coordinates, 
      zoom: Math.min(currentZoom + MAP_CONFIG.ZOOM_INCREMENT, MAP_CONFIG.ZOOM_RANGE.max) 
    },
    duration: MAP_CONFIG.ANIMATION_DURATION,
  });
}

export function isMobileDevice(): boolean {
  return typeof window !== "undefined" && window.innerWidth <= BREAKPOINTS.MOBILE;
}
