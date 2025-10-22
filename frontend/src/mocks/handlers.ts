import { http, HttpResponse } from "msw";
import { adresses } from "./data/adresses";

export const handlers = [
  http.get("/users", () => {
    return HttpResponse.json(adresses);
  }),
];
