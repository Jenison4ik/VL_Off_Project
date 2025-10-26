//Отложено

// "use client";

// import { useEffect, useState } from "react";

// // Вариант 1: Массив кортежей [строка, число]
// type BarChartData = [string, number][];

// // ИЛИ Вариант 2: Массив объектов с названными полями
// // interface BarChartItem {
// //   title: string;
// //   data: number;
// // }
// // type BarChartData = BarChartItem[];

// export default function BarChart({ data }: { data: BarChartData }) {
//   const [max, setMax] = useState(0);

//   useEffect(() => {
//     setMax(Math.max(...data.map((e, i) => data[i][1])));
//     console.log(max);
//   }, []);
//   return <div className="bar-chart">{data.toString() + '---'  + max}</div>;
// }
