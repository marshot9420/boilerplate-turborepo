import { type NextRequest, NextResponse } from "next/server";

import { handleOAuthCallback, parseOAuthProviderId } from "@repo/auth/server";
import { serverEnv } from "@repo/env/server";

export const runtime = "nodejs";

interface OAuthCallbackRouteContext {
  params: Promise<{
    provider: string;
  }>;
}

function createWebUrl(pathname: string): URL {
  return new URL(pathname, serverEnv.WEB_APP_URL);
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
    return NextResponse.redirect(createWebUrl("/login?error=invalid_oauth_provider"));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  try {
    await handleOAuthCallback({
      providerId,
      code,
      state,
      appBaseUrl: serverEnv.WEB_APP_URL,
      callbackPath: `/api/auth/${providerId}/callback`,
      ipAddress: getRequestIpAddress(request),
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.redirect(createWebUrl("/me"));
  } catch {
    return NextResponse.redirect(createWebUrl("/login?error=oauth_failed"));
  }
}
