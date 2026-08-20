# Claude Code Guide

이 문서는 `boilerplate-turborepo`에서 Claude Code를 사용할 때 제공되는 프로젝트 설정, Agent, Skill의 역할과 기본 사용 방법을 설명합니다.

Claude Code 관련 파일은 프로젝트 Architecture나 Convention을 별도로 정의하지 않습니다.

프로젝트 자체의 규칙에 대한 Source of Truth는 `docs/*`입니다.

Claude Code 설정은 다음 역할에 집중합니다.

```txt
Claude Code가 프로젝트 문서를 찾는 방법

프로젝트 공통 작업 지침

Claude Code의 파일 및 명령 실행 권한

개인 Local 설정 분리

전문 Agent 제공

반복 Workflow를 위한 Skill 제공
```

---

## 1. 제공되는 구조

현재 Repository는 다음 Claude Code 관련 파일을 제공합니다.

```txt
CLAUDE.md
CLAUDE.local.example.md

.claude/
├─ settings.json
├─ settings.local.example.json
├─ agents/
│  ├─ architect.md
│  ├─ code-reviewer.md
│  ├─ docs-maintainer.md
│  └─ test-writer.md
└─ skills/
   ├─ implement-feature/
   │  └─ SKILL.md
   ├─ review-code/
   │  └─ SKILL.md
   ├─ update-docs/
   │  └─ SKILL.md
   └─ write-tests/
      └─ SKILL.md
```

개인 환경에서는 필요에 따라 다음 파일을 추가할 수 있습니다.

```txt
CLAUDE.local.md
.claude/settings.local.json
```

이 두 파일은 Repository에 Commit하지 않습니다.

---

## 2. 기본 원칙

Claude Code 관련 설정은 프로젝트 문서를 대체하지 않습니다.

구조:

```txt
docs/*
  프로젝트 Architecture와 정책의 Source of Truth

CLAUDE.md
  Claude Code가 프로젝트에서 작업하기 위한 진입점

CLAUDE.local.md
  개인 작업 지침

.claude/settings.json
  공유 Claude Code 설정과 권한

.claude/settings.local.json
  개인 Claude Code 설정과 권한

.claude/agents/*
  특정 역할을 수행하는 전문 Agent

.claude/skills/*
  반복해서 사용할 수 있는 작업 Workflow
```

다음과 같은 프로젝트 규칙은 Claude Code 파일에 중복 정의하지 않습니다.

```txt
Package 역할

Dependency Boundary

Domain Layer

Server Action

App Layer

Design System

Test 전략

Storybook 기준

Naming Convention

Security Policy

개발 Workflow
```

이 내용은 각각의 `docs/*` 문서를 참조합니다.

---

# 3. 처음 사용할 때

Repository Root에서 Claude Code를 실행합니다.

```bash
claude
```

Claude Code는 Repository의 `CLAUDE.md`와 Project-level `.claude` 설정을 기준으로 작업합니다.

설정이 정상적으로 인식되었는지 확인할 필요가 있다면 Claude Code에서:

```txt
/status
```

를 사용할 수 있습니다.

개인 Auto Memory 설정을 확인하거나 변경할 필요가 있다면:

```txt
/memory
```

를 사용할 수 있습니다.

이 Repository에서는 프로젝트 지식이 Claude의 자동 Memory에 누적되어 문서와 별도로 발전하는 것을 방지하기 위해 Project Setting에서 Auto Memory를 기본적으로 비활성화합니다.

프로젝트 지식은 `docs/*`에서 명시적으로 관리합니다.

---

# 4. `CLAUDE.md`

`CLAUDE.md`는 이 Repository에서 Claude Code가 읽는 **프로젝트 공통 진입 지침**입니다.

이 파일의 역할은 Architecture를 다시 설명하는 것이 아닙니다.

다음 내용을 제공합니다.

```txt
이 Repository에서 Claude Code가 따라야 할 기본 작업 원칙

작업 전에 어떤 문서를 확인해야 하는지

각 주제별 docs/* 위치

Dependency 설치나 위험한 작업에 대한 기본 주의사항

구현 및 검증의 기본 접근 방식

문서 변경 시 Source of Truth 유지 원칙
```

---

## 4.1 `CLAUDE.md`가 하지 않는 것

`CLAUDE.md`에서는 다음과 같은 상세 규칙을 유지하지 않습니다.

