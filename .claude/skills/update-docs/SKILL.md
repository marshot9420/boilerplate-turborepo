---
name: update-docs
description: Update project documentation when architecture, structure, tooling, commands, workflows, conventions, testing, security policy, or Claude Code configuration changes.
---

# Update Docs

Use this skill when project documentation must be updated.

Do not duplicate the same policy across multiple documents.

## Start With the Documentation Guide

Read:

```txt
docs/00_문서_가이드.md
```

Determine which document owns the changed responsibility.

## Documentation Responsibilities

```txt
README.md
  Repository entry point and short overview

docs/*
  Project-wide architecture, policies, workflows, and guides

Package README
  Package-specific responsibility and usage

CLAUDE.md
  Claude Code entry point for the repository

CLAUDE.local.md
  Personal local Claude Code instructions

.claude/agents/*
  Agent-specific behavior

.claude/skills/*
  Reusable Claude Code workflows
```

## Workflow

1. Inspect the actual implementation first.
2. Identify the document that owns the affected responsibility.
3. Update the existing document when possible.
4. Search for outdated references affected by the change.
5. Update directly affected cross-references.
6. Keep unrelated documents unchanged.

## Accuracy

Document what currently exists.

Do not describe planned, hypothetical, or future functionality as implemented.

When documentation and implementation disagree:

1. Identify the mismatch.
2. Determine which side the current task intends to change.
3. Do not silently invent a third rule.

## Avoid Duplication

Do not repeat detailed architecture or conventions in:

```txt
README.md

CLAUDE.md

.claude/agents/*

.claude/skills/*
```

Reference the owning document instead.

## Keep Examples Current

Verify examples against the current repository.

Check:

```txt
Package names

App names

File paths

Commands

Generator options

Environment variable names

Public exports

Test locations
```

Remove obsolete names and commands when encountered.

## Scope

Do not rewrite unrelated documentation merely for stylistic consistency.

Keep documentation changes aligned with the actual code or policy change.
