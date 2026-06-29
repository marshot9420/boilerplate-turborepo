import { NextResponse, type NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;

const PAGE_REQUEST_LIMIT = 120;
const MUTATION_REQUEST_LIMIT = 40;
const AUTH_REQUEST_LIMIT = 20;

const LOGIN_PATH = "/login";

const rateLimitStore = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

const publicPathPrefixes = [LOGIN_PATH, "/api/auth"];

const suspiciousUserAgentPatterns = [/sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const userAgent = request.headers.get("user-agent") ?? "";

  if (suspiciousUserAgentPatterns.some((pattern) => pattern.test(userAgent))) {
    const response = NextResponse.json(
      {
        ok: false,
        code: "FORBIDDEN",
        message: "요청을 처리할 수 없습니다.",
      },
      {
        status: 403,
      },
    );

    applyAdminResponseHeaders(response, requestId);

    return response;
  }

  const isPublicPath = publicPathPrefixes.some((pathPrefix) => pathname.startsWith(pathPrefix));

  const isMutatingRequest = !["GET", "HEAD", "OPTIONS"].includes(request.method);

  const clientIdentifier = getClientIdentifier(request);

  const rateLimitLimit = isPublicPath
    ? AUTH_REQUEST_LIMIT
    : isMutatingRequest
      ? MUTATION_REQUEST_LIMIT
      : PAGE_REQUEST_LIMIT;

  const rateLimitScope = isPublicPath ? "auth" : isMutatingRequest ? "mutation" : "page";

  const rateLimitResult = checkRateLimit({
    key: `admin:${rateLimitScope}:${clientIdentifier}`,
    limit: rateLimitLimit,
  });

  if (!rateLimitResult.ok) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000));

    const response = NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      },
      {
        status: 429,
      },
    );

    response.headers.set("Retry-After", String(retryAfterSeconds));

    applyAdminResponseHeaders(response, requestId);

    return response;
  }

  const sessionCookieName = process.env.AUTH_SESSION_COOKIE_NAME;

  if (!isPublicPath && sessionCookieName && !request.cookies.has(sessionCookieName)) {
    const loginUrl = new URL(LOGIN_PATH, request.url);

    loginUrl.searchParams.set("next", `${pathname}${search}`);

    const response = NextResponse.redirect(loginUrl);

    applyAdminResponseHeaders(response, requestId);

    return response;
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  applyAdminResponseHeaders(response, requestId);

  return response;
}

function applyAdminResponseHeaders(response: NextResponse, requestId: string) {
  response.headers.set("X-Request-Id", requestId);
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
}

function getClientIdentifier(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();

  return forwardedIp ?? request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit({ key, limit }: { key: string; limit: number }) {
  const now = Date.now();

  if (rateLimitStore.size > 10_000) {
    for (const [storedKey, bucket] of rateLimitStore.entries()) {
      if (bucket.resetAt <= now) {
        rateLimitStore.delete(storedKey);
      }
    }
  }

  const bucket = rateLimitStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS;

    rateLimitStore.set(key, {
      count: 1,
      resetAt,
    });

    return {
      ok: true,
      resetAt,
    };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      resetAt: bucket.resetAt,
    };
  }

  bucket.count += 1;

  return {
    ok: true,
    resetAt: bucket.resetAt,
  };
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
