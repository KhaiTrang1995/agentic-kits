# Approval Gate — Grafana Kit

> Ask before Write/Edit. Do not call Grafana HTTP APIs, silence live alerts, or delete shared dashboards.

## Levels

| Level | When |
|-------|------|
| L1 Plan | Before create |
| L2 Diff | Edit existing |
| L3 Iterate | Large packs |

## L1 example

```
[/grafana-alert] Will create docs/ops/grafana/alerts/booking-api-error-rate.md:
- PromQL error ratio > 1% for 5m
- severity=critical

Apply? (Y/n):
```

`/grafana` chat Q&A without files → no L1.
