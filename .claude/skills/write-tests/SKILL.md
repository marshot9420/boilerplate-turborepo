---
name: write-tests
description: Add or update tests for changed behavior using the repository's documented Unit, Component, Integration, and E2E testing strategy.
---

# Write Tests

Use this skill when adding or updating tests.

Do not define a separate testing strategy here.

Use the project testing documentation as the source of truth.

## References

Read:

```txt
docs/12_테스트_전략.md
docs/18_컨벤션.md
```

When the changed behavior involves concurrency, duplicate requests, transactions, retries, timeouts, stale state, or external side effects, also read:

```txt
docs/22_구현_안전성.md
```

Also inspect:

```txt
the implementation being tested

nearby existing tests

shared test configuration

existing fixtures and setup
```

## Choose the Correct Test Level

```txt
Unit
  Small logic and isolated contracts

Component
  React rendering and interaction

Integration
  Real module or infrastructure boundaries

E2E
  Actual browser and user flows
```

Use the narrowest test level that actually proves the behavior.

## Unit Tests

Use Unit Tests for isolated behavior such as:

```txt
Schema validation

Permission logic

Business rules

Mappers

Pure utilities

Service behavior with mocked boundaries when real infrastructure is not the behavior under test
```

## Component Tests

Use Component Tests for:

```txt
Rendering

User interaction

Client validation

Dialog behavior

Form state

Conditional UI
```

Do not test internal implementation details unless unavoidable.

## Integration Tests

Use Integration Tests when the real boundary matters.

Examples:

```txt
Repository persistence

Database constraints

Transactions

Database error mapping

Infrastructure adapter behavior

Concurrency-sensitive persistence behavior

Idempotency and duplicate-event handling
```

Do not replace the behavior being verified with a mock.

## Implementation Safety Tests

Determine whether concurrency or Idempotency behavior is important to Business Correctness before requiring a test.

When the real Database Constraint, Transaction, Conditional Update, Lock, or duplicate-processing boundary is the behavior being verified, prefer an Integration Test using the actual boundary. Follow `docs/22_구현_안전성.md` for the risks and invariants, and `docs/12_테스트_전략.md` for the Test Level and setup.

## E2E Tests

Use E2E tests for important browser-level user flows.

Do not add E2E coverage merely because a feature exists.

Use it when the browser flow itself is important to verify.

## Server Actions

Test the Server Action boundary.

Typical concerns:

```txt
Authentication

Input parsing

Validation

Domain Service invocation

Result mapping

Cache invalidation

Redirect behavior
```

Do not duplicate Domain Service business-rule tests in the Action test.

## Fixtures

Keep test data close to the test unless genuine reuse exists.

Prefer fixture builders such as:

```txt
buildUserFixture

buildOrderFixture
```

when a builder is useful.

Do not create shared fixture infrastructure for one-off test data.

## Mocking

Mock boundaries, not the behavior being tested.

Use mocks when isolating a unit is the purpose of the test.

Avoid excessive mocking that makes the test unable to verify the real contract.

## Naming

Follow `docs/18_컨벤션.md`.

Typical filenames:

```txt
*.test.ts
*.test.tsx

*.integration.test.ts
*.integration.test.tsx

*.spec.ts
```

## Validation

After changing tests, run the most relevant targeted test first.

Then follow `docs/16_개발_워크플로우.md` for broader validation.

Never report a test as passing unless it was actually executed successfully.
