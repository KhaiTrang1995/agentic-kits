# ELK Conventions

## Index / data view

- Prefer `{env}-{service}-logs-*` or data streams `logs-{dataset}-{namespace}`.
- Required-ish fields: `@timestamp`, `service.name` (or `service`), `host.name`, `log.level`, `message`.
- Recommended: `trace.id`, `event.dataset`, stack traces as dedicated fields (ECS-style).

## Query safety

| Rule | Detail |
|------|--------|
| Time range | Always set (15m / 1h / 24h); never “all time” by default |
| Filter first | `service` + `env` before free-text |
| Size | Sample 20–50; aggs for counts |
| Sensitive | Redact tokens, passwords, PII in outputs |
| MUTATIVE | delete, reindex, put mapping, live ILM = human + change window |

## Log-check quality

Reports must include: question, query, evidence samples (≤10, redacted), pattern groups, correlate hints, conclusion or TBD.  
No invented hit counts — write `count: TBD (run query)` if the user did not provide numbers.

## Pipelines

- Failure tags / DLQ idea documented.
- Grok tested against a real sample line when available.
- Secrets only as env/keystore names.
