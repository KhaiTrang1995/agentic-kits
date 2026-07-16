---
name: grafana-alert
description: Design Grafana alert rules — query, threshold, for, labels, annotations, routing hints.
user-invocable: true
argument-hint: "<service symptom> [--sev critical|warning] [--prom|--loki]"
---

# /grafana-alert

## Examples

```
/grafana-alert booking-api high error rate --sev critical --prom
/grafana-alert booking-api error log burst --loki
```

## Process

1. Signal (metric vs log)  
2. Query + threshold + `for`  
3. Labels / annotations / routing hints (no secret webhooks)  
4. L1 → `docs/ops/grafana/alerts/{slug}.md`

## Output

`@_templates/alert-rule.md`
