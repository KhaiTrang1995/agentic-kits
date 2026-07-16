# Approval Gate — ELK Kit

> Ask before Write/Edit. Do **not** call ES APIs, delete indices, or restart production ingest.

## Levels

| Level | When |
|-------|------|
| L1 Plan | Before creating files |
| L2 Diff | Editing existing files |
| L3 Iterate | Large pipelines/dashboards |

## L1 example

```
[/log-check] Will create docs/ops/elk/log-checks/LOG-20260715-booking-5xx.md with:
- 1h window, KQL service + 5xx
- 3 error patterns from user paste

Apply? (Y/n):
```

Chat-only analysis with `skip save` needs no L1.
