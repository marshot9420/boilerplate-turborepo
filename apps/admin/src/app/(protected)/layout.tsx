import type { ReactNode } from "react";

import { requireAdmin } from "@repo/auth/server";

import { LogoutButton } from "@/features/auth";
import { Layout } from "@/shared";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await requireAdmin();

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
