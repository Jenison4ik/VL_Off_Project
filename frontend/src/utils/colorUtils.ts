// Функция для смешивания двух цветов
export function mixColors(
  color1: string,
  color2: string,
  ratio: number = 0.5
): string {
  // Удаляем # если есть
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  // Конвертируем hex в RGB
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) {
    throw new Error("Неверный формат цвета");
  }

  // Смешиваем цвета
  const mixedR = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const mixedG = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const mixedB = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

  return `#${rgbToHex(mixedR)}${rgbToHex(mixedG)}${rgbToHex(mixedB)}`;
}

// Вспомогательная функция для конвертации hex в RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Вспомогательная функция для конвертации RGB в hex
function rgbToHex(rgb: number): string {
  const hex = rgb.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

// Альтернативная функция для смешивания с поддержкой RGBA
export function mixColorsWithAlpha(
  color1: string,
  color2: string,
  ratio: number = 0.5
): string {
  // Поддержка как hex, так и rgb/rgba форматов
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  if (!rgb1 || !rgb2) {
    throw new Error("Неверный формат цвета");
  }

  const mixedR = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const mixedG = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const mixedB = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  const mixedA =
    rgb1.a !== undefined && rgb2.a !== undefined
      ? rgb1.a * (1 - ratio) + rgb2.a * ratio
      : 1;

  return `rgba(${mixedR}, ${mixedG}, ${mixedB}, ${mixedA})`;
}

// Парсер цветов для поддержки разных форматов
function parseColor(
  color: string
): { r: number; g: number; b: number; a?: number } | null {
  // Hex формат
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    return hexToRgb(hex);
  }

  // RGB/RGBA формат
  const rgbMatch = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
      a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : undefined,
    };
  }

  return null;
}

// Примеры использования:
// mixColors('#ff0000', '#0000ff', 0.5) // Смешивает красный и синий
// mixColors('#ff0000', '#0000ff', 0.3) // 30% синего, 70% красного
// mixColorsWithAlpha('rgba(255,0,0,0.5)', 'rgba(0,0,255,0.8)', 0.5)
