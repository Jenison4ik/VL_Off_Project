"use client";

import { useEffect, useState } from "react";

export default function PrefereAddress({ id }: { id: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const cookie = document.cookie.split("; ");
    const cookieId = cookie.find((row) => row.startsWith("id"))?.split("=")[1];
    if (cookieId === id) {
      setIsFavorite(true);
    }
  });

  function handleFavorite() {
    if (!isFavorite) {
      const maxAge = 60 * 60 * 24 * 365 * 10;
      document.cookie = `id=${id}; path=/; max-age=${maxAge}; SameSite=Lax;`; //Добавить  Secure
      setIsFavorite(true);
    } else {
      document.cookie = `id=; path=/; max-age=0; SameSite=Lax; Secure`;
      setIsFavorite(false);
    }
  }
  return (
    <button onClick={handleFavorite}>
      {isFavorite ? `Убрать из избранного` : `Добавить в избранное`}
    </button>
  );
}
