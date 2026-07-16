---
name: es-query
description: Build Elasticsearch Query DSL / Kibana KQL / Lucene — filters, aggs, sort. Read-only samples; no prod API calls.
user-invocable: true
argument-hint: "<what to find> [--kql|--dsl] [--service name] [--since 1h]"
---

# /es-query

## Examples

```
/es-query error timeout booking-api 1h --kql
/es-query top 10 exception messages --dsl --service booking-api
```

## Process

1. Known fields vs TBD  
2. Prefer KQL for Discover; DSL for Dev Tools  
3. Always time range + service/env filter  
4. Optional L1 → `docs/ops/elk/queries/{slug}.md`

## Output

`@_templates/es-query.md`