```txt
Domain Service는 정확히 무엇을 하는가?

Repository Naming은 어떻게 하는가?

Entity / Feature / View는 어떻게 구분하는가?

어떤 Test를 어디에 작성하는가?

어떤 Component에 Story를 작성하는가?

Workspace Package는 언제 추가하는가?
```

이러한 규칙은 각각의 전문 문서에 둡니다.

예:

```txt
Domain
  docs/08_도메인_레이어.md

Server Action
  docs/09_Server_Actions.md

App Structure
  docs/10_앱_구조.md

Testing
  docs/12_테스트_전략.md

Storybook
  docs/13_스토리북.md

Conventions
  docs/18_컨벤션.md

Extension
  docs/19_확장_가이드.md
```

---

## 4.2 Claude Code의 문서 탐색

`CLAUDE.md`는 Claude에게 먼저:

```txt
docs/00_문서_가이드.md
```

를 확인하도록 안내합니다.

그 후 현재 작업에 필요한 문서만 선택해서 확인합니다.

예:

```txt
Repository 구현
  ↓
07_데이터베이스.md
08_도메인_레이어.md
12_테스트_전략.md
18_컨벤션.md
```

```txt
새 Feature 구현
  ↓
09_Server_Actions.md
10_앱_구조.md
12_테스트_전략.md
16_개발_워크플로우.md
```

모든 작업마다 모든 문서를 읽도록 강제하지 않습니다.

---

# 5. `CLAUDE.local.example.md`

`CLAUDE.local.example.md`는 개발자 개인의 Claude Code 지침을 작성하기 위한 Template입니다.

필요하다면:

```bash
cp CLAUDE.local.example.md CLAUDE.local.md
```

로 복사합니다.

실제 개인 설정은:

```txt
CLAUDE.local.md
```

에 작성합니다.

---

## 5.1 Local 지침의 용도

다음과 같은 개인적인 작업 선호를 작성할 수 있습니다.

```txt
주로 개발하는 App

선호하는 Test 명령

Local Port 정보

큰 Refactoring 전 설명을 원하는지

Dependency 설치 전 확인을 원하는지

개인적인 작업 순서
```

예:

```txt
Prefer running targeted tests while implementing.

Explain architectural impact before large structural changes.

Ask before installing new dependencies.
```

---

## 5.2 Local 지침에 두지 않는 것

다음 내용을 `CLAUDE.local.md`에서 프로젝트 규칙으로 재정의하지 않습니다.

```txt
Architecture

Dependency Boundary

Naming Convention

Test Strategy

Package Responsibility
```

프로젝트 전체가 공유해야 하는 규칙이라면 `docs/*`를 수정합니다.

또한 다음과 같은 Secret을 작성하지 않습니다.

```txt
Password

Token

API Key

Database Credential

OAuth Secret

Private Environment Variable
```

`CLAUDE.local.md`는 Secret 저장소가 아닙니다.

---

# 6. `.claude/settings.json`

`.claude/settings.json`은 Repository에 Commit되는 **프로젝트 공통 Claude Code 설정**입니다.

현재 이 프로젝트에서는 주로 다음을 관리합니다.

```txt
JSON Schema

Auto Memory

파일 접근 권한

파일 수정 권한

Shell 명령 권한

위험 작업 제한
```

---

## 6.1 JSON Schema

설정 파일에는 Claude Code Settings Schema를 연결합니다.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

이를 통해 지원하는 Editor에서 설정 자동완성과 Validation을 사용할 수 있습니다.

---

## 6.2 Auto Memory

현재 프로젝트는:

```json
{
  "autoMemoryEnabled": false
}
```

를 사용합니다.

프로젝트 Architecture나 Convention이 Claude Code 내부 Memory와 `docs/*`에 이중으로 유지되는 것을 피하기 위한 설정입니다.

프로젝트 지식은 명시적으로:

```txt
CLAUDE.md
docs/*
.claude/agents/*
.claude/skills/*
```

에서 관리합니다.

---

# 7. Permission 정책

`.claude/settings.json`에서는 Claude Code가 수행할 수 있는 작업을 대략 다음 세 종류로 구분합니다.

```txt
allow
  별도 확인 없이 허용

ask
  실행 전에 사용자 확인 필요

deny
  실행 금지
```

프로젝트 설정은 Claude가 일상적인 개발 작업은 수행할 수 있게 하면서, 보안 또는 Repository 상태에 큰 영향을 줄 수 있는 작업에는 사람의 판단이 개입하도록 구성합니다.

---

## 7.1 `deny`

