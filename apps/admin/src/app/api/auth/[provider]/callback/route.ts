import { type NextRequest, NextResponse } from "next/server";

import { handleOAuthCallback, parseOAuthProviderId } from "@repo/auth/server";

import { serverEnv } from "@/config/server-env";
import { URLS } from "@/constants";

export const runtime = "nodejs";

interface OAuthCallbackRouteContext {
  params: Promise<{
    provider: string;
  }>;
}

function createAdminUrl(pathname: string): URL {
  return new URL(pathname, serverEnv.ADMIN_APP_URL);
}

function getRequestIpAddress(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return request.headers.get("x-real-ip");
}

export async function GET(
  request: NextRequest,
  context: OAuthCallbackRouteContext,
): Promise<NextResponse> {
  const { provider } = await context.params;
  const providerId = parseOAuthProviderId(provider);

  if (!providerId) {
    return NextResponse.redirect(
      createAdminUrl(`${URLS.CLIENT.LOGIN}?error=invalid_oauth_provider`),
    );
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  try {
    await handleOAuthCallback({
      providerId,
      code,
      state,
      appBaseUrl: serverEnv.ADMIN_APP_URL,
      callbackPath: URLS.API.AUTH.OAUTH_CALLBACK(providerId),
      ipAddress: getRequestIpAddress(request),
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.redirect(createAdminUrl(URLS.CLIENT.HOME));
  } catch {
    return NextResponse.redirect(createAdminUrl(`${URLS.CLIENT.LOGIN}?error=oauth_failed`));
  }
}
