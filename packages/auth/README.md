# @repo/auth

Next.js App Router 기반 애플리케이션에서 공통으로 사용하는 인증/인가 패키지입니다.

`@repo/auth`는 Google, Naver, Kakao OAuth 로그인, DB 세션, 세션 쿠키, 현재 사용자 조회, 사용자/관리자 접근 제어를 담당합니다.

이 패키지는 Next.js 서버 런타임 전용 패키지입니다.

---

## 역할

```txt
@repo/auth
  OAuth authorize URL 생성
  OAuth state cookie 생성/검증
  Google / Naver / Kakao OAuth token 교환
  OAuth provider profile 조회
  OAuth callback 처리
  DB 기반 세션 생성/조회/폐기
  session cookie 읽기/쓰기/삭제
  getCurrentSession
  requireUser
  requireAdmin
```

`User` 생성, OAuth 계정 연결, 사용자 상태 검증 같은 비즈니스 규칙은 `@repo/domain`의 `user` 도메인 서비스가 담당합니다.

`UserSession` 생성/조회/폐기 같은 DB 접근은 `@repo/database`의 repository가 담당합니다.

---

## 의존성 방향

```txt
apps/web
apps/admin
  ↓
@repo/auth
  ↓
@repo/domain
  ↓
@repo/database
  ↓
@repo/core

@repo/auth
  ↓
@repo/env
```

금지 방향은 다음과 같습니다.

```txt
@repo/domain → @repo/auth
@repo/database → @repo/auth
@repo/core → @repo/auth
@repo/auth → apps/*
```

`domain`은 인증 패키지를 알면 안 됩니다.
OAuth provider 응답은 `@repo/auth`에서 정규화하고, 정규화된 입력만 `@repo/domain`으로 전달합니다.

---

## 패키지 구조

```txt
packages/auth/
├─ README.md
├─ eslint.config.js
├─ package.json
├─ tsconfig.json
├─ vitest.config.ts
└─ src/
   ├─ auth.error.ts
   ├─ client.ts
   ├─ server.ts
   ├─ guards/
   │  ├─ get-current-session.ts
   │  ├─ require-admin.ts
   │  ├─ require-user.ts
   │  └─ index.ts
   ├─ oauth/
   │  ├─ google.provider.ts
   │  ├─ kakao.provider.ts
   │  ├─ naver.provider.ts
   │  ├─ oauth-callback.ts
   │  ├─ oauth-profile.ts
   │  ├─ oauth-provider.ts
   │  ├─ oauth-state.ts
   │  ├─ oauth-url.ts
   │  └─ index.ts
   └─ session/
      ├─ session-cookie.ts
      ├─ session-token.ts
      ├─ session.service.ts
      └─ index.ts
```

---

## Exports

```json
{
  "exports": {
    "./client": "./src/client.ts",
    "./server": "./src/server.ts"
  }
}
```

현재 클라이언트 공개 API는 없습니다.

```ts
import {} from "@repo/auth/client";
```

서버 전용 API는 아래 경로에서 사용합니다.

```ts
import { requireUser } from "@repo/auth/server";
```

---

## 환경 변수

`@repo/auth`는 `@repo/env/server`를 통해 아래 환경변수를 사용합니다.

```env
# App
WEB_APP_URL=http://localhost:3000
ADMIN_APP_URL=http://localhost:3001

# Auth Session
AUTH_SESSION_COOKIE_NAME=boilerplate_session
AUTH_SESSION_MAX_AGE_SECONDS=2592000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Naver OAuth
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

# Kakao OAuth
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
```

`AUTH_SESSION_MAX_AGE_SECONDS`는 DB 세션 만료 시간과 session cookie maxAge에 함께 사용됩니다.

---

## OAuth callback URL

각 OAuth provider 콘솔에 앱별 callback URL을 등록합니다. 아래 Web·Admin 목록은 Google과 Naver의 로컬 예시입니다.

### Web

```txt
http://localhost:3000/api/auth/google/callback
http://localhost:3000/api/auth/naver/callback
```

### Admin

```txt
http://localhost:3001/api/auth/google/callback
http://localhost:3001/api/auth/naver/callback
```

