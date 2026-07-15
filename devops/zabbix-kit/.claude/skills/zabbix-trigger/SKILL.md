---
name: zabbix-trigger
description: Design Zabbix triggers — expression, recovery, severity, dependency, action hints. Sample docs only.
user-invocable: true
argument-hint: "<service or symptom> [--sev warning|average|high|disaster]"
---

# /zabbix-trigger

## Examples

```
/zabbix-trigger "Disk free SQL" --sev high
/zabbix-trigger booking-api --sev average
```

## Process

1. Signal, threshold, known false positives
2. Problem + recovery expressions, severity, dependencies, tags, runbook link
3. L1 → `docs/ops/zabbix/triggers/{service}.md`

## Output

`@_templates/trigger-spec.md`

## References

- @references/zabbix-severity.md
- @.claude/rules/zabbix-conventions.md
