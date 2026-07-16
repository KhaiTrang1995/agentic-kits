# Approval Gate — Zabbix Kit

> The AI MUST ask before Write/Edit. The AI does **not** log into Zabbix, import templates, or mass-acknowledge production problems.

## Levels

| Level | When | User responds |
|-------|------|----------------|
| **L1 Plan** | Before Write/Edit | Y / n / revise |
| **L2 Diff** | Editing existing files | Y / n |
| **L3 Iterate** | Large template/trigger packs | Approve / Revise / Cancel |

## L1 example

```
[/zabbix-trigger] Will create docs/ops/zabbix/triggers/booking-sql.md with:
- 4 triggers (disk, CPU, agent ping, error log regex)
- Macros {$DISK.PCT.WARN}=15, {$DISK.PCT.CRIT}=10

Apply? (Y/n):
```

## Notes

- Pure `/zabbix` Q&A in chat needs no L1.
- Expressions are samples for human import after review.
