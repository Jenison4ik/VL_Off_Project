export {};
import { ymaps3 } from "@yandex/ymaps3-types/import";
declare global {
  interface Window {
    ymaps3: ymaps3;
  }
}
