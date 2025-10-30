"use server";
import getBlackoutsByID from "@/services/getBlackoutsByID";
import { notFound } from "next/navigation";
import { initMocksServer } from "@/mocks/server";
import type { Metadata, ResolvingMetadata } from "next";
import PrefereAddress from "@/components/PreferAddressBtn";
import { getBlackoutTypeLabel } from "@/utils/blackoutTypes";
import style from "@/app/address/[id]/page.module.scss";
import AddressHeader from "@/components/AddressHeader";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  try {
    initMocksServer();
    const info = await getBlackoutsByID(id);

    // Создаем описание на основе типов отключений
    const blackoutTypes = info.blackouts
      .map((blackout) => getBlackoutTypeLabel(blackout.type))
      .join(", ");

    const description = `Отключения по адресу ${info.address}: ${blackoutTypes}. ${info.blackouts.length} отключений запланировано.`;

    return {
      title: `Отключения — ${info.address}`,
      description: description,
      openGraph: {
        title: `Отключения — ${info.address}`,
        description: description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `Отключения — ${info.address}`,
        description: description,
      },
    };
  } catch (error) {
    // Если данные не найдены, возвращаем базовые метаданные
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
    return (
      <>
        <AddressHeader titleProp={info.address} id={id} />
        <div className={`${style.head}`}>
          <h1>{info.address}</h1>
          {/* <PrefereAddress id={id} /> */}
        </div>
        {info.blackouts.map((el, i) => (
          <div key={i}>
            <h3>{getBlackoutTypeLabel(el.type)}</h3>
            <p>{el.description}</p>
          </div>
        ))}
      </>
    );
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      notFound();
    }
    throw error; // для других ошибок ― пробрасываем дальше
  }
}
