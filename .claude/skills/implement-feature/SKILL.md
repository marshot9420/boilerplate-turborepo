---
name: implement-feature
description: Implement a new feature in apps/web or apps/admin using the repository's relaxed FSD and Server Action conventions.
---

# Implement Feature

Use this skill when implementing a new app feature.

## Steps

1. Inspect the target app structure.
2. Check existing nearby domain/entity/feature/view patterns.
3. Add or update domain schema/dto/service if needed.
4. Add or update database repository only if DB access is needed.
5. Add or update Server Action in `apps/*/src/actions/[domain]/`.
6. Add entity UI for domain display.
7. Add feature UI for user interaction.
8. Compose the page in `views`.
9. Connect route in `app`.
10. Add tests.
11. Add Storybook stories when the changed component is story-worthy.

## Rules

- Do not put Prisma access in apps.
- Do not put business logic in components.
- Do not add broad index files at app action root.
- Keep changes minimal and consistent with local files.
