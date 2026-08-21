---
name: update-docs
description: 코드, Architecture, Public API, Generator, 환경변수, 개발 Workflow 등이 변경되어 프로젝트 문서를 실제 구현과 맞춰 갱신해야 할 때 사용합니다. 문서별 Source of Truth를 유지하고 중복 정책을 만들지 않습니다.
---

# Update Docs

현재 구현과 프로젝트 문서를 일치시킵니다.

문서를 코드의 복사본으로 만들지 않습니다.

각 규칙은 가능한 한 하나의 전문 문서에서 소유하도록 합니다.

## 1. 실제 변경 확인

먼저 실제 변경사항을 확인합니다.

가능하면:

```txt
git diff

변경된 Source

변경된 Public API

변경된 Config

변경된 Command

변경된 Generator
```

를 확인합니다.

사용자의 설명만으로 구현 상태를 추측하지 않습니다.

---

## 2. 문서 소유권 결정

어떤 문서가 해당 규칙의 Source of Truth인지 결정합니다.

대표적인 책임:

```txt
01
  전체 Architecture

02
  공통 개발 환경 / Tool 설정

03
  Repository 구조

04
  Package 책임

05
  Dependency Boundary

06
  Environment

07
  Database

08
  Domain

09
  Server Action

10
  App Structure

11
  Design System

12
  Testing

13
  Storybook

14
  Generator

15
  Project Initialization

16
  Development Workflow

17
  Security / Operations

18
  Convention

19
  Expansion

20
  Claude Code

21
  Codex
```

---

## 3. 하나의 규칙을 하나의 문서에서 소유

동일한 세부 규칙을 여러 문서에서 반복해서 정의하지 않습니다.

전문 문서:

```txt
상세 규칙
```

Overview 문서:

```txt
짧은 Summary
+
전문 문서 Link
```

형태를 사용합니다.

---

## 4. 실제 구현 기준

문서는 현재 구현을 설명해야 합니다.

다음과 같은 내용을 현재 기능처럼 작성하지 않습니다.

```txt
아직 구현하지 않은 Package

미래 Generator

계획 중인 Public API

존재하지 않는 Directory

예정된 Dependency
```

미래 계획을 기록해야 한다면 미래 계획임을 명확하게 표시합니다.

---

## 5. 명칭과 경로

실제 Source와 문서의 이름을 일치시킵니다.

확인:

```txt
파일명

Directory

Package Scope

Public Export

Command

Environment Variable

Route

Generator Option
```

오래된 명칭을 그대로 남기지 않습니다.

---

## 6. Cross Reference

문서 파일명이 변경되거나 책임이 이동했다면 관련 Cross Reference를 확인합니다.

예:

```txt
09_서버_액션.md
```

처럼 실제 현재 파일명을 사용합니다.

존재하지 않는 문서로 Link하지 않습니다.

---

## 7. README

다음이 변경되었다면 Root README 영향도 확인합니다.

```txt
Quick Start

필수 명령

Project Structure

Technology Stack

Generator

문서 Index
```

README에는 세부 정책을 복제하지 않고 처음 사용하는 데 필요한 최소 정보를 유지합니다.

---

## 8. AI Tool 문서

Claude Code 또는 Codex 설정이 변경되었다면:

```txt
20_Claude_Code.md

21_Codex.md
```

를 검토합니다.

AI Tool 전용 파일에 프로젝트 Architecture 자체를 다시 정의하지 않습니다.

---

## 9. 문서 Style

기존 문서의 다음 Style을 유지합니다.

```txt
한국어 중심

명확한 책임 설명

필요한 코드 예시

txt Diagram

전문 문서 간 Cross Reference
```

불필요하게 설명을 축약하지 않습니다.

반대로 같은 정책을 반복해서 길게 복제하지 않습니다.

---

## 10. 검증

문서 수정 후 확인:

```txt
파일 경로가 실제 존재하는가?

Command가 실제 존재하는가?

Public API 이름이 실제와 같은가?

환경변수 이름이 실제와 같은가?

Cross Reference가 유효한가?

동일 규칙이 여러 문서에서 충돌하지 않는가?

미래 구조를 현재 구현처럼 설명하지 않았는가?
```

---

## 11. 완료 보고

다음을 간결하게 보고합니다.

```txt
수정한 문서

변경한 기준

정리한 오래된 내용

확인이 필요한 사항
```

실제 Source로 확인하지 못한 내용을 확정적으로 작성하지 않습니다.
