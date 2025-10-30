/**
 * Утилиты для работы с типами отключений
 */

export type BlackoutType = "electricity" | "cold_water" | "hot_water" | "heat";

/**
 * Мапа с текстовыми описаниями типов отключений
 */
export const BLACKOUT_TYPE_LABELS: Record<BlackoutType, string> = {
  electricity: "⚡ Отключение света",
  cold_water: "❄️💧 Отключение холодной воды",
  hot_water: "🔥💧 Отключение горячей воды",
  heat: "🔥 Отключение отопления",
};

/**
 * Получить текстовое описание типа отключения
 */
export function getBlackoutTypeLabel(type: string): string {
  return BLACKOUT_TYPE_LABELS[type as BlackoutType] || type;
}

/**
 * Получить все доступные типы отключений
 */
export function getAllBlackoutTypes(): BlackoutType[] {
  return Object.keys(BLACKOUT_TYPE_LABELS) as BlackoutType[];
}
