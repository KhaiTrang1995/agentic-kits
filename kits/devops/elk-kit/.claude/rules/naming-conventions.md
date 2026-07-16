# Naming Conventions — ELK Kit

| Object | Format | Example |
|--------|--------|---------|
| Log check | `LOG-YYYYMMDD-{slug}` | `LOG-20260715-booking-5xx` |
| Query note | kebab intent | `booking-api-error-1h` |
| Pipeline | `{service}-logs` | `booking-api-logs` |
| Dashboard | `{service} · {purpose}` | `booking-api · on-call` |
| Health | `ELK-HEALTH-YYYYMMDD` | `ELK-HEALTH-20260715` |

## Paths

| Artifact | Path |
|----------|------|
| Log check | `docs/ops/elk/log-checks/{id}.md` |
| Query | `docs/ops/elk/queries/{slug}.md` |
| Pipeline | `docs/ops/elk/pipelines/{name}.conf` |
| Dashboard | `docs/ops/elk/dashboards/{slug}.md` |
| Health | `docs/ops/elk/health/{id}.md` |
