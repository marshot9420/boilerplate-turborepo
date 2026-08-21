# Codex Instructions

이 Repository는 Turborepo 기반 Next.js 풀스택 보일러플레이트입니다.

프로젝트 Architecture, Convention, Workflow의 Source of Truth는 `docs/*`입니다.

이 파일은 Codex가 프로젝트에서 작업할 때 사용할 진입 지침만 제공합니다.

상세한 프로젝트 규칙을 이 파일에서 다시 정의하지 않습니다.

---

## 작업 시작

작업을 시작하기 전에 다음 순서로 Context를 확인합니다.

```txt
현재 사용자 요구사항
  ↓
docs/00_문서_가이드.md
  ↓
현재 작업에 필요한 전문 문서
  ↓
관련 Source Code
  ↓
관련 Test / Story / Public API
```

모든 문서를 기계적으로 읽지 않습니다.

현재 작업에 필요한 문서만 선택합니다.

---

## 문서 선택

작업 종류에 따라 다음 문서를 우선 확인합니다.

```txt
Architecture
  docs/01_아키텍처.md

Project / Package 구조
  docs/03_프로젝트_구조.md
  docs/04_패키지_구조.md
  docs/05_의존성_경계.md

Environment
  docs/06_환경변수.md

Database / Repository
  docs/07_데이터베이스.md

Domain
  docs/08_도메인_레이어.md

Server Action
  docs/09_서버_액션.md

App UI
  docs/10_앱_구조.md

Design System
  docs/11_디자인_시스템.md

Testing
  docs/12_테스트_전략.md

Storybook
  docs/13_스토리북.md

Generator
  docs/14_코드_생성기.md

Project Initialization
  docs/15_프로젝트_초기화.md

Development Workflow
  docs/16_개발_워크플로우.md

Security / Operations
  docs/17_보안_및_운영_기본정책.md

Convention
  docs/18_컨벤션.md

Expansion
  docs/19_확장_가이드.md

Claude Code
  docs/20_Claude_Code.md

Codex
  docs/21_Codex.md
```

문서 선택의 최종 기준은 `docs/00_문서_가이드.md`를 따릅니다.

---

## Architecture 원칙

다음 상위 원칙을 유지합니다.

```txt
앱은 조립한다.

도메인은 판단한다.

데이터베이스는 저장한다.

Infrastructure Package는 외부 시스템과 연결한다.

Design System은 Domain에 독립적인 UI 기반을 제공한다.

Server에서 해결할 수 있는 문제는 Server에서 처리한다.

사용하는 위치와 가까운 곳에 코드를 둔다.

실제 공유와 책임이 발생했을 때만 추상화하거나 승격한다.

Dependency Boundary를 깨지 않는다.
```

App UI의 기본 방향:

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

Mutation의 기본 Backend 방향:

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

일반적인 Server-side 조회를 위해 Server Action을 추가하지 않습니다.

---

## 구현 전

코드를 수정하기 전에 현재 구현을 먼저 확인합니다.

최소한 다음을 확인합니다.

```txt
관련 Source

같은 책임의 기존 구현

Public API

관련 Test

관련 Story

Generator 존재 여부

Dependency 방향
```

기존 프로젝트 Pattern이 존재한다면 새로운 Pattern을 임의로 만들지 않습니다.

---

## 필요한 책임만 구현

모든 기능에 모든 계층을 기계적으로 추가하지 않습니다.

예:

```txt
단순 UI 변경
  → UI

Domain Object 표현
  → Entity

사용자 Interaction
  → Feature

페이지 조립
  → View

Mutation
  → 필요에 따라 Server Action + Domain

Persistence
  → Repository + Domain

새 Business Rule
  → Domain Rule / Permission / Service
```

현재 요구사항에 필요한 범위만 변경합니다.

---

## Codex Skills

반복적인 작업에는 Repository Skill을 사용합니다.

```txt
기능 구현
  → $implement-feature

코드 리뷰
  → $review-code

문서 갱신
  → $update-docs

테스트 작성
  → $write-tests
```

Skill은 다음 위치에서 관리합니다.

```txt
.agents/skills/
```

