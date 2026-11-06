import "server-only";

import { redirect } from "next/navigation";

import { getCurrentSession } from "@repo/auth/server";

import { URLS } from "@/constants";

export async function requirePageUser() {
  const session = await getCurrentSession();

  if (!session) {
    redirect(URLS.CLIENT.LOGIN);
  }

  return session;
}
