---
type: zabbix-check
id: ZBX-CHECK-{{YYYYMMDD}}-{{slug}}
host: {{host}}
service: {{service}}
severity: {{...}}
status: open|mitigating|closed
updated: {{date}}
---

# Zabbix Check: {{title}}

## Context

| Field | Value |
|-------|-------|
| Problem / trigger | {{...}} |
| Detected at | {{time + TZ}} |
| Env | {{prod}} |
| User impact | {{yes/no/TBD}} |

## Evidence (only real data)

| Signal | Value | Source |
|--------|-------|--------|
| Last value | {{TBD}} | UI / paste |
| Related problems | {{...}} | |

## Diagnosis steps

| # | Check | Type | Result |
|---|-------|------|--------|
| 1 | {{agent / item state}} | READ-ONLY | |

## Log item (if any)

- Path / key: {{}}
- Regex: {{}}
- Samples: {{paste}}
- Rate: {{n}}/min

## Hypothesis & next

- **Hypothesis**: {{...}}
- **READ-ONLY next**: {{...}}
- **MUTATIVE (human)**: {{...}}

## Resolution

- Outcome: {{fixed|false-positive|...}}
- Follow-up: {{template/trigger change}}
