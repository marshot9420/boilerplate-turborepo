---
name: write-tests
description: Add or update tests for domain, database, app, or design-system changes.
---

# Write Tests

## Test Type Selection

- `packages/core`: unit tests for pure utilities
- `packages/domain`: schema, mapper, permission, service tests
- `packages/database`: repository and transaction tests
- `packages/design-system`: component behavior tests
- `apps/*`: view, feature, entity, action tests
- `apps/*/e2e`: Playwright specs

## Rules

- Match existing test style.
- Keep fixtures close to tests unless reused.
- Use explicit Vitest imports in app/component tests.
- Do not test implementation details unless unavoidable.
- For Server Actions, mock auth/service/revalidate where appropriate.
