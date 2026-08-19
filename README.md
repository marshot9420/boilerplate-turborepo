# boilerplate-turborepo

Turborepo 기반 Next.js 풀스택 보일러플레이트입니다.

서비스 앱과 관리자 앱을 함께 운영하는 모노레포를 빠르게 시작하기 위해 만들었습니다.

## 핵심 구성

```txt
Turborepo
pnpm workspace
Next.js App Router
Server Actions
Prisma
Zod
Vitest
Playwright
Storybook
Resend
```

## 요구 환경

```txt
Node.js >= 24.16.0 < 25
pnpm >= 11.6.0 < 12
```

현재 루트 설정은 다음 버전을 기준으로 합니다.

```txt
pnpm 11.9.0
TypeScript 5.9.2
Turborepo 2.10.0
Vitest 4.1.8
Playwright 1.61.1
Prettier 3.7.4
```

## 빠른 시작

```bash
corepack enable
pnpm install
pnpm dev
```

## 새 프로젝트로 초기화

이 저장소를 새 프로젝트의 출발점으로 사용할 경우 `init-project`를 실행합니다.

```bash
pnpm init-project <project-name>
```

예시:

```bash
pnpm init-project mars
```

초기화 스크립트는 기본적으로 다음 값을 새 프로젝트에 맞게 변경합니다.

```txt
boilerplate-turborepo → <project-name>
boilerplate_turborepo → <project_name>
@repo → @<project-name>
boilerplate_session → <project_name>_session
```

또한 example env 파일이 있으면 local env 파일을 생성합니다.

```txt
.env.example → .env.local
.env.test.example → .env.test.local
.env.e2e.example → .env.e2e.local
```

실제 변경 전에 결과만 확인하려면 `--dry-run`을 사용합니다.

```bash
pnpm init-project mars --dry-run
```

패키지 scope를 프로젝트명과 다르게 지정하려면 `--scope`를 사용합니다.

```bash
pnpm init-project mars --scope eten
```

기존 `.git` 디렉터리 처리 방식도 지정할 수 있습니다.

```bash
pnpm init-project mars --remove-git
pnpm init-project mars --keep-git
```

## Scope 변경

이미 초기화된 프로젝트에서 패키지 scope만 변경하려면 `setup:scope`를 사용합니다.

```bash
pnpm setup:scope <scope-name>
```

예시:

```bash
pnpm setup:scope mars
```

기존 scope가 `@repo`가 아니라면 `--from`을 지정합니다.

```bash
pnpm setup:scope eten --from mars
```

실제 변경 전에 결과만 확인하려면 `--dry-run`을 사용합니다.

```bash
pnpm setup:scope eten --from mars --dry-run
```

## 프로젝트 구조

```txt
apps/
  admin/
  web/

packages/
  auth/
  core/
  database/
  design-system/
  domain/
  env/
  eslint-config/
  mailer/
  playwright-config/
  storage/
  storybook-config/
  typescript-config/
  vitest-config/

tooling/
  generators/
  scripts/

docs/
```

## 앱

### `apps/web`

사용자용 서비스 앱입니다.

### `apps/admin`

관리자용 앱입니다.

## 주요 패키지

| 패키지                | 역할                                                        |
| --------------------- | ----------------------------------------------------------- |
| `@repo/auth`          | 인증, 세션, 권한 확인                                       |
| `@repo/core`          | Result, AppError, 공통 유틸, 로깅, 검증 helper              |
| `@repo/database`      | Prisma schema, Prisma client, repository                    |
| `@repo/design-system` | 공통 UI, 앱별 UI wrapper, form/toast helper                 |
| `@repo/domain`        | 도메인 schema, DTO, service, mapper, permission             |
| `@repo/env`           | 환경변수 검증                                               |
| `@repo/storage`       | 이미지 및 파일 업로드 provider                              |
| `@repo/mailer`        | Resend 기반 이메일 발송 provider                            |
| `@repo/*-config`      | ESLint, TypeScript, Vitest, Playwright, Storybook 공통 설정 |

