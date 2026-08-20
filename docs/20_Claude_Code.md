# Claude Code Guide

이 문서는 `boilerplate-turborepo`에서 Claude Code를 사용할 때 제공되는 프로젝트 설정, Agent, Skill의 역할과 기본 사용 방법을 설명합니다.

Claude Code 관련 파일은 프로젝트 Architecture나 Convention을 별도로 정의하지 않습니다.

프로젝트 자체의 규칙에 대한 Source of Truth는 `docs/*`입니다.

기본 구조:

```txt
docs/*
  프로젝트 Architecture와 정책

CLAUDE.md
  Claude Code의 프로젝트 진입점

CLAUDE.local.md
  개인 작업 지침

.claude/settings.json
  프로젝트 공통 Claude Code 설정

.claude/settings.local.json
  개인 Claude Code 설정

.claude/agents/*
  특정 역할에 특화된 Agent

.claude/skills/*
  반복 작업을 위한 Workflow
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

개인 환경에서는 필요에 따라 다음 파일을 생성합니다.

```txt
CLAUDE.local.md
.claude/settings.local.json
```

이 두 파일은 Repository에 Commit하지 않습니다.

---

## 2. 처음 사용할 때

Repository Root에서 Claude Code를 실행합니다.

```bash
claude
```

Claude Code는 `CLAUDE.md`를 프로젝트 작업의 진입점으로 사용하고, 현재 작업에 필요한 `docs/*`와 Source Code를 확인합니다.

모든 문서를 항상 읽는 것이 아니라 현재 작업에 필요한 문서를 선택합니다.

기본 탐색 흐름:

```txt
CLAUDE.md
  ↓
docs/00_문서_가이드.md
  ↓
현재 작업에 필요한 docs/*
  ↓
관련 Source Code
```

AI 작업에서 어떤 문서를 우선적으로 제공할지는 `00_문서_가이드.md`를 따릅니다.

---

## 3. `CLAUDE.md`

`CLAUDE.md`는 Claude Code가 이 Repository에서 작업할 때 사용하는 **프로젝트 공통 진입 지침**입니다.

주요 역할:

```txt
작업 전 확인할 기준 안내

docs/* 탐색 경로 제공

프로젝트 공통 작업 원칙

위험한 작업에 대한 주의

구현 및 검증의 기본 접근 방식

문서 Source of Truth 유지
```

`CLAUDE.md` 자체에서 다음과 같은 상세 정책을 다시 정의하지 않습니다.

```txt
Package Responsibility

Dependency Boundary

Domain Layer

Server Action

Entity / Feature / View

Test Strategy

Storybook

Convention

Security Policy
```

이 내용은 각각의 전문 문서를 참조합니다.

예:

```txt
Domain
  → docs/08_도메인_레이어.md

Server Action
  → docs/09_Server_Actions.md

App Structure
  → docs/10_앱_구조.md

Testing
  → docs/12_테스트_전략.md

Convention
  → docs/18_컨벤션.md
```

---

## 4. 개인 작업 지침

개인적인 Claude Code 작업 지침이 필요하다면:

```bash
cp CLAUDE.local.example.md CLAUDE.local.md
```

를 사용합니다.

`CLAUDE.local.md`에는 다음과 같은 개인적인 작업 선호를 둘 수 있습니다.

```txt
주로 개발하는 App

Local Port

선호하는 Test 명령

작업 설명 방식

개인적인 개발 순서
```

프로젝트 전체가 공유해야 하는 Architecture나 Convention을 `CLAUDE.local.md`에서 재정의하지 않습니다.

다음과 같은 Secret도 저장하지 않습니다.

```txt
Password
Token
API Key
Database Credential
OAuth Secret
Private Environment Variable
```

프로젝트 전체의 규칙이라면 적절한 `docs/*`를 수정합니다.

---

## 5. `.claude/settings.json`

`.claude/settings.json`은 Repository에 Commit되는 프로젝트 공통 Claude Code 설정입니다.

현재 다음 책임을 가집니다.

```txt
Settings Schema

Auto Memory 설정

File Read / Edit 권한

Shell Command 권한

위험 작업 제한
```

이 Repository에서는 프로젝트 Architecture나 Convention이 Claude의 별도 Memory와 `docs/*`에서 독립적으로 발전하는 것을 방지하기 위해 Auto Memory를 기본적으로 비활성화합니다.

프로젝트 지식은 다음 위치에서 명시적으로 관리합니다.

```txt
CLAUDE.md
docs/*
.claude/agents/*
.claude/skills/*
```

---

## 6. Permission 정책

Claude Code Permission은 크게 다음으로 구분합니다.

```txt
allow
  별도 확인 없이 허용

ask
  실행 전에 사용자 확인

deny
  실행 금지
```

기본 방향은 **일상적인 구현과 검증은 허용하고, Secret이나 Repository 상태에 큰 영향을 주는 작업은 제한하는 것**입니다.

대표적인 `allow` 대상:

```txt
Repository Source 읽기

apps/*
packages/*
tooling/*
docs/*
README.md 수정

정적 검증

Test

git status
git diff
```

대표적인 `ask` 대상:

```txt
Dependency 설치 / 제거

Database Push / Migration / Seed

git commit
```

대표적인 `deny` 대상:

```txt
실제 Environment Secret 파일 읽기

secrets/ 접근

pnpm-lock.yaml 직접 수정

기존 Prisma Migration 직접 수정

rm -rf

git push

git reset --hard

git clean

Package Publish
```

실제 Environment 파일은 제한하지만 구조 확인을 위한 Example 파일은 읽을 수 있도록 유지합니다.

```txt
.env.example
.env.test.example
.env.e2e.example
```

Permission의 실제 Source of Truth는 `.claude/settings.json`입니다.

---

## 7. Local Settings

개인 Machine이나 Repository 환경에만 필요한 Claude Code 설정은:

```txt
.claude/settings.local.json
```

에 둘 수 있습니다.

Template:

```txt
.claude/settings.local.example.json
```

필요하다면:

```bash
cp .claude/settings.local.example.json .claude/settings.local.json
```

을 사용합니다.

구분:

```txt
.claude/settings.json
  Repository 공통 정책

.claude/settings.local.json
  현재 개발자의 Local 설정
```

Local 설정을 프로젝트 공통 보안 정책을 우회하는 용도로 사용하지 않습니다.

---

## 8. Agent와 Skill

Agent와 Skill은 서로 다른 역할을 가집니다.

```txt
Agent
  특정 역할에 특화된 작업 Context

Skill
  특정 종류의 작업을 수행하는 재사용 Workflow
```

예:

```txt
code-reviewer
  코드 리뷰 역할의 Agent

review-code
  코드 리뷰 시 따르는 Workflow
```

Agent는 필요한 Skill을 preload할 수 있습니다.

현재 기본 관계:

```txt
architect
  Architecture 판단

code-reviewer
  ↓
review-code

docs-maintainer
  ↓
update-docs

test-writer
  ↓
write-tests

Main Claude
  ↓
implement-feature
```

모든 작업을 Agent로 분리할 필요는 없습니다.

전문적인 역할이나 별도의 작업 Context가 유용할 때 Agent를 사용합니다.

---

## 9. 제공되는 Agent

### `architect`

```txt
.claude/agents/architect.md
```

Architecture와 구조적 변경을 검토합니다.

주요 대상:

```txt
App Boundary

Domain Boundary

Workspace Package

Dependency Direction

Package 승격

구조적 Refactoring
```

예:

```txt
새 Workspace Package가 필요한가?

기존 App을 분리해야 하는가?

이 책임은 Domain에 있어야 하는가?

현재 Dependency 방향이 적절한가?
```

일반적인 작은 기능 구현보다 구조적 판단이 필요한 작업에 사용합니다.

---

### `code-reviewer`

```txt
.claude/agents/code-reviewer.md
```

현재 변경사항을 검토합니다.

주요 대상:

```txt
Correctness

Architecture Boundary

Server / Client Boundary

Security

Convention

Test

Documentation 영향
```

`review-code` Skill을 preload합니다.

---

### `docs-maintainer`

```txt
.claude/agents/docs-maintainer.md
```

프로젝트 문서를 실제 구현과 일치하도록 유지합니다.

주요 대상:

```txt
docs/*

README

Architecture 변경

Command / Tooling 변경

오래된 문서 내용

Cross-reference
```

`update-docs` Skill을 preload합니다.

---

### `test-writer`

```txt
.claude/agents/test-writer.md
```

변경된 Behavior에 필요한 Test를 작성하거나 수정합니다.

대상:

```txt
Unit

Component

Integration

E2E
```

`write-tests` Skill을 preload하고 Test Level 선택 기준은 `12_테스트_전략.md`를 따릅니다.

---

## 10. 제공되는 Skill

### `implement-feature`

```txt
.claude/skills/implement-feature/SKILL.md
```

새 기능을 구현하거나 기존 기능을 확장하는 기본 Workflow입니다.

주요 흐름:

```txt
요구사항 확인
  ↓
현재 구현 확인
  ↓
필요한 책임과 계층 판단
  ↓
필요하면 Generator 사용
  ↓
구현
  ↓
Test / Story
  ↓
문서 영향 확인
  ↓
검증
```

모든 Feature에서 Database, Domain, Server Action, Entity, Feature, View를 기계적으로 모두 만들지 않습니다.

실제 구현 순서는 `16_개발_워크플로우.md`를 따릅니다.

---

### `review-code`

```txt
.claude/skills/review-code/SKILL.md
```

현재 변경사항을 Repository 기준으로 검토하는 Workflow입니다.

다음 영역을 중심으로 확인합니다.

```txt
Correctness

Responsibility Placement

Dependency Boundary

Server / Client Boundary

Security

Convention

Test

Documentation
```

`code-reviewer` Agent가 사용합니다.

---

### `update-docs`

```txt
.claude/skills/update-docs/SKILL.md
```

코드나 정책 변경에 따라 관련 문서를 갱신하는 Workflow입니다.

기본 방향:

```txt
실제 구현 확인

책임을 소유한 문서 확인

해당 문서 수정

오래된 Reference 확인

관련 없는 문서는 수정하지 않음
```

`docs-maintainer` Agent가 사용합니다.

---

### `write-tests`

```txt
.claude/skills/write-tests/SKILL.md
```

변경된 Behavior에 필요한 Test를 선택하고 작성하는 Workflow입니다.

다음 Test Level 중 실제 Behavior에 맞는 수준을 선택합니다.

```txt
Unit
Component
Integration
E2E
```

`test-writer` Agent가 사용합니다.

---

## 11. 권장 사용 흐름

일반적인 Feature 구현:

```txt
Requirement
  ↓
implement-feature
  ↓
Implementation
  ↓
Targeted Test
  ↓
필요하면 code-reviewer
  ↓
필요하면 docs-maintainer
  ↓
Final Validation
```

Architecture 변경:

```txt
Requirement
  ↓
architect
  ↓
Implementation
  ↓
code-reviewer
  ↓
docs-maintainer
```

Test 작업:

```txt
현재 Behavior 확인
  ↓
test-writer
  ↓
관련 Test 실행
```

문서 작업:

```txt
현재 구현 확인
  ↓
docs-maintainer
  ↓
관련 문서 갱신
```

모든 Agent와 Skill을 항상 순서대로 실행하는 것이 아니라 현재 작업에 필요한 것만 사용합니다.

---

## 12. 프로젝트 문서와 Claude Code의 관계

Claude Code 관련 파일은 프로젝트 Architecture를 복제하지 않습니다.

정상적인 관계:

```txt
CLAUDE.md
  "Domain 규칙은 Domain 문서를 따른다."
  ↓
docs/08_도메인_레이어.md
  실제 Domain 정책
```

지양:

```txt
CLAUDE.md
  Domain 정책 A

docs/08_도메인_레이어.md
  Domain 정책 B
```

같은 규칙을 두 곳에서 독립적으로 유지하지 않습니다.

Agent나 Skill에서도 동일합니다.

```txt
Agent
  역할과 작업 방식

Skill
  Workflow

docs/*
  프로젝트 Architecture와 정책
```

구현과 문서가 다르다면 임의로 새로운 규칙을 만들지 않고 현재 Task의 의도를 확인하여 다시 일치시킵니다.

---

## 13. Claude Code 설정을 변경할 때

Claude Code 관련 파일을 수정할 때는 각 책임을 구분합니다.

```txt
프로젝트 Architecture / Convention 변경
  → docs/*

Claude Code의 프로젝트 공통 진입 지침
  → CLAUDE.md

개인 작업 선호
  → CLAUDE.local.md

공유 Permission / Claude 설정
  → .claude/settings.json

개인 Permission / Claude 설정
  → .claude/settings.local.json

전문 역할 추가 / 변경
  → .claude/agents/*

반복 Workflow 추가 / 변경
  → .claude/skills/*
```

새 Agent는 반복적으로 필요한 전문 역할과 독립적인 작업 Context가 있을 때 추가합니다.

새 Skill은 반복되는 명확한 Workflow가 있을 때 추가합니다.

다음과 같은 이유만으로 Agent나 Skill을 추가하지 않습니다.

```txt
Architecture 계층이 하나 존재한다.

명령 하나를 저장하고 싶다.

기존 Agent와 거의 같은 역할이다.

기존 Skill에서 자연스럽게 처리할 수 있다.
```

현재 제공되는 Agent와 Skill로 해결할 수 있는지 먼저 확인합니다.

---

## 14. 관련 문서

Claude Code는 현재 작업 종류에 따라 필요한 전문 문서를 선택해서 사용합니다.

우선 문서 탐색 기준:

```txt
00_문서_가이드.md
```

주요 Source of Truth:

```txt
01_아키텍처.md
  전체 Architecture

05_의존성_경계.md
  Dependency Boundary

07_데이터베이스.md
  Database / Repository

08_도메인_레이어.md
  Domain

09_Server_Actions.md
  Server Action

10_앱_구조.md
  Entity / Feature / View

12_테스트_전략.md
  Test

14_코드_생성기.md
  Generator

16_개발_워크플로우.md
  일상 개발 절차

17_보안_및_운영_기본정책.md
  Security / Operations

18_컨벤션.md
  Naming / Import / Export / Commit

19_확장_가이드.md
  App / Domain / Package 확장
```

모든 문서를 항상 읽는 것이 아니라 현재 작업에 필요한 문서만 선택합니다.

---

## 15. 핵심 원칙

```txt
docs/*를 프로젝트 Architecture와 정책의 Source of Truth로 사용한다.

CLAUDE.md는 Claude Code의 프로젝트 진입점으로 사용한다.

CLAUDE.local.md는 개인 작업 지침에 사용한다.

.claude/settings.json은 공유 Claude Code 설정과 Permission을 관리한다.

.claude/settings.local.json은 개인 Local 설정에 사용한다.

실제 Secret 파일은 Claude Code의 접근 대상에서 제외한다.

위험하거나 외부 상태를 변경하는 작업은 Permission으로 제한한다.

Agent는 특정 역할에 특화된 작업 Context로 사용한다.

Skill은 반복 가능한 작업 Workflow로 사용한다.

Agent와 Skill에서 프로젝트 Architecture를 다시 정의하지 않는다.

필요한 Agent와 Skill만 사용한다.

현재 제공되는 Agent와 Skill로 해결할 수 있다면 새로 추가하지 않는다.

Claude Code 관련 파일과 docs/*에서 동일한 정책을 이중으로 유지하지 않는다.

실행하지 않은 검증을 성공했다고 보고하지 않는다.
```
