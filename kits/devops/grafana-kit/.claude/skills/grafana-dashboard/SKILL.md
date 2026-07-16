---
name: grafana-dashboard
description: Spec a Grafana dashboard — rows, panels, PromQL/LogQL, variables, on-call layout. No API provision.
user-invocable: true
argument-hint: "<service> [--oncall] [--env prod] [--logs]"
---

# /grafana-dashboard

## Examples

```
/grafana-dashboard booking-api --oncall --logs
```

## Process

1. Audience (on-call vs capacity)  
2. Variables + datasources  
3. Panels + sample queries  
4. Runbook / Explore links  
5. L1 → `docs/ops/grafana/dashboards/{slug}.md`

## Output

`@_templates/dashboard-spec.md`
