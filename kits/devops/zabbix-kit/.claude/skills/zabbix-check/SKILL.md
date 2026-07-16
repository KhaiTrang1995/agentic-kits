---
name: zabbix-check
description: Read-only Zabbix problem / metric / log-item investigation checklist. No ack/disable in prod.
user-invocable: true
argument-hint: "<problem or host> [--log] [--since 1h] [@export-or-paste]"
---

# /zabbix-check

## Examples

```
/zabbix-check "prod-sql-01: Disk free critically low"
/zabbix-check prod-app-03 --log --since 2h
```

## Process

1. Scope: host, trigger, severity, impact (TBD if unknown)
2. Diagnosis: expression/last values from **user paste only**, item state, agent/proxy, maintenance, related problems, log regex/rate if `--log`
3. Hypothesis, READ-ONLY next steps, MUTATIVE options for humans
4. Optional L1 → `docs/ops/zabbix/checks/ZBX-CHECK-{date}-{slug}.md`

## Output

`@_templates/problem-check.md`

## Rules

- Never invent metrics; never mass-ack/disable
- Deep logs → `elk-kit` `/log-check` or `grafana-kit` `/loki-query`
