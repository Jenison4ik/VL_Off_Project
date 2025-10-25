export default interface Blackout {
  building: [{ coordinates: [string, string] }];
  blackout: {
    start: string;
    description: string;
    type: "electricity" | "cold_water" | "hot_water" | "heat";
  };
}
