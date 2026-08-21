# CLAUDE.md

## Purpose

This file is the entry point for Claude Code when working in this repository.

Do not treat this file as a second architecture or convention document.

The source of truth for project architecture, conventions, workflows, testing, security, and tooling is under `docs/`.

When this file and a detailed document appear to overlap, follow the detailed document.

If the current implementation and documentation disagree, inspect both and report the mismatch instead of silently inventing a new rule.

## Before Working

Before changing code:

1. Inspect the existing files near the target code.
2. Read `docs/00_문서_가이드.md`.
3. Read the documents relevant to the requested change.
4. Follow existing local patterns unless the task explicitly changes them.
5. Keep the change limited to the responsibility required by the task.

Do not introduce speculative abstractions, packages, layers, helpers, or dependencies for hypothetical future use.

## Documentation Map

Use the following documents according to the task.

```txt
Architecture
  docs/01_아키텍처.md

Project setup and dependency versions
  docs/02_기본설정.md

Repository structure
  docs/03_프로젝트_구조.md

Workspace package responsibilities
  docs/04_패키지_구조.md

Dependency boundaries
  docs/05_의존성_경계.md

Environment variables
  docs/06_환경변수.md

Database / Prisma / Repository
  docs/07_데이터베이스.md

Domain Layer
  docs/08_도메인_레이어.md

Server Actions
  docs/09_서버_액션.md

App structure / Entity / Feature / View
  docs/10_앱_구조.md

Design System
  docs/11_디자인_시스템.md

Testing
  docs/12_테스트_전략.md

Storybook
  docs/13_스토리북.md

Code generators
  docs/14_코드_생성기.md

Project initialization
  docs/15_프로젝트_초기화.md

Development workflow
  docs/16_개발_워크플로우.md

Security and operations
  docs/17_보안_및_운영_기본정책.md

Naming / Import / Export / Commit conventions
  docs/18_컨벤션.md

Project extension
  docs/19_확장_가이드.md

Implementation safety
  docs/22_구현_안전성.md
```

Read only the documents relevant to the current task after checking `docs/00_문서_가이드.md`.

When a change can involve Race Conditions, Read-Modify-Write, Idempotency, Transactions, Retry or Timeout, Partial Failure, or stale state, read `docs/22_구현_안전성.md` before implementing or reviewing it.

## Working Rules

Use `pnpm`.

Do not install or remove dependencies without permission.

Do not manually edit `pnpm-lock.yaml`.

Do not manually edit generated Prisma migration files.

Do not read secret environment files.

Example environment files such as the following may be inspected:

```txt
.env.example
.env.test.example
.env.e2e.example
```

Actual local or deployed environment files must not be read.

Do not run destructive Git commands, push commits, publish packages, or perform database schema mutations without the permissions defined in `.claude/settings.json`.

Do not create a new Workspace Package merely to remove local duplication.

Do not move code to a higher shared scope until the sharing and responsibility justify the promotion.

Prefer colocating code with its actual consumer.

## Implementation Workflow

For feature work, follow `docs/16_개발_워크플로우.md`.

Use the existing generators when they reduce repetitive scaffold work.

```bash
pnpm generate
```

Generator output is a starting point.

Modify generated code for the actual use case and remove files that are not needed.

## Validation

Run validation appropriate to the change.

The standard static validation command is:

```bash
pnpm check
```

The standard test command is:

```bash
pnpm test
```

Add Integration, Build, or E2E validation when required by `docs/12_테스트_전략.md` and `docs/16_개발_워크플로우.md`.

Do not claim a command passed unless it was actually executed successfully.

## Documentation Changes

When architecture, commands, project structure, conventions, generators, security policy, or workflows change, check whether the corresponding document under `docs/` must also change.

Do not duplicate detailed project policy in:

```txt
CLAUDE.md
.claude/agents/*
.claude/skills/*
```

These files should point Claude Code to the relevant project documents instead.