## 기본 아키텍처

기본 흐름은 다음과 같습니다.

```txt
UI
 → Server Action
   → Domain Service
     → Repository
       → Prisma
```

중요한 원칙은 다음과 같습니다.

```txt
앱은 조립 계층으로 둔다.
비즈니스 로직은 domain service에 둔다.
DB 접근은 database repository로 제한한다.
공통 설정은 config package로 관리한다.
패키지 의존성 방향을 깨지 않는다.
```

자세한 내용은 [`docs/01_아키텍처.md`](./docs/01_아키텍처.md)를 참고합니다.

## 코드 생성기

반복적인 파일 생성을 줄이기 위해 generator를 제공합니다.

```bash
pnpm generate <type> <name> [options]
```

사용 가능한 generator는 다음과 같습니다.

```txt
domain
component
feature
```

도메인 생성 예시:

```bash
pnpm generate domain content
```

디자인 시스템 컴포넌트 생성 예시:

```bash
pnpm generate component empty-state --target all --category feedback
pnpm generate component phone-input --target primitive --category inputs
pnpm generate component phone-input --target web --category inputs --primitive phone-input
pnpm generate component phone-input --target admin --category inputs --primitive phone-input
```

앱 feature 생성 예시:

```bash
pnpm generate feature content-status --app admin
pnpm generate feature update-profile --app web
pnpm generate feature admin content-status
pnpm generate feature web update-profile
```

## 주요 명령어

### 개발

```bash
pnpm dev
pnpm build
pnpm clean
```

### 검사

```bash
pnpm lint
pnpm lint:fix
pnpm check-types
pnpm format
pnpm format:check
pnpm check:boundaries
pnpm check
```

### 테스트

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:integration
pnpm test:integration:watch
pnpm test:e2e
pnpm test:e2e:ui
pnpm test:e2e:headed
```

Playwright 브라우저가 설치되어 있지 않다면 다음 명령어를 실행합니다.

```bash
pnpm playwright:install
```

### 데이터베이스

```bash
pnpm db:generate
pnpm db:push
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

테스트 DB 또는 E2E DB를 직접 다룰 때는 다음 명령어를 사용합니다.

```bash
pnpm db:test:push
pnpm db:test:generate
pnpm db:test:migrate

pnpm db:e2e:push
pnpm db:e2e:generate
pnpm db:e2e:migrate
pnpm db:e2e:seed
```

### 스크립트

```bash
pnpm init-project <project-name>
pnpm setup:scope <scope-name>
pnpm scripts:clean
```

## 문서

세부 문서는 `docs` 디렉터리에서 관리합니다.

| 문서                                           | 설명                                                |
| ---------------------------------------------- | --------------------------------------------------- |
| [`docs/01_아키텍처.md`](./docs/01_아키텍처.md) | 전체 구조, 계층, 패키지 책임, 의존성 방향           |
| [`docs/02_기본설정.md`](./docs/02_기본설정.md) | 루트 설정, TypeScript, ESLint, Vitest, Storybook 등 |

각 앱과 패키지에도 필요한 경우 별도의 `README.md`를 둡니다.

```txt
apps/*/README.md
packages/*/README.md
tooling/*/README.md
```

## 작업 후 체크

작업 후 기본적으로 다음 명령어를 실행합니다.

```bash
pnpm check
pnpm test
```

DB, repository, service 동작을 변경했다면 통합 테스트도 실행합니다.

```bash
pnpm test:integration
```

사용자 플로우나 관리자 플로우에 영향을 주는 변경이라면 E2E 테스트를 실행합니다.

```bash
pnpm test:e2e
```

## 라이선스

현재 이 저장소는 private boilerplate입니다.

배포 방식에 맞게 라이선스 정책을 별도로 정하세요.
