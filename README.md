# boilerplate-turborepo

Turborepo 기반의 Next.js 풀스택 보일러플레이트입니다.

이 저장소는 서비스 앱과 관리자 앱을 함께 운영하는 모노레포 구조를 빠르게 시작하기 위해 만들어졌습니다.

앱 구조, 도메인 계층, 데이터베이스 접근, 인증, 디자인 시스템, 테스트, Storybook, E2E, 코드 생성기, 초기화 스크립트를 프로젝트 초기에 바로 사용할 수 있도록 표준화합니다.

---

## 핵심 방향

```txt
Turborepo
+ pnpm workspace
+ Next.js App Router
+ Server First
+ Native Form + Server Actions
+ 완화된 FSD
+ DDD-style Backend Layering
+ Prisma
+ Zod Validation
+ Result Pattern
+ Vitest
+ Playwright
+ Storybook
+ 코드 생성기
+ 프로젝트 초기화 스크립트
```

이 보일러플레이트의 목표는 다음과 같습니다.

```txt
프로젝트 초기 세팅을 빠르게 끝낸다.
앱 구조를 일관되게 유지한다.
관리자 앱과 서비스 앱의 공통 기반을 제공한다.
비즈니스 로직과 DB 접근 경계를 명확히 둔다.
폼, 검증, 에러, 로깅, 테스트, 설정을 표준화한다.
반복적인 파일 생성을 자동화한다.
나중에 분리 가능한 구조로 시작한다.
```

---

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

---

## 빠른 시작

```bash
corepack enable
pnpm install
pnpm dev
```

개발 서버는 각 앱의 `dev` 스크립트와 Turborepo 설정에 따라 실행됩니다.

---

## 프로젝트 초기화

이 저장소를 새 프로젝트의 출발점으로 사용할 경우, 먼저 초기화 스크립트를 실행할 수 있습니다.

```bash
pnpm init-project
```

패키지 scope를 변경하려면 다음 명령어를 사용합니다.

```bash
pnpm setup:scope
```

예를 들어 기본 scope인 `@repo`를 새 프로젝트용 scope로 바꾸는 용도입니다.

---

## 전체 구조

```txt
boilerplate-turborepo/
├─ apps/
│  ├─ admin/
│  └─ web/
│
├─ packages/
│  ├─ auth/
│  ├─ core/
│  ├─ database/
│  ├─ design-system/
│  ├─ domain/
│  ├─ env/
│  ├─ eslint-config/
│  ├─ playwright-config/
│  ├─ storybook-config/
│  ├─ typescript-config/
│  └─ vitest-config/
│
├─ tooling/
│  ├─ generators/
│  └─ scripts/
│
├─ docs/
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ README.md
```

---

## 앱

### `apps/web`

사용자용 서비스 앱입니다.

주요 책임:

```txt
사용자 로그인
콘텐츠 목록/상세
콘텐츠 생성/수정/삭제
내 프로필 조회/수정
회원 탈퇴
```

### `apps/admin`

관리자용 앱입니다.

주요 책임:

```txt
관리자 로그인
사용자 목록 관리
콘텐츠 목록 관리
콘텐츠 상세 조회
콘텐츠 상태 변경
콘텐츠 삭제
```

두 앱은 공통적으로 다음 구조를 따릅니다.

```txt
src/
├─ actions/
├─ app/
├─ config/
├─ constants/
├─ entities/
├─ features/
├─ shared/
└─ views/
```

각 디렉터리의 역할은 다음과 같습니다.

```txt
app
  Next.js routing 전용
  page.tsx, layout.tsx, route.ts

views
  페이지 조립 단위

features
  사용자 행위 단위
  create-content-form, update-profile-form 등

entities
  도메인 모델 단위 UI/helper
  content-card, user-table 등

actions
  Server Actions

shared
  앱 내부 공통 컴포넌트

config
  앱별 환경변수 및 설정

constants
  앱별 URL, HTML meta 데이터, 메뉴 label, description 등 문자열 상수 객체
  ex: `urls.constant.ts`, `navigation.constant.ts`, `meta.constant.ts`, `app.constant.ts`, `menu.constant.ts`
```

---

## 패키지

### `@repo/auth`

인증/인가 공통 패키지입니다.

```txt
OAuth provider
OAuth callback
session
session cookie
requireUser
requireAdmin
auth error
```

### `@repo/core`

순수 공통 기반 패키지입니다.

