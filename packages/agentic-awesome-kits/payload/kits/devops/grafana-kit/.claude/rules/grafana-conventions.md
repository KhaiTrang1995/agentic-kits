# Grafana Conventions

## Labels & variables

- Standard labels: `service`, `env`, `namespace`, `job`, `instance` when available.
- Align Prometheus and Loki labels for correlation.
- Document default variable risk if default is `prod`.

## Dashboards

| Rule | Detail |
|------|--------|
| On-call | ≤ 12 panels; golden signals → saturation → logs |
| Units | s, ms, %, ops/s |
| Refresh | 30s–1m on-call (not 5s spam) |
| Links | Panel → Explore / runbook placeholders |

## Alerting

- Use `for:` to avoid flaps.
- Annotations: symptom + runbook URL placeholder.
- Severity labels: `critical|warning|info`.
- Explicit no-data / error states.
- One symptom → not five duplicate rules.

## LogQL safety

- Narrow stream selector first: `{service="x", env="prod"}`.
- Time range required in reports.
- Prefer `|=` over heavy `|~` when possible.
- Redact secrets in samples.

## Evidence & secrets

- No invented panel values.
- Datasource passwords only as vault/secret names.
