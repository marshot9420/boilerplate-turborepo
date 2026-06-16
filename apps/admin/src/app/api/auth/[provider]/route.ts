import { type NextRequest, NextResponse } from "next/server";

import { createOAuthAuthorizeUrl, parseOAuthProviderId } from "@repo/auth/server";
import { serverEnv } from "@repo/env/server";

export const runtime = "nodejs";

interface OAuthStartRouteContext {
  params: Promise<{
    provider: string;
  }>;
}

function createAdminUrl(pathname: string): URL {
  return new URL(pathname, serverEnv.ADMIN_APP_URL);
}

export async function GET(
  _request: NextRequest,
  context: OAuthStartRouteContext,
): Promise<NextResponse> {
  const { provider } = await context.params;
  const providerId = parseOAuthProviderId(provider);

  if (!providerId) {
    return NextResponse.redirect(createAdminUrl("/login?error=invalid_oauth_provider"));
  }

  const authorizeUrl = await createOAuthAuthorizeUrl({
    providerId,
    appBaseUrl: serverEnv.ADMIN_APP_URL,
    callbackPath: `/api/auth/${providerId}/callback`,
  });

  return NextResponse.redirect(authorizeUrl);
}
