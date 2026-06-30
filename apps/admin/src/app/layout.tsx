import "./globals.css";

import type { Metadata, Viewport } from "next";

import type { ReactNode } from "react";

import { ToastProvider } from "@repo/design-system/toast";
import { clientEnv } from "@repo/env/client";
import { serverEnv } from "@repo/env/server";

const APP_NAME = "Admin";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_APP_URL),
  applicationName: APP_NAME,

  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },

  description: "Admin application",

  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": 0,
      "max-image-preview": "none",
      "max-snippet": 0,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#ffffff",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const isDev = serverEnv.NODE_ENV !== "production";

  return (
    <html lang="ko" data-ds-theme="admin" data-ds-mode="light">
      <body
        {...(isDev ? { suppressHydrationWarning: true } : {})} // Brave 브라우저에서 발생하는 개발 환경 문제 (`cz-shortcut-listen="true"` 주입 문제)
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
