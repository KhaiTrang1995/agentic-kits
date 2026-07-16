# Common Log Patterns

| Pattern | Likely cause | Correlate |
|---------|--------------|-----------|
| Timeout / timed out | Slow dependency, pool exhaustion | Latency, DB, HTTP client |
| Connection refused | Downstream down, wrong port | Health, deploy |
| OutOfMemory / OOM | Heap, leak, traffic spike | Memory, GC |
| 5xx + stack | App bug / unhandled | Release, canary |
| 401/403 spike | Auth config, key rotation | IdP, gateway |
| No space / disk | Full disk | Host disk metrics |
| Too many connections | Pool / ulimit | DB metrics |

## Redact before reporting

Bearer/JWT, passwords, connection strings, cards, government IDs, phone numbers.

Max ~10 sample lines; summarize “~N similar”.
