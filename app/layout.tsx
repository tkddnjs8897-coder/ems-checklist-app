import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HomeButton } from "@/components/HomeButton";

export const metadata: Metadata = {
  title: "119 현장 체크리스트",
  description: "119구급대원 현장응급처치 표준지침 기반 현장 체크리스트",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased text-scale-lg">
      <body className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">{children}</div>
        <div className="shrink-0 flex justify-end px-4 py-2">
          <HomeButton />
        </div>
      </body>
    </html>
  );
}
