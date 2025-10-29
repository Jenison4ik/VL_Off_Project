import { AdressSearch } from "@/types/adresses";

export default async function searchAddress(
  address: string,
  signal?: AbortSignal
): Promise<AdressSearch[]> {
  try {
    const data = await fetch(`/api/v1/blackouts/search/building?q=${address}`, {
      signal,
    });
    if (data.ok) {
      const json = await data.json();
      return json;
    } else {
      return [];
    }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw e; // Пробрасываем AbortError наверх
    }
    console.log(`Error: ${e}`);
    return [];
  }
}
