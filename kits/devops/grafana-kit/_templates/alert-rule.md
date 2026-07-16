---
type: grafana-alert
slug: {{slug}}
service: {{service}}
severity: critical|warning|info
updated: {{date}}
---

# Alert: {{title}}

## Rule

| Field | Value |
|-------|-------|
| Datasource | {{Prometheus\|Loki}} |
| Query | `{{expr}}` |
| Condition | {{IS ABOVE 0.01}} |
| For | {{5m}} |
| No data | {{OK\|Alerting\|NoData}} |

## Labels

```yaml
severity: {{critical}}
service: {{service}}
env: {{prod}}
team: {{platform}}
```

## Annotations

```yaml
summary: "{{service}} {{symptom}}"
description: "See runbook docs/ops/runbooks/{{slug}}.md"
```

## Routing hints

| Severity | Contact point |
|----------|---------------|
| critical | {{pager}} |
| warning | {{channel}} |
