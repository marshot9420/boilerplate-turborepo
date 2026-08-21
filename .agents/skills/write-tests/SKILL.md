---
name: write-tests
description: 새로운 동작이나 변경된 동작에 필요한 테스트를 선택하고 작성하거나 기존 테스트를 수정할 때 사용합니다. Unit, Component, Integration, E2E 중 실제 책임에 맞는 테스트 수준을 선택하고 중복 검증을 피합니다.
---

# Write Tests

변경된 Behavior에 필요한 Test를 선택하고 작성합니다.

Test 수를 늘리는 것이 목적이 아닙니다.

각 책임을 가장 적절한 Test Level에서 검증합니다.

## 1. Behavior 확인

먼저 실제 구현과 요구사항을 확인합니다.

다음을 파악합니다.

```txt
무엇이 변경되었는가?

외부에서 관찰 가능한 Behavior는 무엇인가?

어떤 실패 Case가 존재하는가?

어느 계층이 해당 책임을 소유하는가?
```

구현 세부사항만 보고 Test를 만들지 않습니다.

---

## 2. 기존 Test 확인

새 Test를 만들기 전에 관련 Test를 확인합니다.

```txt
기존 Unit Test

기존 Component Test

기존 Integration Test

기존 E2E
```

이미 적절한 Test가 있다면 확장합니다.

같은 Behavior를 불필요하게 중복 검증하지 않습니다.

---

## 3. Test Level 선택

다음 기준을 사용합니다.

```txt
Unit
  Pure Function
  Domain Rule
  Permission
  Mapper
  Validator
  Formatter
  Normalizer

Component
  React Rendering
  User Interaction
  Form
  Dialog
  Hook
  Client-side State

Integration
  Repository + PostgreSQL
  Transaction
  Database Constraint
  Concurrency-sensitive Persistence
  Idempotency / Duplicate Event 처리
  Domain Service + Repository
  실제 Module 연결

E2E
  실제 Browser
  Route
  Authentication
  Navigation
  사용자 Workflow
  전체 계층 연결
```

Business Correctness에 중요한 동시성, 중복 요청, Idempotency, Retry / Timeout, Partial Failure가 있다면 `docs/22_구현_안전성.md`를 함께 확인합니다.

실제 Database Constraint, Transaction, Conditional Update, Lock 또는 중복 처리 경계가 검증 대상이라면 실제 Boundary를 사용하는 Integration Test 필요 여부를 우선 판단합니다.

모든 안전성 항목에 Test를 기계적으로 추가하지 않고, 경쟁이나 중복 실행이 실제 Business Invariant를 깨뜨릴 수 있는지에 따라 Test 필요 여부를 결정합니다.

---

## 4. Unit Test

Unit Test에서는 작은 책임을 독립적으로 검증합니다.

외부 Infrastructure를 불필요하게 실행하지 않습니다.

주로 확인:

```txt
입력 → 출력

Boundary Value

Business Rule 분기

Permission

Error Mapping
```

---

## 5. Component Test

React Component Test에서는 사용자 관점의 Behavior를 검증합니다.

가능하면 Testing Library Query를 사용합니다.

검증:

```txt
화면 출력

사용자 입력

Click

Disabled

Error

Dialog Open / Close

Callback

router.refresh()

Client-side Effect
```

내부 State Variable이나 구현 세부사항을 직접 검증하지 않습니다.

---

## 6. Integration Test

Persistence Behavior가 중요하면 실제 Test Database를 사용합니다.

대표적인 대상:

```txt
Repository

Transaction

Constraint

Relation

Persistence Mapping

Concurrency와 Idempotency가 중요한 Persistence Behavior
```

Prisma 동작 자체가 중요한 Test를 Mock으로 대체하지 않습니다.

Integration Test에서는 다른 Test의 데이터에 의존하지 않습니다.

---

## 7. Domain Service Test

Domain Service는 책임에 따라:

```txt
Mock Repository 기반 Unit Test
```

또는:

```txt
실제 Repository 기반 Integration Test
```

를 선택합니다.

Business Rule만 검증한다면 Unit Test를 우선합니다.

Persistence와의 실제 조합이 중요한 경우 Integration Test를 사용합니다.

---

## 8. Server Action Test

Server Action Test에서는 Boundary 책임을 검증합니다.

예:

```txt
Authentication

Input Parsing

Validation

Domain Service 호출

ActionResult 변환

revalidatePath

redirect
```

Domain Service의 Business Rule을 Action Test에서 다시 검증하지 않습니다.

---

## 9. E2E

E2E는 핵심 사용자 Flow를 검증합니다.

하위 계층의 모든 Branch를 E2E에서 반복하지 않습니다.

대표적으로:

```txt
페이지 접근

검색 / 필터

Form 제출

CRUD

Navigation

상태 변경 후 화면 반영
```

을 검증합니다.

---

## 10. Mock 기준

Mock은 Test Boundary를 만들기 위해 사용합니다.

다음을 무조건 Mock하지 않습니다.

```txt
Database

Repository

Browser Behavior

실제로 검증해야 하는 Infrastructure
```

반대로 현재 Test의 책임 밖에 있는 Dependency는 Mock할 수 있습니다.

Mock 이름은 실제 Mock임을 드러내도록 합니다.

---

## 11. Fixture

반복되는 Test Data에는 Fixture Builder를 사용할 수 있습니다.

기본 Naming:

```txt
buildXFixture
```

Fixture가 실제 Business Rule을 숨기지 않도록 합니다.

Test에 중요한 값은 Test 본문에서 명시적으로 Override합니다.

---

## 12. Test Naming

기존 Repository의 Naming과 언어 Style을 유지합니다.

기본 파일:

```txt
*.test.ts

*.test.tsx

*.integration.test.ts

*.integration.test.tsx

e2e/**/*.spec.ts
```

---

## 13. 실패 Case

Happy Path만 작성하지 않습니다.

해당 Behavior에 의미가 있다면 다음을 검토합니다.

```txt
Invalid Input

Unauthorized

Forbidden

Not Found

Invalid State

Empty State

Boundary Value

Infrastructure Failure
```

모든 가능한 Exception을 기계적으로 테스트하지 않습니다.

---

## 14. 검증 실행

먼저 작성한 Test를 직접 실행합니다.

가능하면 해당 Workspace나 Test File 범위부터 실행합니다.

이후 필요하면:

```bash
pnpm test
pnpm test:integration
pnpm test:e2e
```

로 확대합니다.

테스트 실행 결과를 확인하지 않고 완료했다고 말하지 않습니다.

---

## 15. Production Code 변경

Test를 통과시키기 위해 Production Behavior를 임의로 바꾸지 않습니다.

실제 버그나 테스트 가능성 문제를 발견했다면 먼저 문제를 보고합니다.

사용자가 구현 수정까지 요청한 경우에만 필요한 Production 변경을 수행합니다.

---

## 16. 완료 보고

다음을 보고합니다.

```txt
추가 / 수정한 Test

선택한 Test Level과 이유

실행한 Test Command

결과

남아 있는 검증 범위
```