사용자의 요청이 Skill의 목적과 명확하게 일치하면 해당 Skill을 사용할 수 있습니다.

모든 작업을 Skill로 강제하지 않습니다.

작은 단순 수정은 직접 처리할 수 있습니다.

---

## Codex Agents

전문적인 별도 Context가 도움이 되는 경우 Project Agent를 사용할 수 있습니다.

```txt
architect
  Architecture와 Boundary 검토
  Read-only

code-reviewer
  현재 변경사항 검토
  Read-only

docs-maintainer
  문서 갱신

test-writer
  Test 작성
```

Project Agent 정의:

```txt
.codex/agents/
```

기본 관계:

```txt
Main Codex
  ↓
$implement-feature

architect
  Architecture 판단

code-reviewer
  ↓
$review-code

docs-maintainer
  ↓
$update-docs

test-writer
  ↓
$write-tests
```

일반적인 기능 구현을 별도의 Implementer Agent에 위임하지 않습니다.

Main Codex가 현재 사용자 Context를 유지하면서 `$implement-feature`를 사용하여 구현합니다.

Agent는 다음 상황에서 사용합니다.

```txt
별도의 읽기 전용 검토가 유용함

현재 구현 Context와 분리된 Review가 유용함

독립적인 Test 작업을 위임할 가치가 있음

문서 정리를 별도 Context에서 수행할 가치가 있음
```

작은 작업을 불필요하게 Agent로 분리하지 않습니다.

Subagent 결과는 Parent Agent가 다시 검토한 뒤 최종 작업에 반영합니다.

---

## Domain과 Database

Business Rule은 Domain에서 관리합니다.

다음 코드를 App이나 Server Action에 복제하지 않습니다.

```txt
Permission 판단

Business State Validation

상태 전이

비즈니스 계산
```

Prisma Query는 `@repo/database`의 Repository에서 처리합니다.

다음 영역에서 Prisma를 직접 사용하지 않습니다.

```txt
apps/*

Server Action

View

Feature

Entity

Domain Service

Domain Permission
```

---

## Server Action

Server Action은 Application Boundary로 유지합니다.

주요 책임:

```txt
Authentication

FormData 해석

입력 정규화

Zod Validation

Domain Service 호출

Domain Result → ActionResult

Cache 무효화

Navigation
```

Business Rule이나 Prisma Query를 Server Action에 작성하지 않습니다.

---

## App UI

App UI에서는 Layer / Slice / Segment 구조를 유지합니다.

```txt
entities
  Domain Object 표현

features
  사용자 행위

views
  페이지 또는 화면 조립

shared
  하나의 App에서 공유하는 Domain 비종속 코드
```

코드는 가능한 한 사용하는 위치 가까이에 둡니다.

```txt
Component
  ↓
Slice
  ↓
App
  ↓
Workspace Package
```

실제 공유가 발생하기 전에 승격하지 않습니다.

---

## Design System

`@repo/design-system`에는 Domain에 독립적인 UI와 Interaction Infrastructure만 둡니다.

현재 별도의 `primitives` 계층을 사용하지 않습니다.

```txt
@repo/design-system/web

@repo/design-system/admin

@repo/design-system/form

@repo/design-system/toast

@repo/design-system/utils
```

특정 Domain DTO, Server Action, Permission, URL을 알아야 하는 Component를 Design System으로 이동하지 않습니다.

---

## Environment

Repository 공통 환경변수는 `@repo/env`에서 관리합니다.

특정 App에만 필요한 환경변수는 해당 App의 `src/config`에서 관리합니다.

App 내부에서는 가능한 한:

```txt
@/config/server-env
@/config/client-env
```

를 진입점으로 사용합니다.

실제 `.env*` Secret을 코드, 문서, 로그 또는 응답에 노출하지 않습니다.

---

## Import / Export

Package와 다른 Slice는 Public API를 통해 사용합니다.

다른 Slice나 Package의 내부 Source Path를 Deep Import하지 않습니다.

같은 Slice 내부에서는 Relative Import를 사용할 수 있습니다.

Public API에서는 명시적인 Named Export를 사용합니다.

```ts
export { something } from "./something";
export type { Something } from "./something";
```

기본적으로 다음을 사용하지 않습니다.