대표적으로 다음 작업을 제한합니다.

```txt
실제 Environment 파일 읽기

secrets/ 읽기

Vercel Local Metadata 읽기

pnpm-lock.yaml 직접 수정

기존 Prisma Migration 직접 수정

rm -rf

git push

git reset --hard

git clean

Package Publish
```

이 정책의 목적은 Claude Code를 읽기 전용으로 만드는 것이 아닙니다.

다음과 같은 위험을 방지하기 위한 것입니다.

```txt
Secret 노출

Lockfile 수동 변조

Migration History 변조

의도하지 않은 파일 삭제

Remote Repository 변경

Package Registry 배포
```

---

## 7.2 Environment Example 파일

실제 Environment 파일은 읽지 못하도록 제한하지만 다음 Template은 읽을 수 있습니다.

```txt
.env.example
.env.test.example
.env.e2e.example
```

Claude Code가 환경변수 구조와 필요한 Key를 이해할 수 있어야 하기 때문입니다.

실제 Secret 값과 Environment 구조 문서는 구분합니다.

---

## 7.3 `ask`

다음처럼 프로젝트 상태에 의미 있는 변경을 발생시키는 작업은 사용자의 확인을 요구합니다.

대표적으로:

```txt
pnpm install

pnpm add

pnpm remove

Database Migration

Database Push

Database Seed

git commit
```

Claude는 필요한 작업을 제안할 수 있지만 사용자의 승인 없이 실행하지 않습니다.

---

## 7.4 `allow`

일상적인 개발과 검증에 필요한 작업은 허용합니다.

대표적으로:

```txt
Repository 파일 읽기

apps/* 수정

packages/* 수정

tooling/* 수정

docs/* 수정

README.md 수정

pnpm check

pnpm lint

pnpm check-types

pnpm format:check

Test 실행

git status

git diff
```

즉 Claude Code가 구현과 검증은 적극적으로 수행할 수 있지만 위험하거나 외부 상태를 변경하는 작업은 별도로 통제합니다.

---

# 8. `.claude/settings.local.json`

개발자 개인의 Claude Code 설정은:

```txt
.claude/settings.local.json
```

에 작성할 수 있습니다.

이 파일은 Repository에 Commit하지 않습니다.

예를 들어 특정 개발자가 개인 환경에서 추가로 허용하고 싶은 명령이나 Local 설정이 있다면 이 파일을 사용할 수 있습니다.

Template:

```txt
.claude/settings.local.example.json
```

필요한 경우 복사합니다.

```bash
cp .claude/settings.local.example.json .claude/settings.local.json
```

---

# 9. 프로젝트 설정과 Local 설정

설정 범위는 개념적으로 다음과 같습니다.

```txt
Project
  .claude/settings.json
  Repository 공동 정책

Local
  .claude/settings.local.json
  현재 개발자의 현재 Repository 개인 설정
```

Project Setting에는 팀이나 Boilerplate 사용자가 공유해야 할 안전한 기본값을 둡니다.

Local Setting에는 개인 Machine 또는 작업 방식에만 필요한 설정을 둡니다.

프로젝트 보안 정책을 우회하기 위한 용도로 Local Setting을 사용하지 않습니다.

---

# 10. Agent

Agent는 특정 역할에 특화된 Claude Code의 별도 작업 Context입니다.

현재 프로젝트에서는 다음 Agent를 제공합니다.

```txt
architect

code-reviewer

docs-maintainer

test-writer
```

위치:

```txt
.claude/agents/
```

각 Agent는 자신의 역할에 필요한:

```txt
Instructions

Tools

Permission Mode

Preloaded Skills
```

를 가질 수 있습니다.

Agent가 수행한 작업의 핵심 결과는 Main Conversation으로 반환됩니다.

---

# 11. Agent와 Skill의 차이

두 기능의 역할을 구분합니다.

```txt
Agent
  특정 역할을 수행하는 전문 작업자

Skill
  특정 종류의 작업을 수행하기 위한 재사용 가능한 Workflow
```

예:

```txt
code-reviewer
  코드 리뷰라는 역할을 가진 Agent

review-code
  코드 리뷰 과정에서 따를 Workflow
```

Agent가 특정 Skill을 미리 읽도록 구성할 수도 있습니다.

현재 프로젝트에서는 이러한 조합을 사용합니다.

```txt
code-reviewer
  + review-code

docs-maintainer
  + update-docs

test-writer
  + write-tests
```

---

