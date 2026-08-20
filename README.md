# boilerplate-turborepo

Turborepo 기반의 Next.js 풀스택 모노레포 보일러플레이트입니다.

사용자용 `web`, 관리자용 `admin` 앱과 Domain / Database / Auth / Design System 등의 공통 Package, Test, Storybook, Generator, 프로젝트 초기화 도구를 기본으로 제공합니다.

<p>
  <img src="https://img.shields.io/badge/Next.js-16.2.0-000000?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000000" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p>
  <img src="https://img.shields.io/badge/Turborepo-2.10.0-EF4444?logo=turborepo&logoColor=white" alt="Turborepo" />
  <img src="https://img.shields.io/badge/pnpm-11.9.0-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Zod-v4-3E67B1?logo=zod&logoColor=white" alt="Zod" />
</p>

<p>
  <img src="https://img.shields.io/badge/Vitest-4.1.8-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Playwright-1.61.1-2EAD33?logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/Storybook-10.4.2-FF4785?logo=storybook&logoColor=white" alt="Storybook" />
  <img src="https://img.shields.io/badge/Resend-Email-000000?logo=resend&logoColor=white" alt="Resend" />
</p>

## 주요 구성

```txt
Next.js App Router + Server Actions

Server First

완화된 Feature-Sliced Design

Domain Service + Repository

Prisma + PostgreSQL

공통 Design System

Vitest + Playwright + Storybook

Code Generator

Project Initialization Script

Claude Code 설정
```

## 요구 환경

```txt
Node.js >= 24.16.0 < 25
pnpm >= 11.6.0 < 12
```

권장 버전은 `.nvmrc`와 루트 `package.json`을 기준으로 합니다.

---

## 새 프로젝트 시작

### 1. Clone

```bash
git clone <repository-url> my-project
cd my-project
```

### 2. 프로젝트 초기화

Dependency 설치 전에 실행합니다.

```bash
pnpm init-project my-project --remove-git
```

Package Scope를 프로젝트 이름과 다르게 사용한다면:

```bash
pnpm init-project my-project \
  --scope my-scope \
  --remove-git
```

실제 변경 전에 확인하려면:

```bash
pnpm init-project my-project \
  --scope my-scope \
  --dry-run
```

초기화 과정에서 Example Env가 존재하면 Local Env 파일도 생성됩니다.

```txt
.env.example
  → .env.local

.env.test.example
  → .env.test.local

.env.e2e.example
  → .env.e2e.local
```

### 3. Dependency 설치

```bash
corepack enable
pnpm install
```

### 4. 환경변수 설정

생성된 `.env.local`에 개발 환경에서 필요한 값을 설정합니다.

환경변수 기준은 [`docs/06_환경변수.md`](./docs/06_환경변수.md)를 참고합니다.

### 5. Database 준비

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 6. 기본 검증

```bash
pnpm check
pnpm test
```

### 7. 개발 시작

```bash
pnpm dev
```

전체 흐름:

```txt
Clone
  ↓
init-project
  ↓
pnpm install
  ↓
Environment
  ↓
Database
  ↓
Seed
  ↓
Check / Test
  ↓
pnpm dev
```

상세한 초기화 방법은 [`docs/15_프로젝트_초기화.md`](./docs/15_프로젝트_초기화.md)를 참고합니다.

---

## 프로젝트 구조

```txt
apps/
├─ web/
└─ admin/

packages/
├─ auth/
├─ core/
├─ database/
├─ design-system/
├─ domain/
├─ env/
├─ mailer/
├─ storage/
└─ *-config/

tooling/
├─ generators/
└─ scripts/

docs/
```

큰 역할은 다음과 같습니다.

```txt
apps
  실행 가능한 Next.js 애플리케이션

packages
  공통 Runtime 기능과 개발 설정

tooling
  Generator와 Repository 자동화

docs
  Architecture와 개발 규칙
```

---

## 기본 아키텍처

Mutation의 기본 흐름:

```txt
UI
  ↓
Server Action
  ↓
Domain Service
  ↓
Repository
  ↓
Prisma
  ↓
Database
```

앱 내부 UI는 다음 방향을 기준으로 구성합니다.

```txt
app
  ↓
views
  ↓
features
  ↓
entities
  ↓
shared / design-system
```

자세한 내용은 [`docs/01_아키텍처.md`](./docs/01_아키텍처.md)를 참고합니다.

---

## 코드 생성기

반복적인 Scaffold는 Generator로 생성할 수 있습니다.

```bash
pnpm generate <type> <name> [options]
```

현재 제공하는 Generator:

```txt
domain
component
entity
feature
view
```

예:

```bash
pnpm generate domain order --repository

pnpm generate entity order-status-badge \
  --app admin \
  --domain order

pnpm generate feature update-profile \
  --app web \
  --domain user \
  --ui update-profile-form

pnpm generate view order-detail-view \
  --app admin \
  --domain order
```

상세 옵션은 [`docs/14_코드_생성기.md`](./docs/14_코드_생성기.md)를 참고합니다.

---

## 주요 명령어

| 목적                  | 명령어                     |
| --------------------- | -------------------------- |
| 개발 서버             | `pnpm dev`                 |
| Production Build      | `pnpm build`               |
| 전체 정적 검증        | `pnpm check`               |
| Lint                  | `pnpm lint`                |
| Type Check            | `pnpm check-types`         |
| Format                | `pnpm format`              |
| Unit / Component Test | `pnpm test`                |
| Integration Test      | `pnpm test:integration`    |
| E2E Test              | `pnpm test:e2e`            |
| Prisma Client 생성    | `pnpm db:generate`         |
| 개발 DB Schema 반영   | `pnpm db:push`             |
| Migration             | `pnpm db:migrate`          |
| Seed                  | `pnpm db:seed`             |
| Prisma Studio         | `pnpm db:studio`           |
| 코드 생성             | `pnpm generate`            |
| 프로젝트 초기화       | `pnpm init-project <name>` |
| Package Scope 변경    | `pnpm setup:scope <scope>` |

전체 명령과 사용 기준은 [`docs/16_개발_워크플로우.md`](./docs/16_개발_워크플로우.md)를 참고합니다.

---

## 작업 완료 전

기본적으로 다음을 실행합니다.

```bash
pnpm check
pnpm test
```

변경 범위에 따라 추가합니다.

```bash
# Persistence 동작 검증
pnpm test:integration

# 주요 Browser Flow 검증
pnpm test:e2e

# Production Boundary 검증
pnpm build
```

모든 변경에서 모든 Test를 실행하는 것이 아니라 현재 변경 범위에 맞는 검증을 수행합니다.

---

## 문서

처음 프로젝트를 확인한다면 다음 순서로 시작합니다.

1. [`docs/00_문서_가이드.md`](./docs/00_문서_가이드.md)
2. [`docs/01_아키텍처.md`](./docs/01_아키텍처.md)
3. [`docs/03_프로젝트_구조.md`](./docs/03_프로젝트_구조.md)
4. [`docs/15_프로젝트_초기화.md`](./docs/15_프로젝트_초기화.md)
5. [`docs/16_개발_워크플로우.md`](./docs/16_개발_워크플로우.md)

전체 문서의 역할과 작업별 참고 문서는 `00_문서_가이드.md`에서 확인합니다.

---

## 라이선스

현재 이 Repository는 private boilerplate입니다.
