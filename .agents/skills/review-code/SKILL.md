---
name: review-code
description: 현재 변경사항, git diff, Pull Request 또는 구현 결과를 코드 리뷰해야 할 때 사용합니다. 정확성, Architecture Boundary, Server/Client Boundary, 보안, 테스트와 문서 누락을 우선적으로 검토합니다.
---

# Review Code

현재 변경사항을 Repository 기준으로 검토합니다.

사용자가 수정까지 요청하지 않았다면 코드를 변경하지 않습니다.

리뷰는 스타일 취향보다 실제 위험과 구조적 문제를 우선합니다.

## 1. 변경 범위 확인

가능하면 먼저 다음을 확인합니다.

```txt
git status

git diff

변경된 파일

관련 Test

관련 Public API
```

현재 변경과 관계없는 기존 문제를 리뷰 결과에 섞지 않습니다.

---

## 2. 관련 문서 확인

변경 영역에 필요한 문서만 확인합니다.

대표적으로:

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

App
  docs/10_앱_구조.md

Design System
  docs/11_디자인_시스템.md

Test
  docs/12_테스트_전략.md

Security
  docs/17_보안_및_운영_기본정책.md

Convention
  docs/18_컨벤션.md

Implementation Safety
  docs/22_구현_안전성.md
```

---

## 3. Correctness

가장 먼저 실제 동작 오류를 찾습니다.

확인:

```txt
잘못된 조건

누락된 Branch

Null / Undefined 처리

잘못된 State Transition

잘못된 Mapping

잘못된 URL

비동기 처리 오류

잘못된 Error Handling

Regression 가능성
```

구현 취향보다 실제 Behavior 오류를 우선합니다.

---

## 3.1 구현 안전성

Mutation, 상태 전이, Persistence 변경, Retry, 외부 Side Effect가 포함된 변경은 `docs/22_구현_안전성.md`를 기준으로 검토합니다.

확인:

```txt
Race Condition

Read-Modify-Write

Idempotency

Atomicity

Partial Failure

Retry / Timeout

Stale State
```

실제 Business Invariant와 실패 시나리오가 요구하는 경우에만 보호 수단이나 Test를 Finding으로 제시합니다.

---

## 4. Architecture

책임이 올바른 계층에 위치하는지 확인합니다.

예:

```txt
Business Rule
  → Domain

Persistence
  → Repository

Application Boundary
  → Server Action

User Interaction
  → Feature

Domain 표현
  → Entity

Page 조립
  → View
```

하위 계층이 상위 계층을 참조하지 않는지 확인합니다.

---

## 5. Dependency Boundary

다음을 확인합니다.

```txt
Package → App 의존성

순환 Dependency

금지된 Package Dependency

Deep Import

Public API 우회
```

필요하면 `docs/05_의존성_경계.md`를 기준으로 판단합니다.

---

## 6. Server / Client Boundary

확인:

```txt
Server-only Module이 Client로 유입되는가?

Secret이 Browser Bundle에 포함될 수 있는가?

불필요하게 Client Component 범위가 커졌는가?

Server에서 처리할 책임을 Client로 이동했는가?

router.refresh() 같은 Client 책임이 Server Action으로 이동했는가?
```

---

## 7. Database

확인:

```txt
App 또는 Domain Service가 Prisma를 직접 사용하는가?

Repository에 Business Rule이 들어갔는가?

Transaction Boundary가 잘못되었는가?

동시성에 중요한 Persistence 동작이 실제 Boundary에서 안전한가?

Persistence Model이 Client까지 그대로 노출되는가?
```

---

## 8. Security

확인:

```txt
Client 입력을 권한 근거로 신뢰하는가?

Authentication과 Authorization이 혼동되었는가?

Secret 또는 민감정보가 노출되는가?

외부 입력 Validation이 누락되었는가?

Error에 내부 정보가 노출되는가?
```

---

## 9. Test

확인:

```txt
변경된 Behavior를 검증하는 Test가 있는가?

잘못된 Test Level을 사용하고 있는가?

Mock이 실제 중요한 Integration을 숨기고 있는가?

구현 세부사항만 검증하고 있는가?

같은 책임이 여러 Level에서 과도하게 중복되는가?
```

---

## 10. Storybook

UI 변경이라면 필요한 Story가 누락되었는지 확인합니다.

모든 Component에 Story를 요구하지 않습니다.

---

## 11. Documentation

다음 변경이 문서에 영향을 주는지 확인합니다.

```txt
Architecture

Public API

Command

Environment

Generator

Workflow

Convention
```

문서 내용과 실제 구현이 충돌하는지도 확인합니다.

---

## 12. 불필요한 변경

현재 요구사항과 관계없는 다음 변경을 확인합니다.

```txt
불필요한 Refactoring

의도하지 않은 Rename

불필요한 Dependency

과도한 Abstraction

미래 요구사항을 위한 구조

불필요한 파일 생성
```

---

## 13. Review 결과

문제가 있다면 중요도가 높은 순서로 제시합니다.

각 Finding에는 다음을 포함합니다.

```txt
문제 위치

무엇이 문제인가

왜 문제가 되는가

어떻게 수정해야 하는가
```

막연한 의견만 남기지 않습니다.

예:

```txt
높음
중간
낮음
```

Blocking 문제와 단순 개선 의견을 구분합니다.

문제가 없다면 억지로 Finding을 만들지 않습니다.

그 경우 다음과 같이 명확히 말합니다.

```txt
현재 변경 범위에서 Blocking 또는 실질적인 문제를 찾지 못했습니다.
```

리뷰 후 사용자가 수정까지 요청하면 별도의 구현 작업으로 처리합니다.
