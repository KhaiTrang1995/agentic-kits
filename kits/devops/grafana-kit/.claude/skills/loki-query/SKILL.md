---
name: loki-query
description: Check logs with LogQL (Loki/Grafana) — stream selector, filters, redacted samples, rate, investigation report. Evidence-only.
user-invocable: true
argument-hint: "<service or symptom> [--env prod] [--since 1h] [--level ERROR] [@paste]"
---

# /loki-query — Log Check (Loki)

## Examples

```
/loki-query booking-api --env prod --since 1h
/loki-query "timeout" --service booking-api --since 30m
```

## Process

1. Scope labels + window  
2. LogQL plan (`@references/logql-cheat.md`)  
3. Analyze paste only — patterns, ≤10 redacted samples, optional rate query  
4. Hypotheses + next (`/grafana-explore`, `elk-kit` `/log-check`, incident process)  
5. Optional L1 → `docs/ops/grafana/log-checks/LOKI-{date}-{slug}.md`

## Output

`@_templates/loki-log-check.md`

## Rules

- @.claude/rules/grafana-conventions.md
- @.claude/rules/approval-gate.md
