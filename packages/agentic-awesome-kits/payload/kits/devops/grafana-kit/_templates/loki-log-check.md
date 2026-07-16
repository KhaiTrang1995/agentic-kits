---
type: loki-log-check
id: LOKI-{{YYYYMMDD}}-{{slug}}
service: {{service}}
env: {{prod}}
window: {{1h}}
status: open|closed
updated: {{date}}
---

# Loki Log Check: {{title}}

## Symptom

{{...}}

## Scope

| Field | Value |
|-------|-------|
| Time range | {{from → to}} ({{TZ}}) |
| Labels | service={{}}, env={{}} |

## LogQL

```logql
{{query}}
```

## Evidence

### Samples (redacted)

```
{{lines}}
```

### Patterns

| Pattern | Notes |
|---------|-------|
| | |

## Hypotheses & next

1. {{...}}
2. Next: `/grafana-explore` · `elk-kit` `/log-check` · incident

## Closure

{{outcome}}
