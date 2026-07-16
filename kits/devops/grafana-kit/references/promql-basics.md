# PromQL Basics

```promql
# Request rate
sum(rate(http_requests_total{service="booking-api"}[5m]))

# Error ratio
sum(rate(http_requests_total{service="booking-api",code=~"5.."}[5m]))
/
sum(rate(http_requests_total{service="booking-api"}[5m]))

# p99 latency
histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_seconds_bucket{service="booking-api"}[5m]))
)
```

Alerts should use a sensible `for:` (e.g. 5m) unless SLO burn requires otherwise.
