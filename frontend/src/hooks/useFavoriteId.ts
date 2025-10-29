import { useCallback, useEffect, useState } from "react";
import { getFavoriteIdFromCookie } from "@/utils/cookies";

export function useFavoriteId(id: string) {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);

  useEffect(() => {
    const cookieId = getFavoriteIdFromCookie();
    setIsFavorite(cookieId === id);
  }, [id]);

  const toggleFavorite = useCallback(() => {
    if (isFavorite) {
      document.cookie = `id=; path=/; max-age=0; SameSite=Lax;`;
      setIsFavorite(false);
    } else {
      const maxAge = 60 * 60 * 24 * 365 * 10;
      document.cookie = `id=${id}; path=/; max-age=${maxAge}; SameSite=Lax;`;
      setIsFavorite(true);
    }
  }, [id, isFavorite]);

  return { isFavorite, toggleFavorite };
}
