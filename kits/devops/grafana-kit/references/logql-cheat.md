# LogQL Cheat

## Stream selector

```logql
{service="booking-api", env="prod"}
{namespace="prod", app="booking-api"}
```

## Line filters

```logql
{service="booking-api"} |= "ERROR"
{service="booking-api"} |= "ERROR" != "healthcheck"
{service="booking-api"} |~ "(?i)timeout|timed out"
```

## Parser

```logql
{service="booking-api"} |= "ERROR"
  | json
  | level="error"
```

## Metric queries

```logql
sum(rate({service="booking-api", env="prod"} |= "ERROR" [5m]))
```

Narrow labels first; expand time range only when hunting first-seen.
