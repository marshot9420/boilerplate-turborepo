# `@repo/playwright-config`

Turborepo 보일러플레이트에서 사용하는 Playwright E2E 테스트 공용 설정 패키지입니다.

`apps/web`, `apps/admin` 같은 Next.js 앱의 E2E 테스트 설정을 중앙화합니다.

---

# 목적

`@repo/playwright-config`는 다음 목적을 위해 존재합니다.

```txt
Playwright 설정 중복 제거
앱별 E2E 서버 실행 방식 표준화
E2E 전용 환경변수 로딩 표준화
브라우저 프로젝트, 리포터, trace, screenshot, video 정책 통일
```

각 앱은 자신의 포트와 baseURL만 지정하고, 나머지 Playwright 설정은 이 패키지의 공용 factory를 사용합니다.

---

# 현재 구조

```txt
packages/playwright-config/
├─ README.md
├─ eslint.config.js
├─ index.ts
├─ load-env.ts
├─ next-app.ts
├─ package.json
└─ tsconfig.json
```

---

# 제공 기능

## `loadPlaywrightEnv()`

루트 환경변수 파일을 로드합니다.

로드 순서는 다음과 같습니다.

```txt
.env.local
.env.e2e.local
```

`.env.e2e.local`이 나중에 로드되므로 E2E 실행 시 필요한 값은 `.env.local` 값을 덮어쓸 수 있습니다.

주요 사용 위치:

```txt
apps/web/playwright.config.ts
apps/admin/playwright.config.ts
```

예:

```ts
import { defineConfig } from "@playwright/test";

import { createNextAppE2EConfig, loadPlaywrightEnv } from "@repo/playwright-config";

loadPlaywrightEnv();

const port = Number(process.env.WEB_E2E_PORT ?? 3100);
const baseURL = process.env.WEB_E2E_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  ...createNextAppE2EConfig({
    baseURL,
    devCommand: `pnpm exec next dev --port ${port}`,
    ciCommand: `pnpm build && pnpm exec next start --port ${port}`,
  }),

  globalSetup: "./e2e/auth.setup.ts",
});
```

---

## `createNextAppE2EConfig()`

Next.js 앱용 Playwright 설정을 생성합니다.

공통으로 설정하는 항목은 다음과 같습니다.

```txt
testDir
fullyParallel
forbidOnly
retries
workers
reporter
baseURL
trace
screenshot
video
webServer
browser projects
outputDir
```

기본 브라우저 프로젝트는 다음과 같습니다.

```txt
chromium
mobile-chrome
```

초기 E2E 테스트는 실행 속도와 안정성을 위해 Chromium 계열 중심으로 검증합니다.

---

# 앱별 적용 방식

각 앱은 자신의 `playwright.config.ts`에서 공용 설정을 사용합니다.

## `apps/web/playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

import { createNextAppE2EConfig, loadPlaywrightEnv } from "@repo/playwright-config";

loadPlaywrightEnv();

const port = Number(process.env.WEB_E2E_PORT ?? 3100);
const baseURL = process.env.WEB_E2E_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  ...createNextAppE2EConfig({
    baseURL,
    devCommand: `pnpm exec next dev --port ${port}`,
    ciCommand: `pnpm build && pnpm exec next start --port ${port}`,
  }),

  globalSetup: "./e2e/auth.setup.ts",
});
```

## `apps/admin/playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

import { createNextAppE2EConfig, loadPlaywrightEnv } from "@repo/playwright-config";

loadPlaywrightEnv();

const port = Number(process.env.ADMIN_E2E_PORT ?? 3101);
const baseURL = process.env.ADMIN_E2E_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  ...createNextAppE2EConfig({
    baseURL,
    devCommand: `pnpm exec next dev --port ${port}`,
    ciCommand: `pnpm build && pnpm exec next start --port ${port}`,
  }),

  globalSetup: "./e2e/auth.setup.ts",
});
```

---

# E2E 환경변수

E2E 전용 환경변수는 루트의 `.env.e2e.local`에 둡니다.

```txt
boilerplate-turborepo/
├─ .env.local
├─ .env.test.local
└─ .env.e2e.local
```

각 파일의 역할은 다음과 같습니다.

```txt
.env.local
  로컬 개발 서버용

.env.test.local
  Vitest 통합 테스트용

.env.e2e.local
  Playwright E2E 테스트용
```

예:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boilerplate_turborepo_e2e?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/boilerplate_turborepo_e2e?schema=public"

WEB_APP_URL=http://localhost:3100
ADMIN_APP_URL=http://localhost:3101

WEB_E2E_PORT=3100
WEB_E2E_BASE_URL=http://localhost:3100

ADMIN_E2E_PORT=3101
ADMIN_E2E_BASE_URL=http://localhost:3101

E2E_AUTH_SECRET=replace-with-random-secret-at-least-32-chars

AUTH_SESSION_COOKIE_NAME=boilerplate_session
AUTH_SESSION_MAX_AGE_SECONDS=2592000

GOOGLE_CLIENT_ID=dummy-google-client-id
GOOGLE_CLIENT_SECRET=dummy-google-client-secret

NAVER_CLIENT_ID=dummy-naver-client-id
NAVER_CLIENT_SECRET=dummy-naver-client-secret

KAKAO_CLIENT_ID=dummy-kakao-client-id
KAKAO_CLIENT_SECRET=dummy-kakao-client-secret
```

