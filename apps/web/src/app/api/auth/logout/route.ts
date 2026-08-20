import { NextResponse } from "next/server";

import { revokeCurrentAuthSession } from "@repo/auth/server";

import { serverEnv } from "@/config/server-env";
import { URLS } from "@/constants";

export const runtime = "nodejs";

function createWebUrl(pathname: string): URL {
  return new URL(pathname, serverEnv.WEB_APP_URL);
}

export async function POST(): Promise<NextResponse> {
  await revokeCurrentAuthSession();

  return NextResponse.redirect(createWebUrl(URLS.CLIENT.LOGIN), {
    status: 303,
  });
}