배포 환경에서는 각 앱의 실제 origin에 맞춰 등록합니다.

### Kakao 로그인 설정

1. 카카오디벨로퍼스 앱에서 **카카오 로그인 → 사용 설정**을 켭니다. 서버의 `KAKAO_CLIENT_ID`에 REST API 키를, `KAKAO_CLIENT_SECRET`에 같은 키의 클라이언트 시크릿을 설정합니다. [카카오 로그인 설정 안내](https://developers.kakao.com/docs/ko/kakaologin/prerequisite)
2. **카카오 로그인 → 동의항목 → 개인정보**에서 닉네임(`profile_nickname`), 프로필 사진(`profile_image`), 카카오계정 이메일(`account_email`)을 설정합니다. 공용 인가 URL은 세 항목을 기본으로 요청합니다. 닉네임과 사진은 선택 동의로 설정할 수 있습니다. 로그인에 필요한 이메일은 필수 동의로 설정합니다. [카카오 개인정보 동의항목](https://developers.kakao.com/docs/ko/kakaologin/utilize)

   이메일 동의항목은 비즈 앱과 테스트 앱에서 설정할 수 있습니다. 사업자등록번호가 없는 경우 개인 개발자 비즈 앱 전환 요건을 확인합니다. 테스트 앱은 앱 멤버로 검증할 때 사용하며, 실제 서비스에서는 원본 앱의 키를 사용합니다. [카카오 비즈 앱 및 테스트 앱 설정](https://developers.kakao.com/docs/ko/app-setting/app)

   Web·Admin은 인가 요청마다 고정된 `scope`를 보냅니다. 최초 로그인에서 선택 동의인 닉네임이나 사진을 건너뛴 사용자가 재로그인하면, 카카오는 미동의 항목을 추가 동의 화면에서 필수로 표시할 수 있습니다. [카카오 데브톡 추가 동의 안내](https://devtalk.kakao.com/t/plusfriends/149354)

3. **앱 → 플랫폼 키**에서 사용하는 **REST API 키**를 선택하고, **카카오 로그인 리다이렉트 URI**에 아래 주소 중 사용하는 환경의 Web·Admin 주소를 각각 등록합니다. 배포 예시의 도메인은 실제 주소로 바꾸고, Preview의 실제 로그인 검증에는 고정 HTTPS 주소를 사용합니다. 등록한 URI의 프로토콜, 호스트, 포트, 경로와 끝 슬래시는 요청의 `redirect_uri`와 일치해야 합니다. [카카오 리다이렉트 URI 등록 안내](https://developers.kakao.com/docs/ko/app-setting/app)

| 환경            | Web (`WEB_APP_URL` 기준)                                  | Admin (`ADMIN_APP_URL` 기준)                                |
| --------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| Local           | `http://localhost:3000/api/auth/kakao/callback`           | `http://localhost:3001/api/auth/kakao/callback`             |
| Preview 예시    | `https://web-preview.example.com/api/auth/kakao/callback` | `https://admin-preview.example.com/api/auth/kakao/callback` |
| Production 예시 | `https://web.example.com/api/auth/kakao/callback`         | `https://admin.example.com/api/auth/kakao/callback`         |

로그인에는 유효하고 인증된 이메일이 필요합니다. 프로필 응답을 처리할 때는 카카오 동의 화면의 표시 방식과 별개로, 응답에서 빠진 닉네임과 사진을 각각 `null`로 매핑합니다. [OAuth 이메일 검증 정책](../../docs/17_보안_및_운영_기본정책.md#51-oauth-identity와-이메일-충돌)

### 기존 Kakao 앱의 `profile` 동의항목 전환

1. 운영 앱의 App ID, REST API 키와 클라이언트 시크릿, Web·Admin의 등록된 콜백 주소를 유지합니다. 운영 전환 전에 분리된 동의항목을 사용하는 Staging에서 두 앱의 로그인과 재로그인을 검증합니다. 최초 로그인에서 닉네임과 사진 동의를 건너뛴 뒤 재동의 화면도 확인합니다.
2. 카카오 데브톡 신청 양식에 기존 App ID, 변경할 두 항목(닉네임과 프로필 사진), 서비스 업데이트 완료 여부를 적어 전환을 신청합니다. 분리 적용 후 카카오 콘솔에서 `profile_nickname`과 `profile_image`를 모두 활성화하고, `account_email`의 필수 동의 설정을 확인합니다. [카카오 프로필 동의항목 변경 신청](https://devtalk.kakao.com/t/request-to-change-scope-for-profile/116264)
3. 카카오 설정 전환과 Web·Admin 배포 시점을 맞춥니다. 전환 전에 새 Scope를 요청하거나 전환 후 기존 `profile`을 요청하면 카카오에 설정되지 않은 항목이므로 `KOE205`가 발생할 수 있습니다. 전환 직후 두 앱의 신규 로그인과 기존 계정 재로그인을 확인하고, 기존 사용자가 같은 계정으로 연결되는지 검증합니다. [카카오 로그인 오류 코드](https://developers.kakao.com/docs/ko/kakaologin/trouble-shooting)

카카오에서 분리를 적용하면 기존 `profile` 설정으로 되돌릴 수 없습니다. 운영 복구에는 분리된 두 Scope를 요청하는 버전을 사용합니다. [카카오 프로필 동의항목 전환 주의사항](https://devtalk.kakao.com/t/request-to-change-scope-for-profile/116264)

---

## OAuth 로그인 흐름

```txt
사용자 로그인 버튼 클릭
→ /api/auth/[provider]
→ createOAuthAuthorizeUrl()
→ OAuth provider authorize page로 redirect
→ /api/auth/[provider]/callback
→ state cookie 검증
→ authorization code로 access token 교환
→ provider profile 조회
→ findOrCreateOAuthUserService()
→ createAuthSession()
→ session cookie 저장
→ 앱 내부 페이지로 redirect
```

---

## 앱 Route Handler 예시

### OAuth 시작 route

```ts
// apps/web/src/app/api/auth/[provider]/route.ts
import { type NextRequest, NextResponse } from "next/server";

import { createOAuthAuthorizeUrl, parseOAuthProviderId } from "@repo/auth/server";
import { serverEnv } from "@repo/env/server";

export const runtime = "nodejs";

interface OAuthStartRouteContext {
  params: Promise<{
    provider: string;
  }>;
}

function createWebUrl(pathname: string): URL {
  return new URL(pathname, serverEnv.WEB_APP_URL);
}

export async function GET(
  _request: NextRequest,
  context: OAuthStartRouteContext,
): Promise<NextResponse> {
  const { provider } = await context.params;
  const providerId = parseOAuthProviderId(provider);

  if (!providerId) {
    return NextResponse.redirect(createWebUrl("/login?error=invalid_oauth_provider"));
  }

  const authorizeUrl = await createOAuthAuthorizeUrl({
    providerId,
    appBaseUrl: serverEnv.WEB_APP_URL,
    callbackPath: `/api/auth/${providerId}/callback`,
  });

  return NextResponse.redirect(authorizeUrl);
}
```

### OAuth callback route

```ts
// apps/web/src/app/api/auth/[provider]/callback/route.ts
import { type NextRequest, NextResponse } from "next/server";

import { handleOAuthCallback, parseOAuthProviderId } from "@repo/auth/server";
import { USER_ERROR_CODE } from "@repo/domain/user/server";
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
  } catch (error) {
    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === USER_ERROR_CODE.OAUTH_EMAIL_CONFLICT
        ? "oauth_email_conflict"
        : "oauth_failed";

    return NextResponse.redirect(createWebUrl(`/login?error=${errorCode}`));
  }
}
```

---

## 로그인 버튼 예시

OAuth 로그인은 일반 링크보다 `GET form` 사용을 권장합니다.

```tsx
const OAuthLoginProviders = [
  {
    href: "/api/auth/google",
    label: "Google로 계속하기",
  },
  {
    href: "/api/auth/naver",
    label: "Naver로 계속하기",
  },
  {
    href: "/api/auth/kakao",
    label: "Kakao로 계속하기",
  },
] as const;

export function SocialLoginButtons() {
  return (
    <div className="flex w-full flex-col gap-3">
      {OAuthLoginProviders.map((provider) => (
        <form key={provider.href} action={provider.href} method="get">
          <button type="submit">{provider.label}</button>
        </form>
      ))}
    </div>
  );
}
```

---

## 로그아웃

로그아웃은 상태 변경 작업이므로 `POST` Route Handler로 처리합니다.

```ts
// apps/web/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

import { revokeCurrentAuthSession } from "@repo/auth/server";
import { serverEnv } from "@repo/env/server";

export const runtime = "nodejs";

function createWebUrl(pathname: string): URL {
  return new URL(pathname, serverEnv.WEB_APP_URL);
}

export async function POST(): Promise<NextResponse> {
  await revokeCurrentAuthSession();

  return NextResponse.redirect(createWebUrl("/login"), {
    status: 303,
  });
}
```

UI에서는 다음처럼 호출합니다.

```tsx
<form action="/api/auth/logout" method="post">
  <button type="submit">로그아웃</button>
</form>
```

---

## Guard

### 현재 세션 조회

```ts
import { getCurrentSession } from "@repo/auth/server";

const session = await getCurrentSession();
```

세션이 없거나, 폐기되었거나, 만료되었거나, 사용자가 `ACTIVE` 상태가 아니면 `null`을 반환합니다.

### 로그인 사용자 필수

```ts
import { requireUser } from "@repo/auth/server";

const session = await requireUser();
```

세션이 없으면 `AUTH_UNAUTHORIZED` 에러를 throw합니다.

### 관리자 필수

```ts
import { requireAdmin } from "@repo/auth/server";

const session = await requireAdmin();
```

세션이 없으면 `AUTH_UNAUTHORIZED` 에러를 throw합니다.
사용자 권한이 `ADMIN`이 아니면 `AUTH_FORBIDDEN` 에러를 throw합니다.

---

## 보호 페이지 예시

```tsx
import { redirect } from "next/navigation";

import { requireUser } from "@repo/auth/server";

async function getRequiredUserSession() {
  try {
    return await requireUser();
  } catch {
    redirect("/login?error=unauthorized");
  }
}

export default async function MyPage() {
  const session = await getRequiredUserSession();

  return (
    <main>
      <h1>내 프로필</h1>
      <p>{session.user.email}</p>
    </main>
  );
}
```

관리자 페이지에서는 `requireAdmin()`을 사용합니다.

```tsx
import { redirect } from "next/navigation";

import { AUTH_ERROR_CODE, requireAdmin } from "@repo/auth/server";

function isAuthError(error: unknown): error is { code: string } {
  return (
    typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
  );
}

async function getRequiredAdminSession() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (isAuthError(error) && error.code === AUTH_ERROR_CODE.FORBIDDEN) {
      redirect("/login?error=forbidden");
    }

    redirect("/login?error=unauthorized");
  }
}

export default async function AdminHomePage() {
  const session = await getRequiredAdminSession();

  return (
    <main>
      <h1>관리자 홈</h1>
      <p>{session.user.email}</p>
    </main>
  );
}
```

---

## 세션 정책

`@repo/auth`는 JWT 세션이 아니라 DB 세션을 사용합니다.

```txt
브라우저 cookie
  raw session token 저장

database.user_sessions
  sha256(token) 저장
```

쿠키에 저장되는 원본 토큰은 DB에 저장하지 않습니다.
DB에는 `tokenHash`만 저장합니다.

세션이 유효하려면 다음 조건을 모두 만족해야 합니다.

```txt
UserSession 존재
revokedAt === null
expiresAt > now
user.status === ACTIVE
user.deletedAt === null
```

---

## OAuth state 정책

OAuth state는 CSRF 방어를 위해 사용합니다.

```txt
OAuth 시작
→ random state 생성
→ httpOnly cookie 저장
→ provider authorize URL에 state 포함
→ callback에서 query state와 cookie state 비교
→ 검증 후 state cookie 삭제
```

state cookie는 provider별로 분리됩니다.

```txt
{AUTH_SESSION_COOKIE_NAME}_google_oauth_state
{AUTH_SESSION_COOKIE_NAME}_naver_oauth_state
{AUTH_SESSION_COOKIE_NAME}_kakao_oauth_state
```

---

## 에러 코드

```ts
export const AUTH_ERROR_CODE = {
  UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  FORBIDDEN: "AUTH_FORBIDDEN",
  OAUTH_MISSING_CODE: "AUTH_OAUTH_MISSING_CODE",
  OAUTH_INVALID_STATE: "AUTH_OAUTH_INVALID_STATE",
  OAUTH_REQUEST_FAILED: "AUTH_OAUTH_REQUEST_FAILED",
  OAUTH_INVALID_TOKEN_RESPONSE: "AUTH_OAUTH_INVALID_TOKEN_RESPONSE",
  OAUTH_INVALID_PROFILE_RESPONSE: "AUTH_OAUTH_INVALID_PROFILE_RESPONSE",
} as const;
```

앱에서는 일반적으로 아래처럼 query string으로 변환해 사용자에게 표시합니다.

```txt
AUTH_UNAUTHORIZED → /login?error=unauthorized
AUTH_FORBIDDEN → /login?error=forbidden
USER_OAUTH_EMAIL_CONFLICT → /login?error=oauth_email_conflict
그 외 OAuth 실패 → /login?error=oauth_failed
```

계정 식별, 이메일 충돌, Kakao 이메일 검증 정책은 [보안 및 운영 기본 정책](../../docs/17_보안_및_운영_기본정책.md#51-oauth-identity와-이메일-충돌)을 따릅니다.

---

## 테스트

`@repo/auth`는 Vitest node 환경에서 테스트합니다.

```bash
pnpm --filter @repo/auth test
pnpm --filter @repo/auth test:watch
```

현재 테스트 대상은 다음과 같습니다.

```txt
session-token.test.ts
  세션 토큰 생성
  세션 토큰 해싱
  세션 만료 시간 생성

oauth-provider.test.ts
  provider id 판별
  provider config 조회
  provider id → AuthProvider 변환

session.service.test.ts
  세션 생성
  세션 조회
  만료/폐기/비활성 사용자 필터링
  현재 세션 조회
  세션 폐기

oauth-callback.test.ts
  code 누락
  state 검증 실패
  provider별 profile resolver 호출
  사용자 생성/이메일 충돌 실패
  세션 생성 성공
```

---

## 스크립트

```bash
pnpm --filter @repo/auth lint
pnpm --filter @repo/auth lint:fix
pnpm --filter @repo/auth check-types
pnpm --filter @repo/auth test
pnpm --filter @repo/auth test:watch
```

---

## 주의사항

### 1. 이 패키지는 서버 전용이다

`@repo/auth/server`는 `next/headers`, `server-only`, DB repository, server env를 사용합니다.

클라이언트 컴포넌트에서 import하면 안 됩니다.

```tsx
"use client";

import { requireUser } from "@repo/auth/server"; // 금지
```

### 2. OAuth token은 저장하지 않는다

현재 구조에서는 provider access token과 refresh token을 저장하지 않습니다.

OAuth token은 로그인 순간 provider profile을 조회하는 데만 사용합니다.

### 3. Provider profile은 auth에서 정규화한다

Google, Naver, Kakao 응답 형식은 서로 다릅니다.

`@repo/auth`는 이를 아래 공통 형식으로 변환합니다.

```ts
export interface OAuthProfile {
  provider: "GOOGLE" | "NAVER" | "KAKAO";
  providerUserId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}
```

### 4. 사용자 생성/연결 규칙은 domain이 담당한다

`@repo/auth`는 `findOrCreateOAuthUserService()`를 호출할 뿐입니다.

사용자 상태 검증, 기존 OAuth 계정 조회, 이메일 충돌 처리, 신규 사용자 생성은 `@repo/domain/user`에 둡니다.

### 5. 앱 route에서 callbackPath를 실제 경로와 맞춰야 한다

현재 route 구조가 아래라면,

```txt
app/api/auth/[provider]/callback/route.ts
```

callbackPath는 반드시 아래처럼 넘겨야 합니다.

```ts
callbackPath: `/api/auth/${providerId}/callback`;
```

경로가 OAuth provider 콘솔에 등록된 redirect URI와 다르면 로그인에 실패합니다.
