import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <html lang="ko">
      <body
        {...(isDev ? { suppressHydrationWarning: true } : {})} // Brave 브라우저에서 발생하는 개발 환경 문제 (`cz-shortcut-listen="true"` 주입 문제)
      >
        {children}
      </body>
    </html>
  );
}
