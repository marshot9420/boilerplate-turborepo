# CLAUDE.local.md

Copy `CLAUDE.local.example.md` to `CLAUDE.local.md` when personal project-specific instructions are needed.

Do not commit `CLAUDE.local.md`.

Do not store secrets, credentials, tokens, passwords, or private environment values in this file.

Project architecture and conventions remain defined by `CLAUDE.md` and `docs/*`.

Personal instructions should not redefine project-wide architecture or conventions.

## Local Environment

Preferred development app:

```txt
web:
admin:
```

Local ports:

```txt
web:
admin:
```

Preferred test command:

```txt
pnpm test
```

Other local notes:

```txt

```

## Working Preferences

Example personal preferences:

```txt
Ask before installing or removing dependencies.

Explain the architectural impact before applying large structural refactors.

Prefer running targeted tests during implementation and repository-wide validation after completion.
```

## Local Claude Code Settings

Personal Claude Code permissions and machine-specific settings belong in:

```txt
.claude/settings.local.json
```

Use `.claude/settings.local.example.json` as the starting point when needed.
