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
  http.get("/api/v1/blackouts/:id", async ({ params }) => {
    // Пример ответа согласно интерфейсу BlackoutByID
    const { id } = params;
    if (id === "ba79551dde9ae08ce006390738ebf6b8") {
      await delay(500);
      return HttpResponse.json({
        blackouts: [
          {
            id: "ba79551dde9ae08ce006390738ebf6b8",
            start: "2018-11-29 22:02:00",
            end: "2018-11-30 12:00:00",
            description:
              "Перекрыт стояк водоснабжения, требуются ремонтные работы",
            type: "hot_water",
            initiator_name: 'ООО "ДВКС"',
          },
        ],
        address: "50 лет ВЛКСМ ул. 20",
      });
    } else {
      // Для остальных id отдаём имитацию "не найдено"
      return new HttpResponse(null, { status: 404 });
    }
  }),
];
