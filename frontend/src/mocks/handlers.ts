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
  http.get("http://localhost:3000/api/v1/blackouts/:id", async ({ params }) => {
    // Пример ответа согласно интерфейсу BlackoutByID
    const { id } = params;
    // if (id === "ba79551dde9ae08ce006390738ebf6b8") {
    return HttpResponse.json(blackoutByID);
  }),
];
