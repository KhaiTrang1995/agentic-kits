---
name: zabbix
description: Hub Q&A for Zabbix — route to host/template/trigger/check. Evidence-only. Trigger `/zabbix <question>`.
user-invocable: true
argument-hint: "[question] | host|template|trigger|check ..."
---

# /zabbix — Hub

## Examples

```
/zabbix
/zabbix active vs passive agent?
/zabbix disk trigger flapping
/zabbix check OOM log on app-01
```

## Route

| Need | Skill |
|------|--------|
| Host, macros, proxy | `/zabbix-host` |
| Template + LLD | `/zabbix-template` |
| Expressions / actions | `/zabbix-trigger` |
| Problem / log diagnosis | `/zabbix-check` |
| Full-text logs | `elk-kit` `/log-check` or `grafana-kit` `/loki-query` |

## References

- @.claude/rules/zabbix-conventions.md
- `ZABBIX-BRAIN.md`
