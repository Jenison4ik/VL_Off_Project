/**
 * Преобразует строку времени формата "YYYY-MM-DD HH:mm:ss" в объект Date (локальное время).
 * Возвращает null, если строка не соответствует ожидаемому формату.
 */
export function parseYmdHmsToDate(input: string): Date | null {
  if (!input) return null;

  const match = input.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/
  );
  if (!match) return null;

  const [, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr] = match;

  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1; // месяцы в Date начинаются с 0
  const day = Number(dayStr);
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const second = Number(secondStr);

  // Создаем дату в UTC, чтобы часы не преобразовывались в локальные
  const ms = Date.UTC(year, monthIndex, day, hour, minute, second, 0);
  const date = new Date(ms);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Упрощённый парсер: сначала пробуем Date c заменой пробела на 'T', затем строгий парсер сверху.
 */
export function parseYmdHmsSmart(input: string): Date | null {
  if (!input) return null;
  // Принудительно трактуем как UTC, чтобы время не сдвигалось по локали
  const isoUtc = input.replace(" ", "T") + "Z";
  const d = new Date(isoUtc);
  if (!isNaN(d.getTime())) return d;
  return parseYmdHmsToDate(input);
}

/**
 * Возвращает слово-месяц (на русском) по индексу месяца (0-январь ... 11-декабрь).
 * Если индекс некорректен – вернёт пустую строку.
 */
const MONTHS_RU: string[] = [
  "Января",
  "Февраля",
  "Марта",
  "Апреля",
  "Мая",
  "Июня",
  "Июля",
  "Августа",
  "Сентября",
  "Октября",
  "Ноября",
  "Декабря",
];

export function getWordMonth(monthIndex: number): string {
  if (typeof monthIndex !== "number" || monthIndex < 0 || monthIndex > 11) {
    return "";
  }
  return MONTHS_RU[monthIndex];
}
