---
name: zabbix-host
description: Design a Zabbix host — groups, interfaces, templates, macros, proxy, tags. Spec only, no UI apply.
user-invocable: true
argument-hint: "<hostname> [--env prod|stg] [--templates ...] [--proxy name]"
---

# /zabbix-host

## Examples

```
/zabbix-host prod-sql-01 --env prod --templates "Template OS Linux,Template App MSSQL"
/zabbix-host prod-edge-02 --proxy zbx-proxy-dn
```

## Process

1. Inventory: hostname, IP/DNS, OS, role, agent type, SNMP?
2. Draft groups, interfaces, linked templates, macros (secret names only), tags, proxy
3. L1 → write `docs/ops/zabbix/hosts/{host}.md`

## Output

`@_templates/host-spec.md`

## References

- @.claude/rules/naming-conventions.md
- @.claude/rules/approval-gate.md