```txt
Result
AppError
ActionResult
validation helper
pagination
search params
logger
normalize
공통 타입
```

### `@repo/database`

DB 접근 전용 패키지입니다.

```txt
Prisma schema
Prisma client
repository
transaction
Prisma error mapper
migration
```

### `@repo/design-system`

공통 디자인 시스템 패키지입니다.

```txt
primitives
web UI wrappers
admin UI wrappers
form helper
toast helper
theme/tokens
Storybook
```

### `@repo/domain`

비즈니스 도메인 계층입니다.

```txt
도메인 상수
Zod schema
Request/Response DTO
service
mapper
permission
domain error
```

### `@repo/env`

환경변수 검증 패키지입니다.

```txt
server env
client env
shared env
```

### 설정 패키지

```txt
@repo/eslint-config
@repo/typescript-config
@repo/vitest-config
@repo/playwright-config
@repo/storybook-config
```

각 도구의 설정을 모노레포 전체에서 재사용하기 위한 패키지입니다.

---

## 백엔드 계층 구조

기본 흐름은 다음과 같습니다.

```txt
UI
 → Server Action
   → Domain Service
     → Repository
       → Prisma
```

각 계층의 책임은 다음과 같습니다.

```txt
UI
  화면 표시
  사용자 입력
  form submit

Server Action
  FormData 처리
  인증/권한 확인
  Zod validation
  service 호출
  revalidatePath / redirect

Domain Service
  비즈니스 규칙
  비즈니스 검증
  repository 조합
  Result 반환

Repository
  Prisma query
  DB 입출력
  Prisma error 변환

Prisma
  실제 DB 처리
```

---

## 의존성 방향

허용되는 기본 방향은 다음과 같습니다.

```txt
apps/*
  → domain
  → database
  → core

apps/*
  → auth
  → design-system
  → env
  → core

domain
  → core

database
  → core

auth
  → core
  → database
  → domain

design-system
  → core
```

금지되는 방향은 다음과 같습니다.

```txt
core → domain
core → database
core → auth
core → design-system

database → domain

design-system → domain
design-system → database

packages/* → apps/*
```

의존성 경계는 다음 명령어로 검사합니다.

```bash
pnpm check:boundaries
```

---

## 주요 명령어

### 개발

| 명령어       | 설명                                 |
| ------------ | ------------------------------------ |
| `pnpm dev`   | 전체 개발 서버 실행                  |
| `pnpm build` | 전체 빌드                            |
| `pnpm clean` | 빌드 산출물, 캐시, node_modules 정리 |

### 검사

| 명령어                  | 설명                                     |
| ----------------------- | ---------------------------------------- |
| `pnpm lint`             | ESLint 검사                              |
| `pnpm lint:fix`         | ESLint 자동 수정                         |
| `pnpm check-types`      | TypeScript 타입 검사                     |
| `pnpm format`           | Prettier 포맷 적용                       |
| `pnpm format:check`     | Prettier 포맷 검사                       |
| `pnpm check:boundaries` | 패키지 의존성 경계 검사                  |
| `pnpm check`            | lint, boundaries, type, format 전체 검사 |

### 테스트

| 명령어                        | 설명                          |
| ----------------------------- | ----------------------------- |
| `pnpm test`                   | 전체 단위/컴포넌트 테스트     |
| `pnpm test:watch`             | 테스트 watch 모드             |
| `pnpm test:coverage`          | 테스트 커버리지               |
| `pnpm test:integration`       | 통합 테스트                   |
| `pnpm test:integration:watch` | 통합 테스트 watch 모드        |
| `pnpm test:e2e`               | E2E 테스트                    |
| `pnpm test:e2e:ui`            | Playwright UI 모드            |
| `pnpm test:e2e:headed`        | 브라우저 표시 모드로 E2E 실행 |
| `pnpm playwright:install`     | Playwright 브라우저 설치      |

### 데이터베이스

| 명령어                  | 설명                         |
| ----------------------- | ---------------------------- |
| `pnpm db:generate`      | Prisma client 생성           |
| `pnpm db:push`          | 개발 DB에 schema push        |
| `pnpm db:migrate`       | 개발 DB migration 실행       |
| `pnpm db:seed`          | 개발 seed 실행               |
| `pnpm db:studio`        | Prisma Studio 실행           |
| `pnpm db:test:push`     | 테스트 DB schema push        |
| `pnpm db:test:generate` | 테스트 DB Prisma client 생성 |
| `pnpm db:test:migrate`  | 테스트 DB migration 실행     |
| `pnpm db:e2e:push`      | E2E DB schema push           |
| `pnpm db:e2e:generate`  | E2E DB Prisma client 생성    |
| `pnpm db:e2e:migrate`   | E2E DB migration 실행        |
| `pnpm db:e2e:seed`      | E2E seed 실행                |

