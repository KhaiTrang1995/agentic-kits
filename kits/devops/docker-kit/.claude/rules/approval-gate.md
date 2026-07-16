# Approval Gate — Docker Kit

> The AI MUST ask permission before creating/editing a file. No skill ever builds an image or runs a container on its own.

## 3 Levels

| Level | When | User responds |
|-------|------|----------------|
| **L1 Plan** | Before any Write/Edit | Y = proceed, n = cancel, edit = revise the plan |
| **L2 Diff** | When editing an existing file | Y = apply, n = keep as-is |
| **L3 Iterate** | Output that needs review (CI pipeline stage, compose network topology) | Approve / Revise: ... / Cancel |

## L1 — Plan Preview

Before creating a file, the skill prints:

```
[/dockerfile] Will create:
  1. Dockerfile              — multi-stage build, non-root user
  2. .dockerignore            — excludes bin/obj/node_modules

Apply? (Y/n):
```

## Rules

- L1 is mandatory even for a single file.
- The AI **NEVER runs** `docker build`, `docker push`, or `docker-compose up` — it only generates files; DevOps runs them after review.
- Never skip approval because "the file is small" or "the user already confirmed in another skill."
- L2 runs AFTER L1 (L1 lists files, L2 shows a diff per file once the user says Y).
- L3 runs BEFORE L1 (render preview → user approves → L1 plan write).
