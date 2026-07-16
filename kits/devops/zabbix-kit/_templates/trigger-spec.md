---
type: zabbix-trigger
service: {{service}}
status: draft
updated: {{date}}
---

# Zabbix Triggers: {{service}}

## Macros

| Macro | Default | Description |
|-------|---------|-------------|
| `{$...}` | | |

## Triggers

### T1 — {{name}}

| Field | Value |
|-------|-------|
| Severity | {{warning\|average\|high\|disaster}} |
| Problem expression | `{{expr}}` |
| Recovery | `{{expr or default}}` |
| Dependencies | {{...}} |
| Tags | service={{}}, env={{}} |
| Description | {{symptom + runbook}} |

**Action hint**: {{media / escalate after N min}}

## False-positive notes

- {{known noise}}
