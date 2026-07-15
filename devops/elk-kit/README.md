# ELK Kit

> AI Skill Kit for the **ELK Stack** (Elasticsearch · Logstash · Kibana) with a first-class **`/log-check`** skill for incident log investigation. Complements `grafana-kit` (Loki/LogQL) and `zabbix-kit` (infra triggers).

## Skills

| Skill | Description |
|-------|-------------|
| `/elk` | Hub Q&A — route to log-check, query, pipeline, dashboard, health |
| `/log-check` | **Investigate logs** — window, KQL, patterns, redacted samples, report |
| `/es-query` | KQL / Lucene / Query DSL samples (read-only) |
| `/logstash` | Logstash / ingest pipeline sketch |
| `/kibana-dashboard` | Kibana dashboard panel spec |
| `/elk-health` | Cluster, ILM, ingest-lag checklist |

## Brain

See **`ELK-BRAIN.md`**.

## Rules

- `elk-conventions.md` — index fields, query safety, PII
- `naming-conventions.md`
- `approval-gate.md` — no delete-index / prod API calls

## Templates

| Template | Skill |
|----------|--------|
| `log-check-report.md` | `/log-check` |
| `es-query.md` | `/es-query` |
| `logstash-pipeline.conf` | `/logstash` |
| `kibana-dashboard.md` | `/kibana-dashboard` |
| `elk-health-report.md` | `/elk-health` |

## Usage

```bash
cp -r devops/elk-kit/.claude/ your-project/.claude/
cp -r devops/elk-kit/_templates/ your-project/_templates/

/log-check booking-api --env prod --since 1h --level ERROR
/es-query error timeout booking-api 1h --kql
/elk-health
```

## Typical flow

```
Alert / user report
  → /log-check
  → /es-query (refine)
  → /logstash if fields missing
  → /kibana-dashboard for on-call view
```

## Safety

Agent produces queries and reports only. It does not call Elasticsearch APIs, delete indices, or restart Logstash in production.
