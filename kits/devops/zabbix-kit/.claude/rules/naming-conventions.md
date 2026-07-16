# Naming Conventions — Zabbix Kit

| Object | Format | Example |
|--------|--------|---------|
| Host | `{env}-{role}-{nn}` or FQDN | `prod-sql-01` |
| Host group | `{env}` or org path | `prod / database` |
| Template | `Template {OS\|App\|Net} {Name}` | `Template App Booking API` |
| Trigger | `{Service}: {symptom}` | `SQL: Disk free < {$DISK.PCT.CRIT}%` |
| Problem check | `ZBX-CHECK-YYYYMMDD-{slug}` | `ZBX-CHECK-20260715-sql-disk` |
| Macro | `{$NAME}` | `{$DISK.PCT.WARN}` |

## Output paths

| Artifact | Path |
|----------|------|
| Host spec | `docs/ops/zabbix/hosts/{host}.md` |
| Template | `docs/ops/zabbix/templates/{slug}.md` |
| Triggers | `docs/ops/zabbix/triggers/{service}.md` |
| Check | `docs/ops/zabbix/checks/{id}.md` |
