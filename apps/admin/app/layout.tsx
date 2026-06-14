import "./globals.css";

import Link from "next/link";

import type { Metadata } from "next";

import type { ReactNode } from "react";

import { clientEnv } from "@repo/env/client";
import { serverEnv } from "@repo/env/server";

import { URLS } from "@/constants";
import { LogoutButton } from "@/features/auth";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_APP_URL),
  title: "Admin",
  description: "Admin application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const isDev = serverEnv.NODE_ENV !== "production";

  return (
    <html lang="ko">
      <body
        {...(isDev ? { suppressHydrationWarning: true } : {})} // Brave 브라우저에서 발생하는 개발 환경 문제 (`cz-shortcut-listen="true"` 주입 문제)
      >
        <header>
          <LogoutButton /> <Link href={URLS.CLIENT.LOGIN}>로그인</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
