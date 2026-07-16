# Naming Conventions — Grafana Kit

| Object | Format | Example |
|--------|--------|---------|
| Dashboard | `{service} · {purpose}` | `booking-api · on-call` |
| Folder | org / team | `platform` |
| Alert | `{service}: {symptom}` | `booking-api: high error rate` |
| Log check | `LOKI-YYYYMMDD-{slug}` | `LOKI-20260715-timeout` |
| Explore | `EXP-YYYYMMDD-{slug}` | `EXP-20260715-latency` |

## Paths

| Artifact | Path |
|----------|------|
| Dashboard | `docs/ops/grafana/dashboards/{slug}.md` |
| Alert | `docs/ops/grafana/alerts/{slug}.md` |
| Loki check | `docs/ops/grafana/log-checks/{id}.md` |
| Explore | `docs/ops/grafana/explore/{id}.md` |
