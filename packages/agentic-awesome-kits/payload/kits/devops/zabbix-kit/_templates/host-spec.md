---
type: zabbix-host
host: {{hostname}}
env: {{prod|stg|dev}}
service: {{service}}
status: draft
owner: "{{name}}"
updated: {{date}}
---

# Zabbix Host: {{hostname}}

## Summary

| Field | Value |
|-------|-------|
| Visible name | {{...}} |
| Groups | {{...}} |
| Proxy | {{none \| proxy-name}} |
| Status | enabled (planned) |

## Interfaces

| Type | IP/DNS | Port | Default |
|------|--------|------|---------|
| Agent | {{}} | 10050 | yes |

## Templates

- [ ] {{Template OS ...}}
- [ ] {{Template App ...}}

## Macros

| Macro | Value (non-secret) | Note |
|-------|-------------------|------|
| `{$DISK.PCT.WARN}` | 15 | |
| `{$SNMP.COMMUNITY}` | *(vault)* | never plaintext |

## Tags

`env={{}}` `service={{}}` `team={{}}`

## Open questions

- [ ] {{}}
