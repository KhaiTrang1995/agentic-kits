# Zabbix Kit

> AI Skill Kit for **Zabbix** — hosts, templates, triggers, and problem/log investigation checklists. Complements `k8s-kit` `/monitor` (Prometheus/Grafana files) and pairs with `elk-kit` / `grafana-kit` for deep log work.

## Skills

| Skill | Description |
|-------|-------------|
| `/zabbix` | Hub Q&A — route to host / template / trigger / check |
| `/zabbix-host` | Host, groups, macros, proxy, tags |
| `/zabbix-template` | Template items, LLD, graphs, macros |
| `/zabbix-trigger` | Expressions, severity, dependency, recovery |
| `/zabbix-check` | Read-only problem / metric / log-item investigation |

## Brain

See **`ZABBIX-BRAIN.md`** for philosophy, healthy checklist, and anti-patterns.

## Rules

- `zabbix-conventions.md` — template-first, trigger hygiene, secrets
- `naming-conventions.md` — IDs and output paths
- `approval-gate.md` — L1/L2/L3; agent never applies Zabbix config to prod

## Templates

| Template | Skill |
|----------|--------|
| `host-spec.md` | `/zabbix-host` |
| `template-spec.md` | `/zabbix-template` |
| `trigger-spec.md` | `/zabbix-trigger` |
| `problem-check.md` | `/zabbix-check` |

## Usage

```bash
cp -r kits/devops/zabbix-kit/.claude/ your-project/.claude/
cp -r kits/devops/zabbix-kit/_templates/ your-project/_templates/

/zabbix-host prod-sql-01 --env prod
/zabbix-trigger "Disk free critically low" --sev high
/zabbix-check "prod-sql-01: Disk free critically low"
```

## Safety

Skills produce **docs and sample expressions only**. The agent does not log into Zabbix UI, run `zabbix_sender`, mass-acknowledge, or disable triggers in production.
