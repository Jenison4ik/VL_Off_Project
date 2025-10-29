import { delay, http, HttpResponse } from "msw";
import { adresses } from "./data/adresses";
import blackouts from "./data/blackouts.json";
import blackoutByID from "./data/BlackoutByID.json";
export const handlers = [
  http.get("/users", () => {
    return HttpResponse.json(adresses);
  }),
  http.get("/api/v1/blackouts", async () => {
    await delay(2000); //Имитация загрузки
    return HttpResponse.json(blackouts);
  }),
  http.get("/api/v1/blackouts/search/building", async () => {
    return HttpResponse.json([
      {
        full_address: "Постышева ул., ",
        building_id: "5a6f09ed80e1c7b927ced72871010406",
      },
      {
        full_address: "Канал пос., 1",
        building_id: "f0ea9b3f8a26323f71c11e3ee731e4fc",
      },
      {
        full_address: "КЭТ пос., 1",
        building_id: "8ff099789d4ca11b226ec0e8696ec92e",
      },
      {
        full_address: "Поселковая 1-я ул., 1",
        building_id: "9bb8e2b61f1de6de540e5b7a80f4c84f",
      },
    ]);
  }),
  http.get("http://localhost:3000/api/v1/blackouts/:id", async ({ params }) => {
    // Пример ответа согласно интерфейсу BlackoutByID
    const { id } = params;
    // if (id === "ba79551dde9ae08ce006390738ebf6b8") {
    return HttpResponse.json(blackoutByID);
  }),
];
