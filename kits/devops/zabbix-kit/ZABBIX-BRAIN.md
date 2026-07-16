# Zabbix Brain — Index

Long-lived guidance for Zabbix design and problem checks. **Evidence-only** — do not invent last values or problem IDs.

## Philosophy

1. **Signal over noise** — every trigger needs an owner action
2. **Template-first** — avoid one-off host items
3. **Correct severity** — Disaster is rare; map page-worthy alerts carefully
4. **Read-only diagnose first** — `/zabbix-check` before mutative steps
5. **Bounded log items** — regex + severity; deep full-text → `elk-kit` / `grafana-kit`
6. **Compose with other kits** — incident process is out of scope here (use your SRE process)

## Skill map

```text
/zabbix
  ├─ /zabbix-host
  ├─ /zabbix-template
  ├─ /zabbix-trigger
  └─ /zabbix-check
```

## Healthy monitoring checklist

- [ ] Critical hosts use OS + app templates
- [ ] Trigger dependencies suppress noise (e.g. host down)
- [ ] Shared severity map
- [ ] Actions/media tested
- [ ] Maintenance windows used for deploys
- [ ] Open problems link to a check/runbook
- [ ] No plaintext secrets in items/macros docs
- [ ] Log items use tight regex

## Anti-patterns

- CPU > 50% Warning forever, no hysteresis
- Permanently disable triggers instead of fixing thresholds
- Cloning hosts by hand instead of templates/LLD
- Unfiltered log items blowing history
- Invented metrics for a nice report

## Knowledge map

| Layer | File |
|-------|------|
| Conventions | `.claude/rules/zabbix-conventions.md` |
| Approval | `.claude/rules/approval-gate.md` |
| Naming | `.claude/rules/naming-conventions.md` |
| Severity | `references/zabbix-severity.md` |
| Item types | `references/zabbix-item-types.md` |
| Log via Zabbix | `references/log-check-via-zabbix.md` |
