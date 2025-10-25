import { http, HttpResponse } from "msw";
import { adresses } from "./data/adresses";
import blackouts from "./data/test.json";

export const handlers = [
  http.get("/users", () => {
    return HttpResponse.json(adresses);
  }),
  http.get("/api/v1/blackouts", () => {
    return HttpResponse.json(blackouts);
  }),
];
