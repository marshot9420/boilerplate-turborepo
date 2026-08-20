---
name: review-code
description: Review changed code for correctness, architecture boundaries, conventions, security, tests, and documentation impact.
---

# Review Code

Use this skill to review the current changes.

Do not redefine project rules in this skill.

Use the repository documentation and nearby implementation patterns as the source of truth.

## References

Read only the documents relevant to the changed responsibilities.

```txt
Architecture
  docs/01_아키텍처.md

Dependency Boundaries
  docs/05_의존성_경계.md

Database
  docs/07_데이터베이스.md

Domain Layer
  docs/08_도메인_레이어.md

Server Actions
  docs/09_Server_Actions.md

App Structure
  docs/10_앱_구조.md

Testing
  docs/12_테스트_전략.md

Security and Operations
  docs/17_보안_및_운영_기본정책.md

Conventions
  docs/18_컨벤션.md

Extension Guide
  docs/19_확장_가이드.md
```

## Review Process

1. Inspect the current diff.
2. Inspect the affected surrounding code.
3. Identify the responsibilities changed by the diff.
4. Read the relevant documentation.
5. Report concrete problems only.

## Correctness

Check:

```txt
Does the implementation satisfy the requested behavior?

Are nullable and optional states handled safely?

Are state transitions valid?

Are error paths handled?

Are edge cases relevant to the use case covered?
```

## Architecture

Check:

```txt
Is each responsibility placed in the correct layer?

Does the change preserve dependency direction?

Does app code avoid direct Prisma access?

Is business logic kept out of React components?

Is business logic kept out of Server Actions?

Is the Server / Client boundary correct?
```

## Database and Domain

Check:

```txt
Are repositories focused on persistence?

Are Domain Services responsible for use-case orchestration?

Are Permission and Rule responsibilities placed correctly?

Are response transformations handled by mappers when appropriate?

Is real persistence behavior covered by Integration Tests when needed?
```

## Server Actions

Check:

```txt
Is authentication performed when required?

Is external input validated?

Does the action delegate business decisions to the Domain Layer?

Does it avoid duplicating Domain rules?

Are cache invalidation and navigation handled in the correct place?
```

## App UI

Check:

```txt
Is domain representation placed in Entity?

Is user interaction placed in Feature?

Is page composition placed in View?

Are Client Components introduced only when client behavior is actually required?
```

## Security

Check relevant changes against `docs/17_보안_및_운영_기본정책.md`.

Look for:

```txt
Secret exposure

Missing authorization

Unvalidated external input

Sensitive logging

Unsafe client-provided identity or permission values

Missing ownership checks

Unsafe file or external API handling
```

## Conventions

Check:

```txt
Naming

Import / Export style

Barrel boundaries

Test filenames

Story filenames

Layer-specific function naming
```

Do not report stylistic preferences that are not supported by the repository conventions.

## Tests

Check whether the changed behavior is covered at the appropriate test level.

Do not require:

```txt
an E2E test for every feature

a Story for every component

an Integration Test when no real boundary behavior is involved
```

Require tests only when the behavior and repository strategy justify them.

## Documentation

Check whether the change affects:

```txt
Architecture

Package responsibilities

Commands

Environment variables

Database behavior

Generators

Workflow

Security policy

Conventions
```

If so, identify the document that should be updated.

## Avoid False Positives

Do not request:

```txt
a new helper only to shorten a function

a new package only to remove local duplication

a DTO when no meaningful external contract exists

a new abstraction for hypothetical reuse

a Story or test merely for structural symmetry
```

## Output

Return:

1. Critical issues
2. Important issues
3. Optional improvements
4. Validation to run

If no meaningful issue is found, state that explicitly.