`CI`는 로컬 `.env.e2e.local`에 넣지 않습니다.

```txt
로컬
  CI 설정 안 함

CI 환경
  CI=true
```

---

# E2E 인증 전략

E2E 전용 API route는 만들지 않습니다.

대신 다음 방식으로 로그인 상태를 만듭니다.

```txt
1. E2E seed로 테스트 사용자/관리자 계정 생성
2. Playwright globalSetup에서 DB 세션 생성
3. AUTH_SESSION_COOKIE_NAME으로 쿠키 설정
4. storageState JSON 생성
5. 로그인 필요한 spec에서 storageState 사용
```

생성되는 storageState 파일 예:

```txt
apps/web/e2e/.auth/user.json
apps/admin/e2e/.auth/admin.json
```

이 파일들은 테스트 실행 중 생성되는 산출물이므로 git에 포함하지 않습니다.

---

# E2E 테스트 실행

루트에서 실행합니다.

```bash
pnpm test:e2e
```

앱별로 실행할 수도 있습니다.

```bash
pnpm --filter web test:e2e
pnpm --filter admin test:e2e
```

UI 모드는 앱별 실행을 권장합니다.

```bash
pnpm --filter web test:e2e:ui
pnpm --filter admin test:e2e:ui
```

---

# DB 준비

E2E 테스트는 통합 테스트와 별도의 DB를 사용합니다.

루트 스크립트 기준:

```bash
pnpm db:e2e:push
pnpm db:e2e:seed
```

일반적인 실행 흐름은 다음과 같습니다.

```txt
1. E2E DB schema push
2. E2E seed 실행
3. Playwright 테스트 실행
```

루트 `test:e2e` 스크립트에서 이 흐름을 함께 실행합니다.

---

# 테스트 파일 위치

E2E 테스트 파일은 각 앱의 `e2e` 디렉터리에 둡니다.

```txt
apps/web/e2e/
├─ smoke.spec.ts
└─ auth.setup.ts

apps/admin/e2e/
├─ auth-guard.spec.ts
└─ auth.setup.ts
```

테스트 파일명은 다음 규칙을 사용합니다.

```txt
*.spec.ts
```

예:

```txt
smoke.spec.ts
auth-guard.spec.ts
content-flow.spec.ts
admin-content.spec.ts
```

---

# storageState 사용 예시

로그인된 일반 사용자 테스트:

```ts
import { expect, test } from "@playwright/test";

test.use({
  storageState: "e2e/.auth/user.json",
});

test.describe("Web Auth E2E", () => {
  test("로그인 사용자는 보호 페이지에 접근할 수 있다", async ({ page }) => {
    await page.goto("/my");

    await expect(page.locator("body")).toBeVisible();
  });
});
```

로그인된 관리자 테스트:

```ts
import { expect, test } from "@playwright/test";

test.use({
  storageState: "e2e/.auth/admin.json",
});

test.describe("Admin Auth E2E", () => {
  test("관리자는 관리자 홈에 접근할 수 있다", async ({ page }) => {
    await page.goto("/");

    await expect(page).not.toHaveURL(/\/login(?:[/?#]|$)/);
    await expect(page.locator("body")).toBeVisible();
  });
});
```

---

# 주의사항

## E2E용 API route를 만들지 않는다

E2E 전용 로그인 route를 App Router에 추가하지 않습니다.

```txt
apps/web/src/app/api/e2e/login/route.ts
apps/admin/src/app/api/e2e/login/route.ts
```

위와 같은 테스트 전용 route는 만들지 않습니다.

테스트 인증은 DB 세션 생성과 Playwright storageState로 처리합니다.

## `.env.test.local`과 섞지 않는다

`.env.test.local`은 Vitest 통합 테스트 전용입니다.

Playwright E2E는 `.env.e2e.local`을 사용합니다.

## `NODE_ENV=test`를 `.env.e2e.local`에 넣지 않는다

Playwright는 테스트 러너이지만, Next.js 앱은 `next dev` 또는 `next start`로 실행됩니다.

따라서 `.env.e2e.local`에 `NODE_ENV=test`를 넣지 않습니다.

## `CI=false`를 로컬 env에 넣지 않는다

로컬에서는 `CI`를 설정하지 않습니다.

일부 도구는 `CI` 값이 존재하는 것만으로 CI 환경으로 판단할 수 있습니다.

---

# 패키지 경계

이 패키지는 Playwright 설정만 담당합니다.

포함하는 것:

```txt
Playwright 공용 설정
E2E env 로딩
Next.js 앱 webServer 설정 factory
브라우저 프로젝트 설정
trace/screenshot/video/reporter 정책
```

포함하지 않는 것:

```txt
테스트 데이터 seed
DB session 생성
개별 앱 테스트 코드
앱 라우트
도메인 로직
```

테스트 데이터 생성은 `@repo/scripts`가 담당합니다.

앱별 인증 setup과 spec은 각 앱의 `e2e` 디렉터리가 담당합니다.
