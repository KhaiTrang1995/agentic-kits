# KQL / Lucene Cheat

## KQL

```kql
service.name: "booking-api" and log.level: "error"
service.name: booking-api and message: *timeout*
host.name: prod-app-* and not message: *health*
log.level: (error or fatal) and env: prod
```

Always set the time picker; record `from → to` + timezone in reports.

## Lucene

```
message:"OutOfMemoryError" AND service:booking-api
status:[500 TO 599]
```

## DSL skeleton (read-only)

```json
{
  "size": 20,
  "query": {
    "bool": {
      "filter": [
        { "term": { "service.name": "booking-api" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ],
      "must": [{ "match": { "message": "timeout" } }]
    }
  },
  "sort": [{ "@timestamp": "desc" }]
}
```

Field names must match real mappings — mark TBD if unknown.