# 12. `architect`

파일:

```txt
.claude/agents/architect.md
```

역할:

```txt
Architecture 검토

Package Boundary 검토

Dependency Direction 검토

Domain Layer 검토

App Boundary 검토

구조적 Refactoring 검토
```

`architect`는 구현보다 **구조적 판단**에 집중합니다.

주로 다음 문서를 참조합니다.

```txt
01_아키텍처.md

04_패키지_구조.md

05_의존성_경계.md

07_데이터베이스.md

08_도메인_레이어.md

09_Server_Actions.md

10_앱_구조.md

11_디자인_시스템.md

17_보안_및_운영_기본정책.md

19_확장_가이드.md
```

---

## 12.1 `architect`를 사용하는 경우

예:

```txt
새 Workspace Package가 필요한가?

기존 App을 두 개로 분리해야 하는가?

이 기능은 Domain에 있어야 하는가?

App 내부 코드를 Package로 승격해야 하는가?

현재 Dependency Direction이 적절한가?

대규모 Refactoring의 영향 범위는 무엇인가?
```

단순한 Component 구현이나 작은 Bug Fix에는 일반적으로 필요하지 않습니다.

---

# 13. `code-reviewer`

파일:

```txt
.claude/agents/code-reviewer.md
```

역할:

```txt
현재 변경사항 Review

Correctness

Architecture Boundary

Server / Client Boundary

Security

Naming / Convention

Test 누락

Documentation 영향
```

이 Agent는:

```txt
review-code
```

Skill을 preload합니다.

따라서 코드 리뷰 시 Project의 실제 Review Workflow를 함께 사용합니다.

---

## 13.1 `code-reviewer`의 출력

주요 결과는 다음 범주로 구분합니다.

```txt
Critical issues

Important issues

Optional improvements

Validation to run
```

단순 취향과 실제 문제를 구분하도록 구성합니다.

다음과 같은 이유만으로 불필요한 변경을 요구하지 않습니다.

```txt
Helper를 만들 수 있음

Package로 뺄 수 있음

DTO를 만들 수 있음

Story를 만들 수 있음

E2E를 만들 수 있음
```

현재 Architecture와 Test 기준에서 실제 필요성이 있는지를 우선 판단합니다.

---

# 14. `docs-maintainer`

파일:

```txt
.claude/agents/docs-maintainer.md
```

역할:

```txt
docs/* 수정

README 수정

Architecture 변경에 따른 문서 갱신

Tooling / Command 변경 반영

오래된 문서 내용 제거

Cross-reference 정리
```

이 Agent는:

```txt
update-docs
```

Skill을 preload합니다.

---

## 14.1 문서 Source of Truth 유지

`docs-maintainer`는 같은 내용을 여러 문서에 복사하지 않습니다.

먼저 해당 책임을 소유한 문서를 찾습니다.

예:

```txt
Environment
  → 06_환경변수.md

Database
  → 07_데이터베이스.md

Server Action
  → 09_Server_Actions.md

Testing
  → 12_테스트_전략.md

Generator
  → 14_코드_생성기.md

Convention
  → 18_컨벤션.md
```

변경된 책임과 직접 관련된 문서만 갱신합니다.

---

# 15. `test-writer`

파일:

```txt
.claude/agents/test-writer.md
```

역할:

```txt
Unit Test

Component Test

Integration Test

E2E Test

기존 Test 수정
```

이 Agent는:

```txt
write-tests
```

Skill을 preload합니다.

---

## 15.1 Test Level 선택

`test-writer`는 모든 변경에 같은 종류의 Test를 추가하지 않습니다.

`12_테스트_전략.md`를 기준으로 다음 중 실제 Behavior에 맞는 수준을 선택합니다.

```txt
Unit

Component

Integration

E2E
```

예:

```txt
Domain Rule
  → Unit

React Interaction
  → Component

Repository Persistence
  → Integration

중요 Browser User Flow
  → E2E
```

---

# 16. Agent 사용

Claude Code는 Agent의 `description`과 현재 작업을 바탕으로 적절한 Agent에 작업을 위임할 수 있습니다.

필요하다면 사용자도 명시적으로 Agent 사용을 요청할 수 있습니다.

예:

```txt
Use the architect agent to review this package split.
```

```txt
Use the code-reviewer agent to review the current diff.
```

```txt
Use the test-writer agent to add tests for this change.
```

```txt
Use the docs-maintainer agent to update the affected docs.
```

