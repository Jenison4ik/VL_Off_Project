import { delay, http, HttpResponse } from "msw";
import { adresses } from "./data/adresses";
import blackouts from "./data/blackouts.json";

export const handlers = [
  http.get("/users", () => {
    return HttpResponse.json(adresses);
  }),
  http.get("/api/v1/blackouts", async () => {
    await delay(2000); //Имитация загрузки
    return HttpResponse.json(blackouts);
  }),
];
