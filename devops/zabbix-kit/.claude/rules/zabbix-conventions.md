# Zabbix Conventions

## Template-first

- Production hosts link **templates** (OS + role); ad-hoc items only for short POCs.
- Template names: `Template OS Linux`, `Template App {Service}`.
- Thresholds as macros (`{$DISK.WARN}`) not magic numbers in every trigger.

## Trigger hygiene

| Rule | Detail |
|------|--------|
| Hysteresis | Recovery expression or min duration to avoid flapping |
| Dependencies | Host unreachable suppresses disk/CPU spam |
| Severity | See `references/zabbix-severity.md` |
| Description | Operational text + runbook link placeholder |

## Items

- Sensible intervals; short history for high-churn series.
- Preprocessing documented (JSONPath, regex, multiplier).
- Tags: `env`, `service`, `team` on important hosts.

## Log monitoring

- Prefer regex + severity on log items; do not ingest entire files blindly.
- Deep search / multi-host full-text → **elk-kit** `/log-check` or **grafana-kit** `/loki-query`.

## Secrets & evidence

- No real passwords, SNMP communities, or API tokens in markdown.
- Do not invent last values; use `TBD` + ask when data is missing.

## Agent does not mutate prod

- Document mutative steps as **[MUTATIVE]** for humans.
- Never mass-ack or disable hosts/triggers on behalf of the user.