모든 작업을 Agent로 분리할 필요는 없습니다.

별도의 전문 역할이나 독립적인 Context가 유용한 작업에 사용합니다.

---

# 17. Skill

Skill은 반복되는 작업을 위한 Project-level Workflow입니다.

현재 제공되는 Skill:

```txt
implement-feature

review-code

update-docs

write-tests
```

위치:

```txt
.claude/skills/<skill-name>/SKILL.md
```

각 `SKILL.md`에는 해당 작업에서 따라야 하는 절차와 참고 문서가 정의됩니다.

---

# 18. Skill의 문서 참조 원칙

Skill 자체에는 프로젝트 Architecture를 다시 정의하지 않습니다.

예를 들어 `implement-feature`가:

```txt
Domain이 무엇인가?

Feature가 무엇인가?

Repository는 어느 Package에 있는가?
```

를 독자적으로 정의하지 않습니다.

대신:

```txt
08_도메인_레이어.md

09_Server_Actions.md

10_앱_구조.md

16_개발_워크플로우.md
```

등을 참조합니다.

따라서 Architecture가 변경되었을 때 Skill과 프로젝트 문서에 같은 규칙을 이중으로 수정하는 상황을 줄입니다.

---

# 19. `implement-feature`

위치:

```txt
.claude/skills/implement-feature/SKILL.md
```

새로운 기능을 구현하거나 기존 기능을 확장하는 Workflow입니다.

주요 절차:

```txt
요구사항 확인
  ↓
기존 구현 확인
  ↓
필요한 책임과 계층 판단
  ↓
필요하면 Generator 사용
  ↓
하위 책임부터 구현
  ↓
Application Layer 연결
  ↓
Test
  ↓
필요한 Story
  ↓
문서 영향 확인
  ↓
검증
```

---

## 19.1 필요한 계층만 구현

`implement-feature`는 모든 Feature에서 다음을 전부 생성하도록 지시하지 않습니다.

```txt
Database

Domain

Server Action

Entity

Feature

View

App Router
```

실제 Use Case에 필요한 계층만 변경합니다.

예:

```txt
표시 전용 Domain UI
  → Entity

사용자 Interaction
  → Feature

새 화면 조립
  → View

일반 Server-side Query
  → Domain Service + Server Component

Mutation
  → Domain Service + Server Action + Feature

Persistence 추가
  → Prisma + Repository + Domain
```

구체적인 구현 순서는 `16_개발_워크플로우.md`를 따릅니다.

---

# 20. `review-code`

위치:

```txt
.claude/skills/review-code/SKILL.md
```

변경된 코드를 Repository 기준으로 검토하는 Workflow입니다.

주요 확인 대상:

```txt
Correctness

Responsibility Placement

Dependency Direction

Server / Client Boundary

Database / Domain Boundary

Server Action Responsibility

Security

Naming

Public API

Test

Documentation
```

단순한 스타일 취향이 아니라 현재 Repository 문서에서 근거를 찾을 수 있는 문제를 우선합니다.

`code-reviewer` Agent에 preload되어 있습니다.

---

# 21. `update-docs`

위치:

```txt
.claude/skills/update-docs/SKILL.md
```

프로젝트의 코드나 정책 변경에 따라 문서를 갱신하는 Workflow입니다.

기본 원칙:

```txt
실제 구현을 먼저 확인한다.

책임을 소유한 문서를 찾는다.

기존 문서를 우선 수정한다.

오래된 참조를 검색한다.

직접 영향을 받은 Cross-reference를 수정한다.

관련 없는 문서는 건드리지 않는다.
```

또한 문서의 역할을 다음처럼 구분합니다.

```txt
README.md
  Repository Entry Point

docs/*
  Project-wide Architecture / Policy / Workflow

Package README
  Package-specific Documentation

CLAUDE.md
  Claude Code Entry Point

.claude/agents/*
  Agent Instructions

.claude/skills/*
  Reusable Workflows
```

`docs-maintainer` Agent에 preload되어 있습니다.

---

# 22. `write-tests`

위치:

```txt
.claude/skills/write-tests/SKILL.md
```

Behavior 변경에 필요한 Test를 작성하는 Workflow입니다.

먼저 다음을 확인합니다.

```txt
현재 구현

주변 Test

공통 Test Config

기존 Fixture

12_테스트_전략.md

18_컨벤션.md
```

그 후 실제 검증 대상에 맞는 Test Level을 선택합니다.

```txt
Unit

Component

Integration

E2E
```

