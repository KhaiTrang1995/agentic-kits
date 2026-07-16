# Grafana Brain — Index

Guidance for Grafana dashboards, alerts, and Loki log checks. Evidence-only.

## Philosophy

1. RED/USE before vanity panels  
2. Alerts must be actionable + runbook-linked  
3. Align labels across Prom and Loki (`service`, `env`, `namespace`)  
4. Explore to investigate; dashboards to scan  
5. Bound LogQL with narrow stream selectors  
6. Compose with `elk-kit` / `zabbix-kit` / `k8s-kit` as needed  

## Skill map

```text
/grafana
  ├─ /grafana-dashboard
  ├─ /grafana-alert
  ├─ /loki-query        ★ log check
  └─ /grafana-explore
```

## Healthy checklist

- [ ] Prod datasource RBAC / dedicated SA  
- [ ] Folders by team/service  
- [ ] Variables: env, service, namespace  
- [ ] Alert no-data/error handling intentional  
- [ ] On-call dashboards ≤ 8–12 panels  
- [ ] Critical alerts → runbook  

## Anti-patterns

- Alert on raw 1m CPU with no `for`  
- 50-panel “everything” dashboards  
- LogQL `{job=~".+"}` whole cluster  
- Invented p99 values  
- Permanent silence instead of threshold fix  

## Knowledge map

| Layer | File |
|-------|------|
| Conventions | `.claude/rules/grafana-conventions.md` |
| LogQL | `references/logql-cheat.md` |
| PromQL | `references/promql-basics.md` |
| Panels | `references/panel-design.md` |
