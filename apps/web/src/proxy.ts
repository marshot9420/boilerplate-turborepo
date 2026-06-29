import { NextResponse, type NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;

const SENSITIVE_REQUEST_LIMIT = 80;
const STRICT_REQUEST_LIMIT = 20;

const rateLimitStore = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

const strictPathPrefixes = [
  "/api/auth",
  "/api/login",
  "/api/orders",
  "/api/payments",
  "/api/checkout",
];

const suspiciousUserAgentPatterns = [/sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const userAgent = request.headers.get("user-agent") ?? "";

  const isApiRequest = pathname.startsWith("/api/");
  const isMutatingRequest = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  const isSensitiveRequest = isApiRequest || isMutatingRequest;

  if (
    isSensitiveRequest &&
    suspiciousUserAgentPatterns.some((pattern) => pattern.test(userAgent))
  ) {
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

    response.headers.set("X-Request-Id", requestId);

    return response;
  }

  if (isSensitiveRequest) {
    const clientIdentifier = getClientIdentifier(request);

    const strictPathPrefix = strictPathPrefixes.find((pathPrefix) =>
      pathname.startsWith(pathPrefix),
    );

    const rateLimitScope = strictPathPrefix ?? (isApiRequest ? "/api" : "mutation");

    const rateLimitResult = checkRateLimit({
      key: `web:${rateLimitScope}:${clientIdentifier}`,
      limit: strictPathPrefix ? STRICT_REQUEST_LIMIT : SENSITIVE_REQUEST_LIMIT,
    });

    if (!rateLimitResult.ok) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
      );

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
      response.headers.set("X-Request-Id", requestId);

      return response;
    }
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("X-Request-Id", requestId);

  return response;
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