`test-writer` Agent에 preload되어 있습니다.

---

# 23. Skill 사용

현재 제공되는 Skill은 사용자가 직접 요청할 수도 있고 Claude가 현재 Task에 적합하다고 판단하면 사용할 수도 있습니다.

사용자가 명시적으로 실행하는 경우 다음과 같이 사용할 수 있습니다.

```txt
/implement-feature

/review-code

/update-docs

/write-tests
```

단순히 자연어로 요청해도 됩니다.

예:

```txt
Implement this feature using the project workflow.
```

```txt
Review the current diff.
```

```txt
Update the affected documentation.
```

```txt
Add appropriate tests for this change.
```

Skill은 작업 Workflow를 제공할 뿐, 프로젝트 자체의 Architecture Source of Truth가 되지는 않습니다.

---

# 24. Agent와 Skill 조합

현재 기본 관계는 다음과 같습니다.

```txt
architect
  Architecture 판단
  별도의 Skill preload 없음

code-reviewer
  Code Review Agent
  ↓
  review-code

docs-maintainer
  Documentation Agent
  ↓
  update-docs

test-writer
  Test Agent
  ↓
  write-tests

Main Claude
  Feature 구현
  ↓
  implement-feature
```

`implement-feature`는 일반적인 Main Conversation에서 기능 구현 Workflow로 사용합니다.

필요한 경우 Claude가 구현 과정에서 다른 Agent를 별도의 전문 작업에 사용할 수도 있습니다.

---

# 25. 권장 기능 구현 흐름

새 기능을 구현하는 일반적인 Claude Code 사용 흐름:

```txt
Requirement
  ↓
implement-feature
  ↓
Implementation
  ↓
Targeted Test
  ↓
code-reviewer / review-code
  ↓
필요한 수정
  ↓
docs-maintainer / update-docs
  필요할 경우
  ↓
pnpm check
  ↓
관련 Test
```

모든 작업에서 모든 Agent와 Skill을 순서대로 실행할 필요는 없습니다.

변경 범위에 필요한 것만 사용합니다.

---

# 26. Architecture 변경 흐름

구조 변경을 검토하는 경우:

```txt
Requirement
  ↓
architect
  ↓
영향 범위와 Boundary 확인
  ↓
구현
  ↓
code-reviewer
  ↓
docs-maintainer
```

예:

```txt
새 Workspace Package 추가

App 분리

Domain Boundary 변경

Dependency Direction 변경

공통 코드 Package 승격
```

Architecture 변경 기준 자체는 `19_확장_가이드.md`와 관련 전문 문서를 따릅니다.

---

# 27. Test 작업 흐름

기존 구현에 Test를 추가하거나 Test 전략을 보완할 경우:

```txt
현재 Behavior 확인
  ↓
test-writer
  ↓
write-tests
  ↓
적절한 Test Level 선택
  ↓
Test 작성
  ↓
관련 Test 실행
```

Test 전략은 `12_테스트_전략.md`가 Source of Truth입니다.

---

# 28. 문서 작업 흐름

Architecture, Tooling, Command 또는 Convention이 변경되었다면:

```txt
현재 구현 확인
  ↓
docs-maintainer
  ↓
update-docs
  ↓
책임 문서 확인
  ↓
해당 문서 수정
  ↓
오래된 Cross-reference 확인
```

Claude Code 관련 설정 자체가 변경되었다면 이 문서:

```txt
20_Claude_Code.md
```

도 갱신 대상인지 확인합니다.

---

# 29. Claude Code 파일을 수정할 때

다음 파일을 변경했다면 역할 중복이 생기지 않았는지 확인합니다.

```txt
CLAUDE.md

CLAUDE.local.example.md

.claude/settings.json

.claude/agents/*

.claude/skills/*
```

특히 다음 패턴을 피합니다.

```txt
CLAUDE.md에 Architecture 전체 복사

Agent마다 Dependency Rule 복사

Skill마다 Test Strategy 복사

같은 Convention을 여러 Skill에서 직접 정의

docs/*와 Claude 설정에 서로 다른 정책 유지
```

---

# 30. 프로젝트 문서가 우선한다

Claude Code 관련 파일과 전문 문서에서 같은 주제가 보인다면 전문 문서를 기준으로 합니다.

예:

```txt
CLAUDE.md
  "Follow the Domain Layer guide."

docs/08_도메인_레이어.md
  실제 Domain 정책
```

이 구조가 정상입니다.

