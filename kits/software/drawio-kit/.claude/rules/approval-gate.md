# Approval Gate — Diagram Kit

> The AI MUST get user permission before creating or editing files. No skill may write files on its own.

## 3 Levels

| Level | When | User replies |
|-------|------|--------------|
| **L1 Plan** | Before every Write/Edit of a file | Y = proceed, n = cancel, edit = change the plan |
| **L2 Diff** | When editing an existing `.drawio` file | Y = apply, n = keep current |
| **L3 Iterate** | Output needs review (diagram layout, node/edge list before generating XML) | Approve / Edit: … / Cancel |

## L1 — Plan Preview

Before creating a file, the skill prints:

```
[/flowchart] Will create:
  1. docs/diagrams/container/flowchart-search-flow.drawio   — 8 nodes (2 decisions), 9 edges

Apply? (Y/n):
```

## Rules

- L1 is mandatory even when creating only one file.
- Do NOT skip approval because the “file is small” or “user already confirmed in another skill”.
- L2 runs AFTER L1 (L1 lists files; L2 shows the diff when the user answers Y).
- L3 runs BEFORE L1 — list the planned nodes/edges (table or ASCII layout) so the user confirms layout before full XML is generated, avoiding many hard-to-read XML edits later.
