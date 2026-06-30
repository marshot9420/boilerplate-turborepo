import { redirect } from "next/navigation";

import type { ReactNode } from "react";

import { AUTH_ERROR_CODE, requireAdmin } from "@repo/auth/server";
import type { AppError } from "@repo/core/errors";

import { URLS } from "@/constants";
import { LogoutButton } from "@/features/auth";
import { Layout } from "@/shared";

export const runtime = "nodejs";

interface ProtectedLayoutProps {
  children: ReactNode;
}

type LoginErrorParam = "unauthorized" | "forbidden";

function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof error.code === "string" &&
    typeof error.message === "string"
  );
}

function getLoginErrorParam(error: unknown): LoginErrorParam | null {
  if (!isAppError(error)) {
    return null;
  }

  if (error.code === AUTH_ERROR_CODE.UNAUTHORIZED) {
    return "unauthorized";
  }

  if (error.code === AUTH_ERROR_CODE.FORBIDDEN) {
    return "forbidden";
  }

  return null;
}

function createLoginUrl(error: LoginErrorParam): string {
  const searchParams = new URLSearchParams({
    error,
  });

  return `${URLS.CLIENT.LOGIN}?${searchParams.toString()}`;
}

async function requireAdminOrRedirect() {
  try {
    return await requireAdmin();
  } catch (error) {
    const loginErrorParam = getLoginErrorParam(error);

    if (loginErrorParam) {
      redirect(createLoginUrl(loginErrorParam));
    }

    throw error;
  }
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await requireAdminOrRedirect();

  return (
    <Layout
      user={{
        email: session.user.email,
        nickname: session.user.nickname ?? null,
      }}
      headerActions={<LogoutButton />}
    >
      {children}
    </Layout>
  );
}
