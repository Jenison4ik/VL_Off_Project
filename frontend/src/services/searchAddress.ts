import { AdressSearch } from "@/types/adresses";

export default async function searchAddress(
  address: string
): Promise<AdressSearch[]> {
  try {
    const data = await fetch(`/api/v1/blackouts/search/building?q=${address}`);
    if (data.ok) {
      const json = await data.json();
      return json;
    } else {
      return [];
    }
  } catch (e) {
    console.log(`Error: ${e}`);
    return [];
  }
}
