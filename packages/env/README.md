# @repo/env

Turborepo 보일러플레이트에서 사용하는 환경변수 검증 패키지입니다.

`zod`를 사용해 서버 환경변수와 클라이언트 환경변수를 분리해서 검증합니다.

## 역할

```txt
server.ts
  서버 전용 환경변수

client.ts
  클라이언트에서 접근 가능한 NEXT_PUBLIC_* 환경변수

shared.ts
  서버/클라이언트 공통 환경변수 스키마
```

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

## Server Env

```ts
import { serverEnv } from "@repo/env/server";

const databaseUrl = serverEnv.DATABASE_URL;
const authSecret = serverEnv.AUTH_SECRET;
```

`serverEnv`는 서버 전용 코드에서만 사용해야 합니다.

예:

```txt
사용 가능
  Server Component
  Server Action
  Route Handler
  packages/database
  packages/auth-next

사용 금지
  Client Component
  브라우저에서 실행되는 코드
```

## Client Env

```ts
import { clientEnv } from "@repo/env/client";

const appUrl = clientEnv.NEXT_PUBLIC_APP_URL;
```

클라이언트 환경변수는 반드시 `NEXT_PUBLIC_` 접두사를 가진 값만 포함합니다.

## Shared Env

```ts
import { sharedEnvSchema } from "@repo/env/shared";

const parsed = sharedEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
});
```

현재 공통 환경변수는 다음 값을 포함합니다.

```txt
NODE_ENV
  development | test | production
```

## 현재 필요한 환경변수

루트 `.env` 또는 배포 환경에 다음 값을 설정합니다.

```env
NODE_ENV=development
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 검증

```bash
pnpm --filter @repo/env lint
pnpm --filter @repo/env check-types
```

## 사용 원칙

`@repo/env/server`는 서버 코드에서만 import합니다.

`@repo/env/client`는 클라이언트에서 사용 가능한 공개 환경변수만 다룹니다.

환경변수가 추가되면 사용하는 위치에 따라 `server.ts`, `client.ts`, `shared.ts` 중 하나에만 추가합니다.
