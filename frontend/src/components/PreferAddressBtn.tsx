"use client";

import { useFavoriteId } from "@/hooks/useFavoriteId";

export default function PrefereAddress({ id }: { id: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteId(id);

  if (isFavorite === null) return <button disabled={true}>Загрузка</button>;

  return (
    <button onClick={toggleFavorite}>
      {isFavorite ? `Убрать из избранного` : `Добавить в избранное`}
    </button>
  );
}
