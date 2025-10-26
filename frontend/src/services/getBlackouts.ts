import { Blackout } from "@/types/Blackout";

export default async function getBlackouts(): Promise<Blackout[]> {
  const res = await fetch("/api/api/v1/blackouts");
  const data = await res.json();
  return data;
}
