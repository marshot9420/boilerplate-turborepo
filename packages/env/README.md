# @repo/env

Turborepo 보일러플레이트에서 공통으로 사용하는 환경변수 검증 Package입니다.

`zod`를 사용하여 Server, Client, Shared 환경변수의 경계를 명확하게 나누고, Runtime에서 필요한 값이 올바르게 설정되어 있는지 검증합니다.

이 Package는 **Repository 전체에서 공통으로 사용하는 환경변수 계약**만 담당합니다.

특정 앱에서만 사용하는 환경변수는 해당 앱의 `src/config`에서 별도로 검증합니다.

---

## 역할

```txt
server.ts
  여러 앱과 Server Package에서 공통으로 사용하는 Server 환경변수

client.ts
  Browser에서도 안전하게 접근할 수 있는 공통 환경변수

shared.ts
  Server / Client가 함께 사용하는 공통 환경변수 Schema
```

기본 책임:

```txt
@repo/env
  공통 환경변수의 Schema와 Typed API 제공

apps/*/src/config
  앱별 환경변수의 Schema와 Typed API 제공
```

예:

```txt
@repo/env/server
  DATABASE_URL
  AUTH_SESSION_*
  OAuth 설정
  Mail 설정

apps/web/src/config/server-env.ts
  WEB_APP_URL

apps/admin/src/config/server-env.ts
  ADMIN_APP_URL
```

---

## 구조

```txt
packages/env/
├─ src/
│  ├─ client.ts
│  ├─ server.ts
│  └─ shared.ts
├─ eslint.config.js
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## Server Env

Server 전용 환경변수는 `@repo/env/server`를 통해 사용합니다.

```ts
import { serverEnv } from "@repo/env/server";

const databaseUrl = serverEnv.DATABASE_URL;
const sessionCookieName = serverEnv.AUTH_SESSION_COOKIE_NAME;
```

`serverEnv`는 `server-only` 경계를 가지며 Browser에서 실행될 수 있는 코드에서 import하지 않습니다.

사용 가능한 대표 영역:

```txt
Server Component
Server Action
Route Handler
packages/database
packages/auth
packages/mailer
기타 Server Runtime 코드
```

사용하면 안 되는 영역:

```txt
"use client" Component
Browser에서 실행되는 Hook
Client-side Utility
Client Bundle에 포함되는 코드
```

---

## 현재 공통 Server Env

현재 `@repo/env/server`에서 검증하는 주요 환경변수는 다음과 같습니다.

### Database

```txt
DATABASE_URL
DIRECT_URL
```

### Authentication

```txt
AUTH_SESSION_COOKIE_NAME
AUTH_SESSION_MAX_AGE_SECONDS
```

### OAuth

```txt
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

NAVER_CLIENT_ID
NAVER_CLIENT_SECRET

KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
```

### Mail

```txt
MAIL_PROVIDER
MAIL_FROM
RESEND_API_KEY
```

### E2E

```txt
E2E_AUTH_SECRET
```

`E2E_AUTH_SECRET`은 필요한 환경에서만 사용하므로 optional입니다.

---

## 조건부 환경변수

일부 환경변수는 다른 설정값에 따라 필수가 됩니다.

예를 들어:

```txt
MAIL_PROVIDER=console
  MAIL_FROM optional
  RESEND_API_KEY optional

MAIL_PROVIDER=resend
  MAIL_FROM required
  RESEND_API_KEY required
```

이러한 관계는 `serverEnvSchema.superRefine()`에서 검증합니다.

Provider를 추가하거나 조건부 설정이 생기면 단순히 모든 값을 항상 required로 만들기보다 실제 Runtime 조건을 Schema에 표현합니다.

---

## Client Env

Client 환경변수는 `@repo/env/client`를 통해 사용합니다.

현재 공통 Client Env에는 `NODE_ENV`만 포함되어 있습니다.

```ts
import { clientEnv } from "@repo/env/client";

const nodeEnv = clientEnv.NODE_ENV;
```

현재 보일러플레이트에는 공통 `NEXT_PUBLIC_*` 환경변수가 없습니다.

이는 Client Env가 필요 없다는 의미가 아니라, **Browser에 공개할 필요가 있는 값만 명시적으로 추가한다**는 의미입니다.

---

## `NEXT_PUBLIC_*` 사용 기준

Next.js에서 `NEXT_PUBLIC_*` 환경변수는 Client Bundle에 포함될 수 있으므로 공개 가능한 값만 사용합니다.

기본 원칙:

```txt
Server에서만 필요한 값
→ 일반 환경변수

