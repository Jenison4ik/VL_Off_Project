import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VL OFF Редизайн",
  description: "Создано для Проеткной школы ДВФУ 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <footer>
          <div className="foot-wrap">
            © это студ проект и он не имеет отношения к vl.ru Он создан в
            рамках Проектной школы Фарпост, 2025. Все размещённые данные
            являются учебными и не содержат достоверной информации. При
            использовании материалов ссылка на источник обязательна.
          </div>
        </footer>
      </body>
    </html>
  );
}
