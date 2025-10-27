export interface Blackout {
  buildings: [
    { coordinates: [string, string]; address: string; build_id: "string" },
  ];
  blackout: {
    start: string;
    description: string;
    type: "electricity" | "cold_water" | "hot_water" | "heat";
  };
}

export interface BlackoutByBuilding {
  coordinates: [string, string];
  address: string;
  build_id: "string";
  blackouts: {
    type: "electricity" | "cold_water" | "hot_water" | "heat";
    start: string;
    description: string;
  }[];
}
