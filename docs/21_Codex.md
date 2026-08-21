# Codex Guide

이 문서는 `boilerplate-turborepo`에서 Codex CLI와 VS Code Codex IDE Extension을 사용할 때 제공되는 프로젝트 설정과 기본 사용 방법을 설명합니다.

Codex 관련 파일은 프로젝트 Architecture나 Convention을 별도로 정의하지 않습니다.

프로젝트 규칙의 Source of Truth는 `docs/*`입니다.

기본 구조:

```txt
docs/*
  프로젝트 Architecture와 정책

AGENTS.md
  Codex 프로젝트 진입점

.codex/config.toml
  Repository 공통 Codex 실행 설정

.codex/rules/*
  Command 실행 정책

~/.codex/config.toml
  개발자 개인 Codex 설정
```

---

## 1. 제공 구조

현재 Repository는 다음 Codex 관련 파일을 제공합니다.

```txt
AGENTS.md

.codex/
├─ config.toml
└─ rules/
   └─ default.rules
```

Codex 사용 가이드는:

```txt
docs/21_Codex.md
```

에서 관리합니다.

---

## 2. 기본 원칙

Codex 설정은 프로젝트 규칙 자체를 다시 정의하지 않습니다.

역할을 다음과 같이 구분합니다.

```txt
docs/*
  Architecture
  Convention
  Workflow
  Security
  Test
  Tooling

AGENTS.md
  Codex가 docs/*를 찾는 프로젝트 진입점

.codex/config.toml
  Codex 실행 환경

.codex/rules/*
  Command 승인 및 차단 정책
```

같은 규칙을 여러 파일에서 독립적으로 관리하지 않습니다.

---

## 3. 처음 사용할 때

Repository Root를 VS Code Workspace로 열고 Codex IDE Extension을 사용합니다.

CLI를 사용하는 경우 Repository Root에서 실행합니다.

```bash
codex
```

Codex는 프로젝트의 `AGENTS.md`를 읽고 현재 작업에 필요한 프로젝트 지침을 구성합니다.

기본적인 Context 탐색 흐름:

```txt
AGENTS.md
  ↓
docs/00_문서_가이드.md
  ↓
현재 작업에 필요한 docs/*
  ↓
관련 Source Code
  ↓
관련 Test / Story
```

모든 문서를 항상 Context에 넣지 않습니다.

---

## 4. `AGENTS.md`

Repository Root의:

```txt
AGENTS.md
```

는 Codex의 프로젝트 공통 진입 지침입니다.

주요 책임:

```txt
문서 탐색 방법

상위 Architecture 원칙

구현 전 확인 기준

Test / Validation 기준

안전한 작업 기준
```

상세한 Architecture나 Convention은 해당 전문 문서에서 관리합니다.

예:

```txt
Domain
  → docs/08_도메인_레이어.md

Server Action
  → docs/09_서버_액션.md

App
  → docs/10_앱_구조.md

Test
  → docs/12_테스트_전략.md

Convention
  → docs/18_컨벤션.md
```

---

## 5. `AGENTS.md` 탐색

Codex는 일반적으로 Repository Root부터 현재 작업 Directory까지 내려가며 Instruction File을 확인합니다.

같은 Directory에서는:

```txt
AGENTS.override.md
  ↓ 없으면
AGENTS.md
```

순서로 확인합니다.

따라서 향후 특정 Directory에 별도의 규칙이 정말 필요한 경우:

```txt
packages/database/AGENTS.md

apps/admin/AGENTS.md
```

등을 추가할 수 있습니다.

하지만 기본적으로 Root `AGENTS.md` 하나를 사용합니다.

`docs/*`에서 이미 관리하는 규칙을 하위 `AGENTS.md`에 반복해서 복제하지 않습니다.

---

## 6. `AGENTS.override.md`

특정 Directory에서 기존 지침을 의도적으로 Override해야 하는 경우 사용할 수 있습니다.

예:

```txt
packages/database/
├─ AGENTS.md
└─ AGENTS.override.md
```

같은 Directory에 둘 다 있다면 Override가 우선합니다.

일반적인 프로젝트 구조에서는 필요하지 않습니다.

Temporary Rule이나 특별한 작업 환경이 아니라면 Root `AGENTS.md`를 유지합니다.

---

## 7. `.codex/config.toml`

Repository 공통 Codex 설정은:

```txt
.codex/config.toml
```

에서 관리합니다.

