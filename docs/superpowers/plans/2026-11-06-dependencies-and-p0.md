# Dependency and P0 safety implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Main Codex implements production changes; independent agents assist with compatibility, tests, documentation, and review.

**Goal:** Update all workspace dependencies to compatible stable releases, reject implicit OAuth account linking, and preserve deleted content under concurrent mutations.

**Architecture:** Keep shared versions in the pnpm catalog and Prisma operations in repositories. Domain services decide account linking and state transitions. No new account-linking UI or database schema is required.

**Tech Stack:** Node 24, pnpm 11, Next.js, React, Prisma/PostgreSQL, Vitest, Playwright.

**Spec:** The user's November 6 request in this chat and the P0 findings referenced there.

## Global constraints

- Preserve workspace boundaries and public named exports for changed APIs.
- Exclude prereleases; honor peer dependencies and the Node 24 runtime.
- Regenerate pnpm-lock.yaml only with pnpm; do not edit it manually.
- Do not read or expose real environment secrets, migrate/push/seed an existing database, commit, or push.
- Work in the requested clean checkout; preserve any concurrent user edits.

## Review focus

- Existing provider/user-ID logins still work when the provider email changes.
- Email collisions, including ADMIN accounts, never mutate or link existing users.
- Missing or invalid Kakao email verification flags are rejected.
- A stale status update cannot undo a committed content deletion.
- Dependency upgrades preserve lint, types, tests, builds, and Storybook compatibility.

## Task 1: Dependencies

- [x] Inventory every root/app/package/tooling manifest and registry metadata.
- [x] Update compatible stable versions, related peer contracts, and generated lockfile.
- [x] Run installation peer checks, static checks, tests, and build checks; fix upgrade regressions.

## Task 2: OAuth policy

- [x] Add and run failing domain/provider regression tests.
- [x] Reject email-only linking, require verified Kakao email flags, and preserve existing account login.
- [x] Provide a safe fixed login error with guidance to use the existing login method.
- [x] Verify changed tests and update the auth policy documentation.

## Task 3: Content concurrency

- [x] Add and run failing stale/concurrent mutation regression tests at the real database boundary where available.
- [x] Add a conditional repository mutation and map a failed state precondition into a domain conflict.
- [x] Preserve DELETED as terminal; verify related domain/action behavior and document the changed contract.

## Completion

- [x] Run pnpm check, pnpm test, relevant integration tests, production builds, and Storybook builds.
- [x] Obtain independent code review and address actionable findings.
- [x] Report actual verification results and any remaining environment limitations.

## Verification record

- Strict peer install and offline frozen-lockfile install passed.
- `pnpm check` passed with Storybook build outputs present.
- `pnpm test`: 217 files, 1,646 unit/component tests passed.
- PostgreSQL repository/domain and Web integration tests: 16 passed; used existing test schema and safe temporary configs, without migrations/push/seed.
- `pnpm build`: web and admin production builds passed.
- Design-system, web, and admin Storybook builds passed.
- Independent code/dependency review found no blocking issues.
- Real OAuth-provider login and browser E2E were not run.
