---
type: grafana-dashboard
slug: {{slug}}
service: {{service}}
purpose: on-call|capacity|slo
updated: {{date}}
---

# Dashboard: {{title}}

## Meta

| Field | Value |
|-------|-------|
| Folder | {{}} |
| Datasources | {{Prometheus}}, {{Loki}} |
| Default time | {{now-1h}} |
| Refresh | {{30s}} |

## Variables

| Name | Type | Values / query |
|------|------|----------------|
| env | custom/query | prod,stg |
| service | query | {{}} |

## Rows & panels

### Golden signals

| Panel | Type | Query |
|-------|------|-------|
| RPS | timeseries | `{{promql}}` |
| Error % | timeseries | `{{promql}}` |
| p99 | timeseries | `{{promql}}` |

### Saturation

| Panel | Type | Query |
|-------|------|-------|
| CPU | timeseries | |
| Memory | timeseries | |

### Logs (optional)

| Panel | Type | Query |
|-------|------|-------|
| Error logs | logs | `{{logql}}` |

## Links

- Runbook: {{}}
- Explore: {{}}