현재 기본 설정:

```toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = false

[features]
memories = false
```

의도:

```txt
일상적인 Source 작업
  → Workspace 내부에서 허용

추가 권한이 필요한 작업
  → 사용자 승인

Shell Network
  → 기본 차단

프로젝트 지식
  → Codex Memory보다 docs/*를 우선
```

Repository 설정에는 Model이나 개인적인 응답 Style 같은 개발자별 선호를 넣지 않습니다.

---

## 8. Trusted Project

Project-local:

```txt
.codex/config.toml
.codex/rules/*
```

는 Codex가 해당 Project를 신뢰하는 경우에만 적용됩니다.

신뢰하지 않는 Repository에서는 Project-local Codex 설정이 무시될 수 있습니다.

따라서 새로 Clone한 프로젝트에서 Codex 설정이 적용되지 않는다면 현재 Workspace의 Trust 상태를 먼저 확인합니다.

---

## 9. 개인 설정

개발자 개인의 Codex 설정은:

```txt
~/.codex/config.toml
```

에서 관리합니다.

적절한 대상:

```txt
Model

Reasoning 수준

개인적인 UI / CLI 선호

개인 MCP Server

Machine-specific 설정
```

프로젝트 전체가 따라야 하는 규칙을 개인 Config에만 두지 않습니다.

반대로 개인적인 Model 선택을 Repository `.codex/config.toml`에 고정하지 않습니다.

---

## 10. Configuration 우선순위

Codex 설정은 여러 계층에서 조합될 수 있습니다.

개념적으로 높은 우선순위부터:

```txt
CLI / Runtime Override

Project .codex/config.toml

선택된 User Profile

~/.codex/config.toml

System Config

Built-in Default
```

Project 안에서도 여러 `.codex/config.toml`이 존재한다면 현재 작업 Directory에 가까운 설정이 더 높은 우선순위를 가질 수 있습니다.

현재 Boilerplate에서는 중첩 Project Config를 기본적으로 사용하지 않습니다.

---

## 11. Sandbox와 Approval

현재 Repository 기본값:

```txt
sandbox_mode
  workspace-write

approval_policy
  on-request
```

`workspace-write`는 현재 Workspace에서 일반적인 Source 작업을 수행할 수 있도록 하면서 Machine 전체에 대한 무제한 접근을 기본값으로 두지 않습니다.

`on-request`는 Sandbox 밖의 추가 권한이 필요한 경우 사용자 확인을 받을 수 있도록 합니다.

다음 설정을 Repository 기본값으로 사용하지 않습니다.

```txt
danger-full-access

approval_policy = "never"
```

특별히 외부 Sandbox가 보장되는 자동화 환경이 아니라면 안전한 기본값을 유지합니다.

---

## 12. Network

현재 Project Config는 Workspace Sandbox에서 Shell의 외부 Network 접근을 기본적으로 허용하지 않습니다.

```toml
[sandbox_workspace_write]
network_access = false
```

다음 작업처럼 Network가 필요한 작업은 별도의 권한 경계를 거칩니다.

```txt
Dependency 설치

외부 CLI 호출

Remote Resource 접근
```

Network 접근을 편의상 항상 허용하지 않습니다.

---

## 13. Rules

Project-local Command 정책은:

```txt
.codex/rules/default.rules
```

에서 관리합니다.

현재 정책은 크게 다음과 같습니다.

```txt
사용자 확인

  Dependency 변경

  Database Schema / Seed 변경

  git commit


차단

  git push

  git reset --hard

  git clean

  rm -rf

  Package Publish
```

Rules는 Command 실행 Policy를 보조하는 기능입니다.

Architecture나 Business Rule을 `.rules`에 작성하지 않습니다.

---

## 14. Rules와 AGENTS의 차이

두 파일은 목적이 다릅니다.

```txt
AGENTS.md

  어떤 방식으로 코드를 작성할 것인가
  어떤 문서를 확인할 것인가
  어떤 Architecture를 유지할 것인가
```

```txt
.codex/rules/*.rules

  특정 Shell Command를
  허용 / 확인 / 차단할 것인가
```

예:

```txt
"기존 Migration을 직접 수정하지 않는다."
  → AGENTS.md / docs

"git push를 실행하지 않는다."
  → Rules
```

두 역할을 혼합하지 않습니다.

---

## 15. VS Code

VS Code에서는 Repository Root를 Workspace로 열어 사용하는 것을 기본으로 합니다.

