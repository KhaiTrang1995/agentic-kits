---
type: kibana-dashboard
slug: {{slug}}
service: {{service}}
env: {{prod}}
updated: {{date}}
---

# Kibana Dashboard Spec: {{title}}

## Global filters

```kql
service.name: "{{service}}" and env: "{{env}}"
```

## Default time

Last {{15m|1h|24h}}

## Panels

| # | Title | Type | Query / metric |
|---|-------|------|----------------|
| 1 | Log volume | line | count @timestamp |
| 2 | Errors | line | log.level: error |
| 3 | Top messages | terms | message / error.message |
| 4 | Top hosts | terms | host.name |
| 5 | Recent errors | table | Discover |

## Alert hooks (optional)

| Condition | Channel |
|-----------|---------|
| Error count > {{n}} / 5m | {{}} |
