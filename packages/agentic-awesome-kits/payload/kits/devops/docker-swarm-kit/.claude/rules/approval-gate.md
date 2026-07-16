# Approval Gate — Docker Swarm Kit

> The AI MUST ask permission before creating/editing a file. No skill ever runs `docker stack deploy`, `docker service update`, or `docker secret create` on a real Swarm.

## 3 Levels

| Level | When | User responds |
|-------|------|----------------|
| **L1 Plan** | Before any Write/Edit | Y = proceed, n = cancel, edit = revise the plan |
| **L2 Diff** | When editing an existing file | Y = apply, n = keep as-is |
| **L3 Iterate** | Output that needs review (update_config parallelism/delay, placement constraints) | Approve / Revise: ... / Cancel |

## L1 — Plan Preview

Before creating a file, the skill prints:

```
[/stack] Will create:
  1. docker-stack.yml       — 3 services, overlay network, rolling update policy
  2. .env.example            — placeholders for secret values (not the real secrets)

Apply? (Y/n):
```

## Rules

- L1 is mandatory even for a single file.
- The AI **NEVER runs** `docker stack deploy`, `docker service update/scale`, or `docker secret/config create` against a real Swarm cluster — it only generates files/commands; DevOps runs them after review.
- Never skip approval because "the file is small" or "the user already confirmed in another skill."
- L2 runs AFTER L1 (L1 lists files, L2 shows a diff per file once the user says Y).
- L3 runs BEFORE L1 (render preview → user approves → L1 plan write).
- A stack touching a `deploy.replicas` change or a secret rotation on a production stack must always restate the blast radius (which services restart, whether it's zero-downtime) before the user confirms Y.
