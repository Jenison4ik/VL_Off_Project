import style from "./YMap.module.css";

const MapError = () => (
  <div className={`${style.map} ${style.loadingContainer}`}>
    <div className={`${style.textContainer}`}>
      <div className={`${style.lable}`}>
        <p>Произошла ошибка во время загрузки карты</p>
      </div>
    </div>
  </div>
);

export default MapError;