반대로:

```txt
CLAUDE.md
  Domain 정책 A

08_도메인_레이어.md
  Domain 정책 B
```

처럼 동일한 정책을 두 곳에서 독립적으로 유지하지 않습니다.

---

# 31. 구현과 문서가 다를 때

Claude가 현재 코드와 문서의 차이를 발견했다면 임의로 어느 한쪽을 정답으로 가정하지 않습니다.

다음처럼 처리합니다.

```txt
현재 구현 확인

현재 문서 확인

불일치 확인

현재 Task가 어느 쪽을 변경하려는지 판단

필요하면 불일치 보고
```

새로운 제3의 Architecture를 임의로 만들지 않습니다.

---

# 32. Secret 관리

Claude Code가 실제 Secret 파일을 읽을 필요는 없습니다.

프로젝트 Environment 구조는 다음 파일로 확인합니다.

```txt
.env.example
.env.test.example
.env.e2e.example
```

실제 값이 들어 있는 Local Environment 파일은 Permission에서 제한합니다.

Security 원칙은:

```txt
17_보안_및_운영_기본정책.md
```

를 따릅니다.

---

# 33. 의존성 변경

Claude가 새로운 Dependency가 필요하다고 판단하더라도 임의로 설치하지 않습니다.

예:

```bash
pnpm add ...
pnpm install
pnpm remove ...
```

이러한 작업은 Project Permission에 따라 사용자 확인을 거칩니다.

Dependency를 추가하기 전:

```txt
기존 Dependency로 해결 가능한가?

새 Dependency가 정말 필요한가?

어느 Workspace에 추가해야 하는가?

Runtime Dependency인가?

Dev Dependency인가?

Catalog 대상인가?
```

를 확인합니다.

관련 기준은:

```txt
02_기본설정.md
19_확장_가이드.md
```

를 따릅니다.

---

# 34. Database 변경

다음 작업은 Repository 상태나 Database 상태에 영향을 줄 수 있으므로 명시적으로 관리합니다.

```txt
Prisma Migration

db:push

db:migrate

db:seed
```

기존 Migration 파일을 임의로 직접 수정하지 않습니다.

Database 작업 정책은:

```txt
07_데이터베이스.md
16_개발_워크플로우.md
```

를 따릅니다.

---

# 35. Git 작업

Claude Code는 다음과 같은 조회 작업을 자유롭게 사용할 수 있습니다.

```bash
git status
git diff
```

반면 다음 작업은 사용자 확인 또는 금지 대상입니다.

```txt
git commit
git push
git reset --hard
git clean
```

Commit Message 규칙은:

```txt
18_컨벤션.md
```

를 따릅니다.

---

# 36. 검증

Claude가 코드를 변경했다면 변경 범위에 맞는 검증을 수행합니다.

기본 정적 검증:

```bash
pnpm check
```

일반 Test:

```bash
pnpm test
```

필요한 경우:

```bash
pnpm test:integration
pnpm build
pnpm test:e2e
```

를 추가합니다.

어떤 검증이 필요한지는:

```txt
12_테스트_전략.md
16_개발_워크플로우.md
```

를 따릅니다.

Claude는 실제로 실행하지 않은 명령을 성공했다고 보고해서는 안 됩니다.

---

# 37. 개인 설정과 공유 설정의 구분

Repository에 공유할 내용:

```txt
CLAUDE.md

CLAUDE.local.example.md

.claude/settings.json

.claude/settings.local.example.json

.claude/agents/*

.claude/skills/*
```

개인에게만 유지할 내용:

```txt
CLAUDE.local.md

.claude/settings.local.json
```

개인 파일에는 프로젝트 전체의 새로운 Architecture 정책을 정의하지 않습니다.

공유할 가치가 있는 규칙이라면 적절한 `docs/*` 또는 Project Claude 설정으로 옮깁니다.

---

# 38. 새로운 Agent 추가 기준

새 Agent는 **반복적으로 필요한 전문 역할과 독립적인 작업 Context가 있을 때** 추가합니다.

다음 이유만으로 Agent를 만들지 않습니다.

```txt
명령 하나를 실행하고 싶다.

Workflow 하나를 재사용하고 싶다.

기존 Agent와 이름만 다른 역할이 필요하다.

단순 Prompt를 저장하고 싶다.
```

이런 경우 Skill이 더 적절할 수 있습니다.

새 Agent를 만들기 전에:

