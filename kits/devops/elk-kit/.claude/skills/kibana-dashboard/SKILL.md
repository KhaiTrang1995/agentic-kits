---
name: kibana-dashboard
description: Spec a Kibana dashboard — panels, KQL filters, on-call layout. No auto NDJSON export to prod.
user-invocable: true
argument-hint: "<service> [--oncall] [--env prod]"
---

# /kibana-dashboard

## Examples

```
/kibana-dashboard booking-api --oncall --env prod
```

## Suggested on-call panels

1. Log volume over time  
2. Error count over time  
3. Top error messages  
4. Top hosts  
5. Table of recent errors  

≤ 8 primary panels; pin `service` + `env` filters.

## Output

`@_templates/kibana-dashboard.md` → `docs/ops/elk/dashboards/{slug}.md`
