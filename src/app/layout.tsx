import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LEDウォール計算機 | LED Wall Calculator",
    template: "%s | LEDウォール計算機",
  },
  description: "LEDパネルの仕様を入力して、画面サイズ、解像度、ピクセル密度、推奨視聴距離を計算します。LED Wall Calculator for calculating screen size, resolution, pixel density, and optimal viewing distance.",
  keywords: ["LED", "LED Wall", "LED Display", "Calculator", "LED計算機", "LEDウォール", "解像度計算", "視聴距離"],
  authors: [{ name: "LED Wall Calculator Team" }],
  creator: "LED Wall Calculator",
  publisher: "LED Wall Calculator",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: "en_US",
    siteName: "LEDウォール計算機",
    title: "LEDウォール計算機 | LED Wall Calculator",
    description: "LEDパネルの仕様を入力して、画面サイズ、解像度、ピクセル密度、推奨視聴距離を計算します。",
  },
  twitter: {
    card: "summary_large_image",
    title: "LEDウォール計算機 | LED Wall Calculator",
    description: "LEDパネルの仕様を入力して、画面サイズ、解像度、ピクセル密度、推奨視聴距離を計算します。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
