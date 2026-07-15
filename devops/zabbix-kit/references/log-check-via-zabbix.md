# Log checks via Zabbix

## Use Zabbix log items when

- You need an **alert** on a pattern (ERROR, FATAL, OOM)
- Hosts are not shipping to ELK/Loki yet
- Log volume is low–medium

## Prefer ELK / Loki when

- Full-text search across many hosts
- Trace-id correlation, long retention queries  
→ `elk-kit` `/log-check` or `grafana-kit` `/loki-query`

## `/zabbix-check` log checklist

1. Item enabled? Agent active?
2. Path readable by agent user?
3. Regex matches a real sample line?
4. Timeline vs deploy window?
5. Event rate — spam or real signal?
6. Correlate CPU/disk/network on same host
