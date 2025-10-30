import style from "./YMap.module.css";

const MapLoading = () => (
  <div className={`${style.map} ${style.loadingContainer}`}>
    <div className={`${style.textContainer}`}>
      <div className={style.loader}></div>
      <div className={`${style.lable}`}>
        <p>Загружаем карту</p>
      </div>
    </div>
  </div>
);

export default MapLoading;
