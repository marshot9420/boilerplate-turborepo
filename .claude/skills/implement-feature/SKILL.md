---
name: implement-feature
description: Implement or extend a feature using the repository's documented architecture, conventions, generators, and development workflow.
---

# Implement Feature

Use this skill when implementing a new feature or extending an existing one.

Do not redefine project architecture or conventions in this skill.

Use the project documentation as the source of truth.

## References

Read only the documents relevant to the current task.

```txt
Architecture
  docs/01_아키텍처.md

Database
  docs/07_데이터베이스.md

Domain Layer
  docs/08_도메인_레이어.md

Server Actions
  docs/09_서버_액션.md

App Structure
  docs/10_앱_구조.md

Testing
  docs/12_테스트_전략.md

Code Generators
  docs/14_코드_생성기.md

Development Workflow
  docs/16_개발_워크플로우.md

Security and Operations
  docs/17_보안_및_운영_기본정책.md

Conventions
  docs/18_컨벤션.md

Extension Guide
  docs/19_확장_가이드.md

Implementation Safety
  docs/22_구현_안전성.md
```

## Workflow

1. Read the task requirements.
2. Inspect the target files and nearby implementations.
3. Determine which responsibilities actually need to change.
4. For mutations or runtime state changes, inspect concurrency and failure scenarios before choosing the implementation.
5. Use an existing generator when it reduces repetitive scaffold work.
6. Implement from the lowest affected responsibility toward the application composition layer.
7. Add or update tests for the changed behavior.
8. Add or update Storybook stories when required by the Storybook guide.
9. Check whether project documentation must also be updated.
10. Run validation appropriate to the change.

## Choose Only the Required Layers

Do not create every layer for every feature.

Possible layers include:

```txt
Database
Domain
Server Action
Entity
Feature
View
App Router
```

Use only the layers required by the actual use case.

Examples:

```txt
Display-only domain UI
  → Entity

User interaction
  → Feature

Page-level composition
  → View

Ordinary server-side query
  → Domain Service + Server Component

Mutation
  → Domain Service + Server Action + Feature

New persistence requirement
  → Prisma + Repository + Domain
```

## Implementation Safety

Before implementing a mutation or other runtime state change, determine whether concurrent execution, duplicate delivery, stale state, retry or timeout, external side effects, or partial failure can break Business Correctness.

If any of these risks apply, use `docs/22_구현_안전성.md` to identify the invariant, failure scenarios, required protection, and appropriate validation. Do not copy its detailed policy into this skill.

## Database

Change the database layer only when persistence behavior changes.

Typical flow:

```txt
Prisma Schema
  ↓
Prisma Client Generate
  ↓
Repository
  ↓
Repository Tests
  ↓
Domain Service
```

Follow `docs/07_데이터베이스.md`.

Do not access Prisma directly from apps.

## Domain

Place business rules in the Domain Layer.

Use only the roles required by the use case.

Possible roles:

```txt
constant
schema
dto
error
mapper
permission
rule
service
```

Do not create files merely to make every domain structurally symmetrical.

Follow `docs/08_도메인_레이어.md`.

## Server Actions

Use Server Actions for mutation boundaries when appropriate.

Do not create Server Actions for ordinary server-side queries.

Follow `docs/09_서버_액션.md`.

## App UI

Use app layers according to their documented responsibilities.

```txt
Entity
  Domain representation

Feature
  User action

View
  Page-level composition

App Router
  Route connection
```

Follow `docs/10_앱_구조.md`.

## Generators

Use existing generators when they save repetitive setup work.

```bash
pnpm generate
```

Generated code is a starting point, not final implementation.

```txt
Generate
  ↓
Adapt to the actual use case
  ↓
Remove unused scaffold
```

Follow `docs/14_코드_생성기.md`.

## Tests

Choose the test level based on the behavior being verified.

Follow `docs/12_테스트_전략.md`.

```txt
Unit
Component
Integration
E2E
```

Prefer the narrowest test that proves the behavior.

Use Integration or E2E tests when the real infrastructure or browser boundary itself is part of the behavior.

## Validation

During implementation, run targeted tests first.

After implementation, normally run:

```bash
pnpm check
pnpm test
```

Add broader validation when required:

```bash
pnpm test:integration
pnpm build
pnpm test:e2e
```

Never report that a command passed unless it was actually executed successfully.

## Rules

```txt
Inspect existing code before changing it.

Change only the layers required by the use case.

Do not put business logic in React components.

Do not put business logic in Server Actions.

Do not access Prisma directly from apps.

Do not create Server Actions for ordinary queries.

Do not add speculative abstractions for hypothetical reuse.

Do not promote code to a Workspace Package before real shared responsibility exists.

Do not treat generator output as final implementation.

Follow existing architecture and conventions unless the task explicitly changes them.
```
