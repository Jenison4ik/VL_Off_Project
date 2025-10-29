export function getFavoriteIdFromCookie(): string | null {
  const cookieString =
    typeof document !== "undefined" ? (document.cookie ?? "") : "";
  if (!cookieString) return null;
  const cookiePairs = cookieString.split("; ");
  const cookieId = cookiePairs
    .find((row) => row.startsWith("id="))
    ?.split("=")[1];
  return cookieId ?? null;
}
