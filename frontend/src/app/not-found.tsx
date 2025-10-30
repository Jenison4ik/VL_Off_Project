import Image from "next/image";
import Bird from "../../public/not_found_bird.png";
import MainHeader from "@/components/MainHeader";
import style from "@/app/not-found.module.scss";

export default function NotFound() {
  return (
    <>
      <MainHeader />
      <div className={`${style.content}`}>
        <Image src={Bird} alt="чайка" className={`${style.bird}`} />
        <div className={`${style.text}`}>
          <h1>404</h1>
          <p>Кажется по этому адресу ничего не нашлось</p>
          <a href="/">На главную</a>
        </div>
      </div>
    </>
  );
}