```ts
export * from "./something";
```

React Component는 기본적으로 `default export`하고 Public Barrel에서 Named Export합니다.

---

## Naming

Naming은 `docs/18_컨벤션.md`를 따릅니다.

대표적인 기준:

```txt
파일 / 디렉터리
  kebab-case

Component / Type
  PascalCase

변수 / 함수
  camelCase

상수
  UPPER_SNAKE_CASE

Hook 파일
  Hook 이름과 동일한 camelCase
```

함수 이름은 실제 책임에 맞는 동사를 사용합니다.

`create`, `get`, `helper`, `util`, `manager` 등의 범용 이름을 습관적으로 사용하지 않습니다.

---

## Generator

반복적인 Scaffold가 필요하면 기존 Generator를 먼저 확인합니다.

```bash
pnpm generate
```

현재 Generator:

```txt
domain
component
entity
feature
view
```

Generator 결과는 완성 코드가 아니라 시작점입니다.

실제 요구사항에 맞게 수정하고 필요 없는 Scaffold는 제거합니다.

Generator가 현재 Convention이나 Architecture와 다른 코드를 생성한다면 생성 결과를 반복 수정하기보다 Generator Template 수정 여부를 검토합니다.

---

## Test

변경된 책임에 맞는 Test Level을 선택합니다.

```txt
Unit
  Pure Logic / Domain Rule

Component
  React UI / Interaction

Integration
  실제 Module / Database Boundary

E2E
  실제 Application User Flow
```

동일한 책임을 모든 Test Level에서 반복 검증하지 않습니다.

관련 Test가 존재한다면 변경과 함께 수정합니다.

---

## Storybook

독립적으로 관찰할 가치가 있는 UI에 Story를 작성합니다.

모든 Component에 Story를 강제하지 않습니다.

기본 후보:

```txt
Design System

Entity UI

Feature UI

Shared UI
```

Page, Server-heavy View, Server Action, Domain, Repository, Utility에는 기본적으로 Story를 작성하지 않습니다.

---

## 검증

구현 중에는 변경 지점 가까이에서 먼저 검증합니다.

예:

```txt
Domain
  → 관련 Unit Test

Repository
  → 관련 Unit / Integration Test

React UI
  → 관련 Component Test

전체 변경
  → pnpm check
```

일반적인 작업 완료 전에는 다음을 우선 확인합니다.

```bash
pnpm check
pnpm test
```

변경 범위에 따라 추가합니다.

```bash
pnpm test:integration
pnpm test:e2e
pnpm build
```

현재 작업과 관계없는 Test Suite를 기계적으로 모두 실행하지 않습니다.

---

## 문서

Architecture, Public API, Command, Generator, Workflow 또는 운영 정책을 변경했다면 관련 전문 문서의 수정 필요 여부를 확인합니다.

규칙의 Source of Truth를 여러 문서에 중복해서 만들지 않습니다.

현재 구현되지 않은 구조를 문서에 현재 기능처럼 작성하지 않습니다.

---

## 안전 규칙

실제 Secret이 들어 있는 `.env*` 파일의 내용을 읽거나 출력하지 않습니다.

Example Environment 파일은 구조 확인 목적으로 사용할 수 있습니다.

```txt
.env.example
.env.test.example
.env.e2e.example
```

기존 Prisma Migration을 직접 수정하지 않습니다.

`pnpm-lock.yaml`을 수동으로 편집하지 않습니다.

사용자의 명시적인 요청 없이 다음 작업을 수행하지 않습니다.

```txt
Dependency 추가 / 제거

Database Migration / Push / Seed

git commit

git push

git reset --hard

git clean

Package Publish
```

파괴적인 명령으로 문제를 우회하지 않습니다.

---

## 작업 완료

작업을 완료할 때는 다음을 확인합니다.

```txt
요구사항을 충족했는가?

기존 Architecture Boundary를 유지했는가?

Public API가 일관적인가?

관련 Test를 수정했는가?

관련 문서 수정이 필요한가?

변경 범위에 맞는 검증을 수행했는가?
```

완료하지 못한 부분이 있다면 숨기지 말고 명확하게 설명합니다.
