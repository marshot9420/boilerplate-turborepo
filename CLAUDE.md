# CLAUDE.md

## Project

This repository is a Turborepo boilerplate using:

- Next.js App Router
- TypeScript
- pnpm workspace
- Turborepo
- Prisma
- Vitest
- Playwright
- Storybook
- Server Actions
- DDD-style backend layering
- Relaxed FSD for apps

Read these documents before making architectural changes:

- @docs/01\_아키텍처.md
- @docs/02\_기본설정.md

## Package Roles

- `apps/web`: user-facing service app
- `apps/admin`: admin app
- `packages/core`: pure shared primitives such as Result, AppError, validation, zod-helper, logger, pagination, normalizer, list data query type
- `packages/domain`: domain schemas, DTOs, services, mappers, permissions, errors
- `packages/database`: Prisma, repositories, transactions, database error mapping
- `packages/auth`: OAuth, session, auth guards
- `packages/design-system`: primitives, app UI wrappers, form helpers, toast helpers
- `packages/env`: environment variable validation
- `tooling/generators`: project generators
- `tooling/scripts`: setup, seed, clean, scripts

## Dependency Direction

Allowed direction:

```txt
apps/* -> domain -> database -> core
apps/* -> auth
apps/* -> design-system
apps/* -> env
domain -> core
database -> core
auth -> core/database/domain
design-system -> core
```

Never introduce these directions:

```txt
core -> domain
core -> database
core -> auth
database -> domain
design-system -> domain
design-system -> database
packages/* -> apps/*
```

## Coding Rules

- Use TypeScript strictly.
- Use pnpm, not npm or yarn.
- Do not introduce new libraries unless clearly necessary.
- Do not access Prisma directly from apps.
- Do not put business logic in React components.
- Do not put business logic in Server Actions.
- Server Actions should parse FormData, check auth, validate input, call service, then revalidate or redirect.
- Domain services should return Result.
- Repositories should only handle database access.
- Repository functions should not return UI/API DTOs.
- DTO mapping belongs in domain mappers.
- Use existing error/result/action patterns before creating new ones.

## File Rules

- Use kebab-case for filenames(use camelCase for custom hooks).
- Use PascalCase for components and types.
- Use camelCase for functions.
- Use uppercase objects for domain constants.
- Prefer one component per file.
- Prefer one Server Action function per file.
- Do not create broad `apps/*/src/actions/index.ts`.
- Domain action exports should be grouped by domain directory only.

## Test Rules

- Add or update tests when changing behavior.
- Use Vitest for unit, integration, and component tests.
- Use Playwright for E2E tests.
- App/component unit tests must explicitly import Vitest globals:

```ts
import { describe, expect, it } from "vitest";
```

- Storybook story type imports should use:

```ts
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";
```

## Design System Rules

- Primitives should not contain app-specific business logic.
- `web` and `admin` wrappers may contain app-specific styling.
- Primitives do not need Storybook stories by default.
- `web` and `admin` wrappers should have stories.
- Do not encode app context into internal component names.
- Component names can stay neutral, such as `Button`, `Card`, `Badge`.

## Commands

Use these commands when relevant:

```bash
pnpm install
pnpm dev
pnpm check
pnpm lint
pnpm check-types
pnpm format:check
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm --filter web test
pnpm --filter admin test
pnpm --filter @repo/domain test
pnpm --filter @repo/database test
pnpm --filter @repo/design-system test
```

## Working Style

Before editing code:

1. Inspect the existing nearby files.
2. Follow the current local convention.
3. Prefer minimal, cohesive changes.
4. Avoid speculative abstraction.
5. Do not extract tiny helpers unless there is clear reuse or separation-of-concerns value.
6. After changes, mention which tests should be run.
