"use server";

import getBlackoutsByID from "@/services/getBlackoutsByID";
import { notFound } from "next/navigation";
import { initMocksServer } from "@/mocks/server";
import type { Metadata, ResolvingMetadata } from "next";
import { getBlackoutTypeLabelNoEmoji } from "@/utils/blackoutTypes";
import { getWordMonth, parseYmdHmsSmart } from "@/utils/date";
import style from "@/app/address/[id]/page.module.scss";
import AddressHeader from "@/components/AddressHeader";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  try {
    initMocksServer();
    const info = await getBlackoutsByID(id);

    const blackoutTypes = info.blackouts
      .map((blackout) => getBlackoutTypeLabelNoEmoji(blackout.type))
      .join(", ");

    const description = `Отключения по адресу ${info.address}: ${blackoutTypes}. ${info.blackouts.length} отключений запланировано.`;

    return {
      title: `Отключения — ${info.address}`,
      description,
      openGraph: {
        title: `Отключения — ${info.address}`,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `Отключения — ${info.address}`,
        description,
      },
    };
  } catch {
    return {
      title: "Отключения — Адрес не найден",
      description: "Информация об отключениях по данному адресу не найдена",
    };
  }
}

export default async function BlackoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    initMocksServer();
    const info = await getBlackoutsByID(id);
    const hasBlackouts = info.blackouts.length > 0;

    return (
      <>
        <AddressHeader titleProp={info.address} id={id} />
        <div className={style.content}></div>
        <div className={style.dataBlock}>
          {!hasBlackouts ? (
            <div className={style.noData}>Отключений не было</div>
          ) : (
            info.blackouts.map((item, index) => {
              const end = parseYmdHmsSmart(item.end);
              const formattedEnd = end
                ? `${end.getDate()} ${getWordMonth(end.getMonth())} ${end
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${end
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
                : "дата неизвестна";

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
                      {formattedEnd}
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
      </>
    );
  } catch (error: any) {
    if (error.message === "NOT_FOUND") notFound();
    throw error;
  }
}
