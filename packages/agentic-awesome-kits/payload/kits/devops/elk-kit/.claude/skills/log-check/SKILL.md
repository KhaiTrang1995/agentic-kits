---
name: log-check
description: Investigate logs in ELK — time window, KQL, error patterns, redacted samples, correlation, report. Primary log-ops skill. Evidence-only.
user-invocable: true
argument-hint: "<service or symptom> [--env prod] [--since 1h] [--level ERROR] [@paste-or-export]"
---

# /log-check — Log Investigation

## Examples

```
/log-check booking-api --env prod --since 1h --level ERROR
/log-check "timeout payment" --since 30m
/log-check booking-api @logs-sample.ndjson
```

## Process

### 1. Frame
Symptom, service, env, window, timezone, data view (or TBD), available paste?

### 2. Query plan (READ-ONLY)

```kql
service.name: "{{service}}" and env: "{{env}}" and log.level: error
```

Refine with symptom keywords. See `@references/kql-cheat.md`.

### 3. Analyze evidence only
Timeline, top patterns (`log-patterns.md`), ≤10 redacted samples, deploy window, correlate metrics/deps.

### 4. Conclude
Findings, ranked hypotheses, READ-ONLY next steps, MUTATIVE human-only options, escalate if user-facing impact.

### 5. Output
Chat summary always; optional L1 save → `docs/ops/elk/log-checks/{id}.md`

## Definition of done

See `ELK-BRAIN.md` — query, evidence, hypothesis, next step.

## Output template

`@_templates/log-check-report.md`

## Rules

- No invented counts/stacks; redact secrets; no delete-index “fixes”
- @.claude/rules/elk-conventions.md
- @.claude/rules/approval-gate.md
