# ELK Architecture Sketch

```text
App / Node / LB
    → shipper (Filebeat / Elastic Agent / docker logs)
    → Logstash or Agent ingest (parse, enrich)
    → Elasticsearch (indices / data streams + ILM)
    → Kibana (Discover, Dashboard, Alerting)
```

## Health signals

- Cluster green/yellow/red, unassigned shards
- Ingest lag (`@timestamp` vs receive time)
- Disk watermarks
- Pipeline failures

Use `/elk-health` for the checklist.

## ELK vs Grafana+Loki

- ELK: heavy full-text, enterprise search/SIEM-style workflows
- Grafana+Loki: cheaper logs glued to Prom dashboards
- Can run both (metrics Prom + logs ELK) without forcing a single choice
