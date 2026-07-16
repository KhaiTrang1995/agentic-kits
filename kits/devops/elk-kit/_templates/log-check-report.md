---
type: log-check
id: LOG-{{YYYYMMDD}}-{{slug}}
service: {{service}}
env: {{prod|stg}}
window: {{1h}}
status: open|closed
updated: {{date}}
---

# Log Check: {{title}}

## 1. Symptom

{{user-facing / alert name}}

## 2. Scope

| Field | Value |
|-------|-------|
| Service | {{}} |
| Env | {{}} |
| Time range | {{from → to}} ({{TZ}}) |
| Data view / index | {{}} |
| Level filter | {{ERROR}} |

## 3. Query

```kql
{{query}}
```

## 4. Evidence

| Metric | Value | Source |
|--------|-------|--------|
| Hits | {{TBD or n}} | {{Kibana}} |

### Top patterns

| # | Pattern | Count | Note |
|---|---------|-------|------|
| 1 | | | |

### Sample lines (redacted)

```
{{ts}} {{level}} {{message}}
```

## 5. Correlate

- Deploy / change: {{}}
- Metrics: {{}}
- Dependencies in log: {{}}

## 6. Hypotheses

1. {{...}}
2. {{...}}

## 7. Next steps

| # | Action | Type |
|---|--------|------|
| 1 | {{}} | READ-ONLY |
| 2 | {{}} | MUTATIVE (human) |

## 8. Closure

{{fixed|false-positive|handed-off}}