### 코드 생성 및 스크립트

| 명령어               | 설명                      |
| -------------------- | ------------------------- |
| `pnpm generate`      | 코드 생성기 실행          |
| `pnpm init-project`  | 프로젝트 초기화           |
| `pnpm setup:scope`   | 패키지 scope 변경         |
| `pnpm scripts:clean` | scripts 패키지 clean 실행 |

---

## 테스트 전략

이 프로젝트는 테스트를 다음처럼 나눕니다.

```txt
Unit Test
  순수 함수
  validation helper
  mapper
  permission
  service business rule

Component Test
  design-system component
  app entity/feature/shared component

Integration Test
  repository
  service + repository
  일부 Server Action

E2E Test
  로그인
  권한 차단
  사용자 주요 플로우
  관리자 주요 플로우
```

| 대상          | 테스트 종류          | 작성 강도                  |
| ------------- | -------------------- | -------------------------- |
| permission    | 단위 테스트          | 촘촘하게                   |
| schema        | 단위 테스트          | 주요 케이스                |
| mapper        | 단위 테스트          | 기본 케이스                |
| repository    | 통합 테스트          | CRUD 중심으로 촘촘하게     |
| service       | 통합 테스트          | 유스케이스/권한/상태 중심  |
| server action | 통합 테스트          | 핵심 액션만                |
| API route     | 통합 테스트          | route가 있는 경우만        |
| form          | 컴포넌트/통합 테스트 | 사용자 입력/에러 표시 중심 |
| view          | 컴포넌트/통합 테스트 | 조립 결과 중심             |
| page/layout   | 보통 최소화          | 단순 조립이면 생략 가능    |
| E2E           | Playwright           | 핵심 사용자 흐름만         |

파일 네이밍은 다음 규칙을 따릅니다.

```txt
*.test.ts
*.test.tsx
*.integration.test.ts
*.integration.test.tsx
*.spec.ts
```

---

## Storybook

Storybook은 앱과 디자인 시스템 컴포넌트 문서화 및 시각적 확인에 사용합니다.

주요 위치:

```txt
apps/web/.storybook
apps/admin/.storybook
packages/design-system/.storybook
```

Story 작성 대상:

```txt
design-system web/admin wrapper
apps/* entities UI
apps/* features UI
apps/* shared UI
```

기본적으로 `views`는 Storybook story를 작성하지 않습니다.
`views`는 페이지 조립 단위이고, 실제 테스트는 unit/component test 또는 E2E에서 검증합니다.

---

## 코드 생성기

반복적인 파일 생성을 줄이기 위해 `tooling/generators`를 사용합니다.

```bash
pnpm generate
```

생성기는 다음과 같은 작업에 사용합니다.

```txt
domain 생성
component 생성
feature 생성
```

생성 후에는 반드시 다음을 확인합니다.

```txt
생성된 파일 위치
index export
테스트 파일
Storybook story
package boundary
lint/typecheck 결과
```

---

## 프로젝트 초기화 스크립트

`tooling/scripts`는 보일러플레이트 운영에 필요한 반복 작업을 담당합니다.

```txt
clean
init-project
setup-scope
seed
seed-e2e
```

새 프로젝트를 만들 때는 보통 다음 순서로 사용합니다.

```bash
pnpm install
pnpm init-project
pnpm setup:scope
pnpm check
```

---

## 개발 흐름 예시

새 기능을 추가할 때의 기본 흐름은 다음과 같습니다.

```txt
1. domain schema/dto/constant 확인 또는 추가
2. database repository 확인 또는 추가
3. domain service 구현
4. app Server Action 구현
5. entity UI 구현
6. feature UI 구현
7. view에서 조립
8. app route에 연결
9. unit/component/integration test 작성
10. 필요한 경우 Storybook story 작성
11. pnpm check 실행
```

Server Action은 얇게 유지합니다.

```txt
Server Action이 하는 것
  FormData 처리
  인증/권한 확인
  validation
  service 호출
  revalidatePath / redirect

Server Action이 하지 않는 것
  비즈니스 규칙 처리
  Prisma 직접 접근
  복잡한 데이터 조합
```

