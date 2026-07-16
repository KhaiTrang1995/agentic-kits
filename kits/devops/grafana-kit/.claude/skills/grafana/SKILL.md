---
name: grafana
description: Hub Q&A for Grafana/Prometheus/Loki — route dashboard, alert, loki-query, explore. Evidence-only.
user-invocable: true
argument-hint: "[question] | dashboard|alert|log|explore ..."
---

# /grafana — Hub

## Route

| Need | Skill |
|------|--------|
| Dashboard panels | `/grafana-dashboard` |
| Alert rules | `/grafana-alert` |
| LogQL log check | `/loki-query` |
| Metric + log correlate | `/grafana-explore` |
| ELK / KQL | `elk-kit` `/log-check` |
| K8s PrometheusRules YAML | `k8s-kit` `/monitor` |

## References

- @.claude/rules/grafana-conventions.md
- `GRAFANA-BRAIN.md`
