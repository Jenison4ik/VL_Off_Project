import { http, HttpResponse } from "msw";
import { adresses } from "./data/adresses";
import blackouts from "./data/blackouts.json";

export const handlers = [
  http.get("/users", () => {
    return HttpResponse.json(adresses);
  }),
  http.get("/api/api/v1/blackouts", () => {
    return HttpResponse.json(blackouts);
  }),
];