Browser JavaScript에서 반드시 필요한 값
→ NEXT_PUBLIC_*

공개 여부가 애매한 값
→ Server 환경변수로 시작
```

다음 값은 `NEXT_PUBLIC_*`로 만들면 안 됩니다.

```txt
Database URL
Secret
API Secret Key
OAuth Client Secret
Session Secret
Private Token
Provider Credential
```

앱 URL처럼 Server에서만 사용하는 값도 Browser에서 직접 필요하지 않다면 `NEXT_PUBLIC_*`로 노출하지 않습니다.

---

## 앱 전용 환경변수

특정 앱에서만 의미가 있는 환경변수는 `@repo/env`에 추가하지 않습니다.

예:

```txt
WEB_APP_URL
ADMIN_APP_URL
```

각 앱에서 다음과 같이 관리합니다.

```txt
apps/web/src/config/server-env.ts
  WEB_APP_URL

apps/admin/src/config/server-env.ts
  ADMIN_APP_URL
```

앱에서는 공통 Server Env를 확장합니다.

개념적인 구조:

```txt
@repo/env/server
       ↓
commonServerEnv
       +
앱 전용 Schema
       ↓
apps/*/src/config/server-env.ts
```

이를 통해 공통 Package가 특정 앱의 존재나 이름을 알지 않도록 합니다.

---

## 앱 URL

각 앱의 URL은 Server 환경변수로 관리합니다.

```txt
web
  WEB_APP_URL

admin
  ADMIN_APP_URL
```

예:

```env
WEB_APP_URL="http://localhost:3000"
ADMIN_APP_URL="http://localhost:3001"
```

앱의 `server-env.ts`에서는 명시적인 앱 URL이 없는 배포 환경을 위해 필요한 경우 Platform 환경변수를 fallback으로 사용할 수 있습니다.

현재 Vercel 배포에서는 다음 값을 fallback으로 사용할 수 있습니다.

```txt
VERCEL_PROJECT_PRODUCTION_URL
```

앱 URL은 `metadataBase` 등 Server 영역에서도 사용할 수 있으므로 이를 위해 별도의 `NEXT_PUBLIC_APP_URL`을 만들지 않습니다.

---

## Shared Env

Server와 Client에서 공통으로 사용하는 환경변수는 `shared.ts`에서 관리합니다.

현재는 다음 값만 포함합니다.

```txt
NODE_ENV
```

허용 값:

```txt
development
test
production
```

사용 예:

```ts
import { sharedEnvSchema } from "@repo/env/shared";

const parsed = sharedEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
});
```

실제 앱 코드에서는 일반적으로 `sharedEnvSchema`를 직접 Parse하기보다 `serverEnv` 또는 `clientEnv`를 사용합니다.

---

## 환경변수 파일

로컬 개발 환경에서는 Repository Root의 환경변수 파일을 사용합니다.

대표적인 역할:

```txt
.env.local
  로컬 개발 환경

.env.test
  Test 공통 환경

.env.test.local
  개발자 로컬 Test Override

.env.e2e.local
  로컬 E2E 환경
```

Secret이 포함된 로컬 환경변수 파일은 Git에 Commit하지 않습니다.

Repository에 예제 환경변수 파일을 제공하는 경우 실제 Secret 대신 Placeholder를 사용합니다.

---

## 테스트 환경

Vitest 공통 설정은 다음 파일을 읽습니다.

```txt
.env.test
.env.test.local
```

Test 실행 시:

```txt
NODE_ENV=test
```

를 사용합니다.

환경변수를 테스트 코드에서 임의로 구성하는 대신 가능한 한 공통 Test Environment Loader를 사용합니다.

---

## E2E 환경

E2E에서는 일반 개발 환경과 별도의 환경변수를 사용할 수 있습니다.

예:

```txt
WEB_E2E_PORT
WEB_E2E_BASE_URL

ADMIN_E2E_PORT
ADMIN_E2E_BASE_URL

E2E_AUTH_SECRET
```

Playwright와 E2E Database는 일반 개발 환경과 분리된 값을 사용하도록 구성합니다.

---

## 사용 예

### Server Package

```ts
import { serverEnv } from "@repo/env/server";

const databaseUrl = serverEnv.DATABASE_URL;
```

### App Server Config

```ts
import { serverEnv } from "@/config/server-env";

const appUrl = serverEnv.WEB_APP_URL;
```

또는 admin 앱에서는:

```ts
import { serverEnv } from "@/config/server-env";

const appUrl = serverEnv.ADMIN_APP_URL;
```

### Client

```ts
import { clientEnv } from "@/config/client-env";

const nodeEnv = clientEnv.NODE_ENV;
```

앱 코드에서는 가능한 한 `@repo/env/*`를 직접 여러 곳에서 import하기보다 앱의 `config` 진입점을 사용하는 것을 우선합니다.

---

## 환경변수 추가 기준

환경변수를 추가할 때는 먼저 사용 범위를 판단합니다.

```txt
Server와 Client 모두 필요
→ shared.ts

여러 앱의 Server에서 공통으로 필요
→ server.ts

여러 앱의 Browser에서 공통으로 필요
→ client.ts

특정 앱 Server에서만 필요
→ apps/[app]/src/config/server-env.ts

특정 앱 Browser에서만 필요
→ apps/[app]/src/config/client-env.ts
```

환경변수를 추가했다는 이유만으로 항상 `@repo/env`에 넣지 않습니다.

---

## Secret 관리

Secret은 Server Env에서만 관리합니다.

대표적인 Secret:

```txt
DATABASE_URL
DIRECT_URL
OAuth Client Secret
RESEND_API_KEY
E2E_AUTH_SECRET
```

다음 행위를 금지합니다.

```txt
Secret을 NEXT_PUBLIC_*으로 선언

Secret을 Client Component에서 import

Secret을 console.log로 출력

Secret 전체 값을 Error Message에 포함

Secret을 README 또는 Example Env에 실제 값으로 기록

Secret을 Git Repository에 Commit
```

로그가 필요한 경우 값 자체가 아니라 설정 여부나 Provider 이름 등 비민감 정보만 기록합니다.

예:

```txt
좋음
  Mail provider initialized: resend

나쁨
  RESEND_API_KEY=re_...
```

---

## 검증

Package 자체 검증:

```bash
pnpm --filter @repo/env lint
pnpm --filter @repo/env check-types
```

Repository 전체 검증:

```bash
pnpm check
```

환경변수 구조를 변경했다면 Build와 Test도 함께 확인합니다.

```bash
pnpm build
pnpm test
pnpm test:integration
```

필요한 경우 E2E도 실행합니다.

---

## 관련 설정

환경변수를 추가하거나 제거하면 `@repo/env`만 수정하고 끝내지 않습니다.

필요에 따라 다음 영역도 함께 확인합니다.

```txt
apps/*/src/config
  앱 전용 Schema

.env*
  개발 / 테스트 / E2E 값

turbo.json
  Task에서 사용하는 환경변수와 Cache 관계

.github/workflows/ci.yml
  CI 환경변수

Vercel 등 배포 환경
  실제 Production 값
```

더 이상 사용하지 않는 환경변수를 제거했다면 Repository 전체에서 잔여 참조를 확인할 수 있습니다.

```bash
git grep 'ENV_VARIABLE_NAME'
```

---

## 사용 원칙

```txt
@repo/env는 Repository 공통 환경변수만 담당한다.

앱 전용 환경변수는 apps/*/src/config에서 관리한다.

Server Secret은 @repo/env/server 또는 앱 server-env에서만 사용한다.

Client Env에는 Browser에 공개 가능한 값만 넣는다.

NEXT_PUBLIC_*은 실제 Client Runtime에서 필요한 경우에만 사용한다.

환경변수는 zod Schema를 통해 검증한다.

조건부 필수 값은 Provider 설정과 함께 검증한다.

환경변수 값을 코드에 직접 하드코딩하지 않는다.

Secret을 코드, 로그, 문서, Client Bundle에 노출하지 않는다.

환경변수를 변경하면 Turbo, CI, Test, 배포 설정도 함께 검토한다.
```
