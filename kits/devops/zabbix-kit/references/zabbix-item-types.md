# Zabbix Item Types — Cheat Sheet

| Type | Use when |
|------|----------|
| Zabbix agent | Host has agent (`system.cpu.util`, `vfs.fs.size`) |
| Agent (active) | Server→agent blocked by firewall |
| Simple check | Ping / TCP without agent |
| SNMP agent | Network gear / appliances |
| HTTP agent | API health checks |
| Log / Log (active) | Local log files — regex required |
| Dependent item | Parse one master JSON/log |
| Calculated | Formulas from other items |

Preprocessing: regex, JSONPath, throttle/discard unchanged, multipliers.
