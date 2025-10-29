import Image from "next/image";

export default async function NotFound() {
  return (
    <div>
      <Image
        src="/not-found.png"
        width="100"
        height="200"
        alt="чайка"
        quality={100}
      ></Image>
    </div>
  );
}
