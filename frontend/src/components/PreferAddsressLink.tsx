"use client";

import getBlackoutsByID from "@/services/getBlackoutsByID";
import { getFavoriteIdFromCookie } from "@/utils/cookies";
import { useEffect, useState } from "react";

export default function PreferAddressLink() {
  const id = getFavoriteIdFromCookie();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    getBlackoutsByID(id).then((res) => {
      if (isMounted) setAddress(res.address);
    });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!id) return null;
  return <a href={`/address/${id}`}>{address}</a>;
}
