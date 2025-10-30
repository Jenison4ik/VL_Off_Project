"use client";

import getBlackoutsByID from "@/services/getBlackoutsByID";
import { getFavoriteIdFromCookie } from "@/utils/cookies";
import { useEffect, useState } from "react";
import style from "@/components/PreferAddsressLink.module.scss";
import { BlackoutByID } from "@/types/Blackout";
import { getBlackoutTypeLabelNoEmoji } from "@/utils/blackoutTypes";
import { getWordMonth, parseYmdHmsSmart } from "@/utils/date";

export default function PreferAddressLink() {
  const id = getFavoriteIdFromCookie();
  const [data, setData] = useState<BlackoutByID>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    getBlackoutsByID(id)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch(() => {
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!id) return null;

  if (error) {
    return (
      <div className={style.wraper}>
        <div className={style.error}>Упс, кажется произошла ошибка</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={style.wraper}>
        <div className={`${style.header} ${style.shimmeroverlay}`}>
          Загружаем информацию по вашему адресу
        </div>
      </div>
    );
  }

  const hasBlackouts = data.blackouts && data.blackouts.length > 0;

  return (
    <div className={style.wraper}>
      <div className={style.header}>
        Информация по адресу{" "}
        <a href={`/address/${id}`} className={style.link}>
          {data.address}
        </a>
      </div>

      <div className={style.dataBlock}>
        {!hasBlackouts ? (
          <div
            style={{
              width: "100%",
              height: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "1.1rem",
            }}
          >
            Отключений не было
          </div>
        ) : (
          data.blackouts.map((item, index) => {
            const end = parseYmdHmsSmart(item.end);
            return (
              <div className={style.item} key={index}>
                <img
                  src={`/${item.type}.svg`}
                  alt=""
                  className={style.imgtype}
                />
                <div className={style.textwrap}>
                  <h3>
                    {getBlackoutTypeLabelNoEmoji(item.type)} {"до "}
                    {end
                      ? `${end.getDate()} ${getWordMonth(end.getMonth())} ${end
                          .getHours()
                          .toString()
                          .padStart(2, "0")}:${end
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`
                      : "дата неизвестна"}
                  </h3>
                  <p className={style.description}>
                    — {item.description} "{item.initiator_name}"
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
