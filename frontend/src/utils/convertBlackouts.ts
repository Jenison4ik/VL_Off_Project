import { BlackoutByBuilding, Blackout } from "@/types/Blackout";

export default function convertBlackouts(
  data: Blackout[]
): BlackoutByBuilding[] {
  const buildingMap = new Map<string, BlackoutByBuilding>();

  for (const item of data) {
    for (const building of item.buildings) {
      const key = building.build_id; // уникальный ключ
      if (!buildingMap.has(key)) {
        buildingMap.set(key, {
          coordinates: building.coordinates,
          address: building.address,
          build_id: building.build_id,
          blackouts: [],
        });
      }

      buildingMap.get(key)!.blackouts.push({
        type: item.blackout.type,
        start: item.blackout.start,
        description: item.blackout.description,
      });
    }
  }

  return Array.from(buildingMap.values());
}
