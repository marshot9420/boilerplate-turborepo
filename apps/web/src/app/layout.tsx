import "./globals.css";

import type { Metadata } from "next";

import type { ReactNode } from "react";

import { ToastProvider } from "@repo/design-system/toast";
import { clientEnv } from "@repo/env/client";
import { serverEnv } from "@repo/env/server";

import { Shell } from "@/shared/layout";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_APP_URL),
  title: "Web",
  description: "Service application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const isDev = serverEnv.NODE_ENV !== "production";

  return (
    <html lang="ko" data-ds-theme="web" data-ds-mode="light">
      <body
        {...(isDev ? { suppressHydrationWarning: true } : {})} // Brave 브라우저에서 발생하는 개발 환경 문제 (`cz-shortcut-listen="true"` 주입 문제)
      >
        <Shell>{children}</Shell>
        <ToastProvider />
      </body>
    </html>
  );
}
