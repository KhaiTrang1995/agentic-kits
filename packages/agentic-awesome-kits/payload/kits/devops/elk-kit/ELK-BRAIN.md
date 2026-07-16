# ELK Brain — Index

Guidance for ELK operations and log investigation. **Evidence-only** — never invent hit counts or stack traces.

## Philosophy

1. Logs are evidence — tie conclusions to query + time range + samples
2. Read-only by default; delete/reindex are MUTATIVE
3. Schema & ILM before pretty dashboards
4. Redact PII/secrets in every report
5. Control noise (health-check spam)
6. Cross-stack: host metrics → Zabbix/Grafana; process → your incident kit

## Skill map

```text
/elk
  ├─ /log-check        ★ primary log investigation
  ├─ /es-query
  ├─ /logstash
  ├─ /kibana-dashboard
  └─ /elk-health
```

| Need | Other kit |
|------|-----------|
| LogQL / Grafana Explore | `grafana-kit` |
| Zabbix log item only | `zabbix-kit` `/zabbix-check` |

## Definition of done for `/log-check`

1. Time window + service/env  
2. Query used (KQL/DSL)  
3. Findings + redacted samples  
4. Hypothesis + next steps  
5. Escalate or close false positive  

## Anti-patterns

- `*` across all indices for 90 days with no filter
- Invented “12,453 errors”
- Over-greedy grok → field explosion
- Using `_delete_by_query` as “alert cleanup”
- API keys committed in pipeline conf

## Knowledge map

| Layer | File |
|-------|------|
| Conventions | `.claude/rules/elk-conventions.md` |
| KQL cheat | `references/kql-cheat.md` |
| Patterns | `references/log-patterns.md` |
| Architecture | `references/elk-architecture.md` |