---

## 문서

자세한 설계와 설정은 `docs` 디렉터리에서 관리합니다.

```txt
docs/
├─ 01_아키텍처.md
└─ 02_기본설정.md
```

주요 문서:

| 문서                                           | 설명                                                  |
| ---------------------------------------------- | ----------------------------------------------------- |
| [`docs/01_아키텍처.md`](./docs/01_아키텍처.md) | 전체 아키텍처, 계층 구조, 패키지 역할, 컨벤션         |
| [`docs/02_기본설정.md`](./docs/02_기본설정.md) | 루트 설정, TypeScript, ESLint, Vitest, Storybook 설정 |

각 앱과 패키지에도 별도의 `README.md`가 있습니다.

```txt
apps/web/README.md
apps/admin/README.md
packages/*/README.md
tooling/*/README.md
```

---

## AI 코딩 에이전트 사용

Claude Code, Cursor, Codex 등 AI 코딩 에이전트를 사용할 경우, 프로젝트 구조와 계층 규칙을 먼저 읽히는 것을 권장합니다.

추천 진입 문서:

```txt
README.md
docs/01_아키텍처.md
docs/02_기본설정.md
```

Claude Code를 사용하는 경우 다음 파일을 추가해서 프로젝트 지침으로 사용할 수 있습니다.

```txt
CLAUDE.md
.claude/settings.json
.claude/agents/*
.claude/skills/*
```

AI 에이전트가 작업할 때도 다음 원칙은 반드시 유지해야 합니다.

```txt
Prisma는 apps에서 직접 접근하지 않는다.
비즈니스 로직은 React 컴포넌트에 넣지 않는다.
Server Action은 얇게 유지한다.
domain service는 Result를 반환한다.
repository는 DB 접근만 담당한다.
패키지 의존성 방향을 깨지 않는다.
테스트를 함께 추가하거나 수정한다.
```

---

## 컨벤션 요약

### 파일명

```txt
kebab-case
```

예:

```txt
create-content-form.tsx
content.service.ts
user.repository.ts
```

### 컴포넌트

```txt
PascalCase
```

예:

```txt
CreateContentForm
ContentCard
UserTable
```

### 함수

```txt
camelCase
```

예:

```txt
createContentService
findUserByIdRepository
toContentResponse
```

### 도메인 상수

```txt
UPPERCASE object
```

예:

```txt
USER
CONTENT
CONTENT_ERROR_CODE
```

### Server Action

```txt
createContentAction
updateMyProfileAction
deleteContentAction
```

### Service

```txt
createContentService
updateUserService
deleteContentService
```

### Repository

```txt
createContentRepository
findContentByIdRepository
existsUserByEmailRepository
```

---

## 품질 체크

작업 후 기본적으로 다음 명령어를 실행합니다.

```bash
pnpm check
pnpm test
```

DB 또는 repository/service 통합 동작을 변경했다면 다음도 실행합니다.

```bash
pnpm test:integration
```

E2E 플로우에 영향을 주는 변경이라면 다음을 실행합니다.

```bash
pnpm test:e2e
```

---

## 라이선스

현재 이 저장소는 private boilerplate입니다.
라이선스 정책이 필요하다면 프로젝트 배포 방식에 맞게 별도로 추가하세요.

TODO:

1. 조회 기능은 이상적인 RSC 조회 흐름 기준 상 서버 액션 제거
2. 에러 코드 객체 상수화, 문자열 상수화, `user.role === "ADMIN"` 같은 것들도 `user.role === UserRole.ADMIN`으로 수정
3. 각종 테스트 코드 및 여러 번 반복되는 문자열들 상수로 한 곳에서 관리
4. 요청/응답 DTO 정책 통일, 이때 input validation 에러와 서버 에러를 어떻게 다룰 것인지에 대해서도 정리
   - 요청 스키마 객체: ID 파라미터, 정렬 값, 필터링 쿼리(필드 뿐만 아니라 검색어까지), 생성/수정 등에 쓰일 Form 입력 객체 등. 여기에 `normalize`가 적용된 `zod-helper` 함수 적용
   - 응답: `[domain].dto.ts`에 TypeScript interface로 처리
   - 위 2개는 한 곳에서 관리되어야 하며, 서비스 계층부터 컴포넌트까지 재사용 되어야 함
5. 위 1~4 부분들도 문서에 명시
6. Pagination 변경?
