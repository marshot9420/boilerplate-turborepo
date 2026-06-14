import { NextResponse } from "next/server";

import { revokeCurrentAuthSession } from "@repo/auth/server";
import { serverEnv } from "@repo/env/server";

import { URLS } from "@/constants";

export const runtime = "nodejs";

function createAdminUrl(pathname: string): URL {
  return new URL(pathname, serverEnv.ADMIN_APP_URL);
}

export async function POST(): Promise<NextResponse> {
  await revokeCurrentAuthSession();

  return NextResponse.redirect(createAdminUrl(URLS.CLIENT.LOGIN), {
    status: 303,
  });
}
