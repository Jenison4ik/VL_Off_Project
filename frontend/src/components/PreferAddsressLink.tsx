"use client";

import getBlackoutsByID from "@/services/getBlackoutsByID";
import { getFavoriteIdFromCookie } from "@/utils/cookies";
import { useEffect, useState } from "react";
import style from "@/components/PreferAddsressLink.module.scss";
import { BlackoutByID } from "@/types/Blackout";
import { getBlackoutTypeLabel } from "@/utils/blackoutTypes";
import { getWordMonth, parseYmdHmsSmart } from "@/utils/date";

export default function PreferAddressLink() {
  const id = getFavoriteIdFromCookie();
  const [data, setData] = useState<BlackoutByID>();

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    getBlackoutsByID(id).then((res) => {
      if (isMounted) setData(res);
    });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!id) return null;
  return (
    <div className={`${style.wraper}`}>
      <div className={`${style.header}`}>
        Информация по адресу{" "}
        <a href={`/address/${id}`} className={`${style.link}`}>
          {data?.address}
        </a>
      </div>
      <div className={`${style.dataBlock}`}>
        {data?.blackouts.map((item, index) => {
          const end = parseYmdHmsSmart(item.end);
          return (
            <div className={`${style.item}`} key={index}>
              <p>{getBlackoutTypeLabel(item.type)}</p>
              <p>
                — {item.description} "{item.initiator_name} приблизительно
                закончится -{" "}
                {end
                  ? `${end.getDate()} ${getWordMonth(end.getMonth())} в ${end
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${end
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : "дата неизвестна"}
                "
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
