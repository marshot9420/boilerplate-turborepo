---
name: implement-feature
description: 새로운 기능 구현, 기존 기능 확장, 동작을 유지하는 리팩토링처럼 실제 Source Code를 변경해야 할 때 사용합니다. 현재 구현과 프로젝트 문서를 먼저 확인하고 필요한 계층만 수정한 뒤 테스트와 검증까지 수행합니다.
---

# Implement Feature

프로젝트 Architecture와 기존 구현을 유지하면서 요구사항을 구현합니다.

이 Skill은 기능 구현을 위한 기본 Workflow입니다.

모든 계층을 기계적으로 생성하지 않고 현재 요구사항에 필요한 책임만 변경합니다.

## 1. 요구사항 확인

먼저 사용자의 요구사항을 정확히 확인합니다.

다음을 구분합니다.

```txt
새로운 기능

기존 기능 확장

버그 수정

구조를 유지하는 리팩토링

UI 변경

Persistence 변경

Architecture 변경
```

명시적으로 요구되지 않은 기능을 임의로 추가하지 않습니다.

관련 없는 리팩토링을 함께 수행하지 않습니다.

---

## 2. Context 확인

`AGENTS.md`를 기준으로 현재 작업에 필요한 문서를 선택합니다.

모든 문서를 기계적으로 읽지 않습니다.

대표적인 문서:

```txt
Architecture
  docs/01_아키텍처.md

Dependency
  docs/05_의존성_경계.md

Database
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

Workflow
  docs/16_개발_워크플로우.md

Convention
  docs/18_컨벤션.md
```

---

## 3. 현재 구현 확인

코드를 작성하기 전에 관련 구현을 확인합니다.

최소한 다음을 확인합니다.

```txt
현재 Source

같은 책임을 가진 기존 구현

관련 Public API

관련 Test

관련 Story

관련 Generator

현재 Dependency 방향
```

기존 Pattern이 있다면 새로운 Pattern을 임의로 만들지 않습니다.

현재 코드와 문서가 충돌한다면 실제 구현과 변경 이력을 확인하고 충돌을 보고합니다.

---

## 4. 변경 범위 결정

현재 요구사항에서 필요한 책임을 판단합니다.

예:

```txt
새 Persistence
  → Prisma / Repository 검토

새 Business Rule
  → Domain 검토

새 Mutation
  → Domain + Server Action 검토

Domain Object 표현
  → Entity 검토

사용자 Interaction
  → Feature 검토

화면 조립
  → View 검토

새 Route
  → App Router 검토

공통 Domain-independent UI
  → Design System 검토
```

모든 기능에 모든 계층을 추가하지 않습니다.

---

## 5. Generator 확인

새 Scaffold가 필요한 경우 기존 Generator를 먼저 확인합니다.

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

Generator가 해당 책임을 지원한다면 수작업으로 동일한 Scaffold를 반복하지 않습니다.

Generator 결과는 시작점이므로 실제 요구사항에 맞게 수정합니다.

불필요한 Scaffold는 제거합니다.

---

## 6. 구현 순서

여러 계층이 필요한 경우 일반적으로 하위 책임부터 구현합니다.

Persistence가 포함된 Mutation 예:

```txt
Prisma
  ↓
Repository
  ↓
Domain Rule / Permission / Service
  ↓
Server Action
  ↓
Entity / Feature
  ↓
View
  ↓
App Router
```

단순 UI 변경에서는 이 순서를 기계적으로 적용하지 않습니다.

---

## 7. Architecture Boundary 유지

다음 방향을 유지합니다.

```txt
App
  ↓
Domain
  ↓
Database
```

UI:

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

다음 패턴을 만들지 않습니다.

```txt
Repository → Domain

Domain → App

Entity → Feature

Feature → View

Design System → Domain

Package → apps/*
```

---

## 8. Database

Prisma Query는 Repository에서 처리합니다.

다음 계층에서 직접 Prisma를 사용하지 않습니다.

```txt
apps/*

Server Action

View

Feature

Entity

Domain Service

Permission
```

Repository는 Persistence를 담당하고 Business Rule을 판단하지 않습니다.

---

## 9. Domain

Business Rule은 Domain에서 관리합니다.

대표적인 책임:

```txt
Permission

Business Validation

상태 전이

Business Calculation

Repository 조합

Transaction 결정
```

Server Action이나 UI에 같은 규칙을 복제하지 않습니다.

---

## 10. Server Action

Server Action은 Application Boundary로 유지합니다.

담당:

```txt
Authentication

FormData 해석

정규화

Zod Validation

Domain Service 호출

ActionResult 변환

Cache 무효화

Navigation
```

담당하지 않음:

```txt
Business Rule

Prisma Query

Repository 직접 조합

Client UI State
```

---

## 11. UI

UI 코드는 사용하는 위치 가까이에 둡니다.

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

특정 Domain을 알아야 하는 UI를 Design System으로 이동하지 않습니다.

---

## 12. Public API

Package나 다른 Slice는 Public API를 통해 사용합니다.

Deep Import를 만들지 않습니다.

Public Export는 명시적으로 작성합니다.

```ts
export { Something } from "./something";
export type { SomethingProps } from "./something";
```

Wildcard Export를 기본적으로 사용하지 않습니다.

---

## 13. Test

변경된 동작에 맞는 테스트를 추가하거나 수정합니다.

다음 기준을 사용합니다.

```txt
Pure Logic
  → Unit

React Interaction
  → Component

Database / 실제 Module 연결
  → Integration

실제 사용자 Flow
  → E2E
```

같은 책임을 모든 Test Level에서 중복 검증하지 않습니다.

---

## 14. Storybook

독립적으로 관찰할 가치가 있는 UI라면 Story를 검토합니다.

우선 대상:

```txt
Design System

Entity

Feature

Shared UI
```

Story를 위해 Production Architecture를 왜곡하지 않습니다.

---

## 15. 문서 영향

다음이 변경되었다면 관련 전문 문서 수정 여부를 확인합니다.

```txt
Architecture

Package Responsibility

Public API

Dependency Boundary

Command

Generator

Environment Contract

Workflow

Convention
```

규칙을 여러 문서에 중복 정의하지 않습니다.

---

## 16. 검증

먼저 변경 지점 가까이에서 검증합니다.

예:

```txt
Domain
  → 관련 Unit Test

Repository
  → 관련 Integration Test

UI
  → 관련 Component Test
```

완료 단계에서는 기본적으로:

```bash
pnpm check
pnpm test
```

를 검토합니다.

필요한 경우:

```bash
pnpm test:integration
pnpm test:e2e
pnpm build
```

을 추가합니다.

현재 변경과 무관한 Test Suite를 기계적으로 실행하지 않습니다.

---

## 17. 완료 보고

작업 완료 시 간결하게 다음을 보고합니다.

```txt
무엇을 변경했는가

중요한 구조적 판단

실행한 검증

남아 있는 문제 또는 후속 작업
```

실행하지 않은 Test를 실행했다고 말하지 않습니다.

완료하지 못한 항목을 숨기지 않습니다.