```txt
기존 Agent로 해결 가능한가?

독립적인 Tool 권한이 필요한가?

독립적인 Context가 유용한가?

반복적으로 같은 전문 역할이 필요한가?
```

를 확인합니다.

---

# 39. 새로운 Skill 추가 기준

반복적인 작업 절차가 존재한다면 Skill을 검토합니다.

예:

```txt
기능 구현

코드 리뷰

문서 갱신

Test 작성
```

새 Skill을 만들기 전에:

```txt
기존 Skill에 자연스럽게 포함할 수 있는가?

반복되는 명확한 Workflow인가?

Project Architecture를 복제하지 않고 문서를 참조할 수 있는가?
```

를 확인합니다.

Skill을 세분화하는 것 자체를 목표로 하지 않습니다.

---

# 40. Agent와 Skill을 과도하게 늘리지 않는다

현재 기본 제공:

```txt
Agents
  architect
  code-reviewer
  docs-maintainer
  test-writer

Skills
  implement-feature
  review-code
  update-docs
  write-tests
```

이 구성으로 일반적인 개발 작업 대부분을 처리할 수 있습니다.

다음과 같은 역할을 미리 만들지 않습니다.

```txt
database-agent

server-action-agent

entity-agent

feature-agent

view-agent

prisma-agent
```

단순히 Architecture 계층이 존재한다는 이유로 Agent도 동일하게 만들 필요는 없습니다.

---

# 41. 관련 문서

Claude Code는 작업 종류에 따라 다음 문서를 참조합니다.

```txt
00_문서_가이드.md
  문서 구조와 탐색

01_아키텍처.md
  전체 Architecture

02_기본설정.md
  기술 Stack과 Package 관리

03_프로젝트_구조.md
  Repository 구조

04_패키지_구조.md
  Package 책임

05_의존성_경계.md
  Dependency Boundary

06_환경변수.md
  Environment

07_데이터베이스.md
  Database / Repository

08_도메인_레이어.md
  Domain

09_Server_Actions.md
  Server Action

10_앱_구조.md
  Entity / Feature / View

11_디자인_시스템.md
  Design System

12_테스트_전략.md
  Test

13_스토리북.md
  Storybook

14_코드_생성기.md
  Generator

15_프로젝트_초기화.md
  Project Initialization

16_개발_워크플로우.md
  Development Workflow

17_보안_및_운영_기본정책.md
  Security / Operations

18_컨벤션.md
  Naming / Import / Export / Commit

19_확장_가이드.md
  App / Domain / Package Extension
```

---

# 42. 핵심 원칙

```txt
docs/*를 프로젝트 Architecture와 정책의 Source of Truth로 사용한다.

CLAUDE.md는 Claude Code의 프로젝트 진입점으로 사용한다.

CLAUDE.md에 Architecture 전체를 중복 작성하지 않는다.

CLAUDE.local.md는 개인 작업 선호에 사용한다.

CLAUDE.local.md에 Secret을 저장하지 않는다.

.claude/settings.json은 공유 Claude Code 설정과 권한을 관리한다.

.claude/settings.local.json은 개인 프로젝트 설정에 사용한다.

실제 Environment 파일은 Claude가 읽지 않도록 제한한다.

Environment Example 파일은 프로젝트 구조 파악을 위해 읽을 수 있다.

위험하거나 외부 상태를 변경하는 작업은 사용자 확인 또는 금지 대상으로 둔다.

Agent는 특정 역할에 특화된 전문 작업자로 사용한다.

Skill은 반복 가능한 작업 Workflow로 사용한다.

Agent와 Skill의 역할을 중복시키지 않는다.

Agent는 필요한 Skill을 preload할 수 있다.

architect는 구조적 판단에 집중한다.

code-reviewer는 review-code Workflow로 변경사항을 검토한다.

docs-maintainer는 update-docs Workflow로 문서를 유지한다.

test-writer는 write-tests Workflow로 Test를 작성한다.

implement-feature는 일반적인 기능 구현 Workflow로 사용한다.

Skill 내부에 프로젝트 Architecture를 다시 정의하지 않는다.

Claude Code 관련 파일과 docs/*에서 동일한 정책을 이중으로 유지하지 않는다.

현재 구현과 문서가 다르면 불일치를 확인하고 임의로 새로운 규칙을 만들지 않는다.

새 Agent나 Skill은 실제 반복 책임이 생겼을 때만 추가한다.

Claude가 실행하지 않은 검증을 성공했다고 보고하지 않는다.
```
