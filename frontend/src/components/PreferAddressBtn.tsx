"use client";

import { useFavoriteId } from "@/hooks/useFavoriteId";
import style from "@/components/PreferAddressBtn.module.scss";
export default function PrefereAddress({ id }: { id: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteId(id);

  if (isFavorite === null) return <button disabled={true}>Загрузка</button>;

  return (
    <button onClick={toggleFavorite} className={`${style.btn}`}>
      <img src={isFavorite ? "/HeartFilled.svg" : "/Heart.svg"} alt="" />
      {isFavorite ? `Убрать из избранного` : `Добавить в избранное`}
    </button>
  );
}
