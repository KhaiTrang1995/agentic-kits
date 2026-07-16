---
name: zabbix-template
description: Design a Zabbix template — items, LLD, triggers, graphs, macros. Markdown spec only.
user-invocable: true
argument-hint: "<template name> [--os linux|windows] [--app name] [--lld]"
---

# /zabbix-template

## Examples

```
/zabbix-template "Template App Booking API" --app booking-api
/zabbix-template "Template OS Linux" --os linux --lld
```

## Process

1. Scope metrics, log alerts, graphs
2. Macros, items, LLD prototypes, triggers, graphs, changelog
3. L1 → `docs/ops/zabbix/templates/{slug}.md`

## Output

`@_templates/template-spec.md`

## References

- @references/zabbix-item-types.md
- @.claude/rules/zabbix-conventions.md