Codex IDE Extension과 CLI는 동일한 Config Layer를 사용할 수 있습니다.

Codex의 Project Config를 수정하려면:

```txt
.codex/config.toml
```

을 직접 수정합니다.

개발자 개인 설정은:

```txt
~/.codex/config.toml
```

에서 관리합니다.

`.vscode/settings.json`을 Codex 프로젝트 정책 저장소로 사용하지 않습니다.

---

## 16. 권장 작업 흐름

일반적인 기능 구현:

```txt
요구사항 확인
  ↓
AGENTS.md
  ↓
관련 docs/*
  ↓
현재 Source 확인
  ↓
필요한 계층 판단
  ↓
구현
  ↓
관련 Test
  ↓
pnpm check
```

Persistence 변경:

```txt
Requirement
  ↓
Database / Domain 문서 확인
  ↓
Prisma Schema
  ↓
Repository
  ↓
Domain
  ↓
필요한 Application Layer
  ↓
Integration Test
  ↓
Validation
```

UI 변경:

```txt
App / Design System 문서 확인
  ↓
현재 UI 구조 확인
  ↓
Component 구현
  ↓
Component Test
  ↓
필요한 Story
  ↓
Validation
```

---

## 17. 검증

Codex가 코드를 수정했다면 변경 범위에 맞는 검증을 수행합니다.

기본:

```bash
pnpm check
pnpm test
```

Persistence가 변경되었다면 필요에 따라:

```bash
pnpm test:integration
```

실제 사용자 Flow가 변경되었다면:

```bash
pnpm test:e2e
```

Production Boundary 확인이 필요하다면:

```bash
pnpm build
```

모든 변경에서 모든 Test를 기계적으로 실행하지 않습니다.

자세한 기준은 `12_테스트_전략.md`와 `16_개발_워크플로우.md`를 따릅니다.

---

## 18. Secret

Codex에게 실제 Environment Secret을 읽거나 출력하도록 지시하지 않습니다.

다음 파일은 구조 확인에 사용할 수 있습니다.

```txt
.env.example

.env.test.example

.env.e2e.example
```

다음과 같은 실제 Local Environment는 민감한 값이 포함될 수 있습니다.

```txt
.env.local

.env.test.local

.env.e2e.local
```

Secret 정책은 `06_환경변수.md`와 `17_보안_및_운영_기본정책.md`를 따릅니다.

---

## 19. Claude Code와의 관계

Claude Code와 Codex는 서로 다른 Tool이지만 프로젝트 규칙의 Source of Truth를 공유합니다.

```txt
docs/*
  공통 Project Source of Truth
```

Claude Code:

```txt
CLAUDE.md

.claude/*
```

Codex:

```txt
AGENTS.md

.codex/*
```

Tool별 지침 파일에서 Architecture와 Convention을 서로 다르게 정의하지 않습니다.

프로젝트 규칙이 변경되었다면 먼저 해당 `docs/*`를 수정하고 Tool-specific 진입점에 영향이 있는지 확인합니다.

---

## 20. 관련 문서

```txt
00_문서_가이드.md
  문서 체계와 AI Context 선택

01_아키텍처.md
  전체 Architecture

05_의존성_경계.md
  Workspace Dependency

12_테스트_전략.md
  Test 기준

16_개발_워크플로우.md
  구현과 검증 Workflow

17_보안_및_운영_기본정책.md
  Security와 Secret

18_컨벤션.md
  Naming / Import / Export / Commit

20_Claude_Code.md
  Claude Code 설정
```

---

## 21. 핵심 원칙

```txt
프로젝트 규칙은 docs/*가 Source of Truth다.

AGENTS.md는 Codex의 프로젝트 진입점이다.

.codex/config.toml은 Repository 공통 실행 정책을 관리한다.

.codex/rules는 Command 실행 정책만 관리한다.

개인 설정은 ~/.codex/config.toml에 둔다.

Model과 개인 선호를 Repository에 고정하지 않는다.

Root AGENTS.md 하나부터 시작하고 불필요한 중첩 지침을 만들지 않는다.

일상적인 작업은 workspace-write Sandbox 안에서 수행한다.

추가 권한은 on-request로 사용자에게 확인한다.

위험하거나 Remote 상태를 변경하는 Command를 자동 실행하지 않는다.

Codex 전용 파일에 Architecture와 Convention을 중복 정의하지 않는다.
```
