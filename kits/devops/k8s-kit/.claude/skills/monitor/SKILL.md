---
name: monitor
description: Generate monitoring config — Prometheus alert rules, Grafana dashboard JSON, ServiceMonitor.
user-invocable: true
argument-hint: "<app-name> [--alerts] [--dashboard] [--slo <target>]"
---

# /monitor — Generate Monitoring Config

## Input examples
```
/monitor container-api --alerts --dashboard
/monitor container-api --slo 99.9
/monitor --alerts entire namespace prod
```

## Output
```
monitoring/
  {app}/
    prometheus-rules.yaml       ← Alert rules
    servicemonitor.yaml         ← Scrape config
    grafana-dashboard.json      ← Dashboard
```

## Sample alert rules
- **HighErrorRate**: error rate > 1% over 5 minutes
- **HighLatency**: p99 > 1s over 5 minutes
- **PodCrashLoop**: restarts > 3 times in 10 minutes
- **HighMemory**: memory > 90% of limit
- **HighCPU**: CPU > 80% of limit sustained for 10 minutes

## Dashboard panels
- Request rate (req/s)
- Error rate (%)
- Latency percentiles (p50, p95, p99)
- CPU / Memory usage
- Pod count (ready vs desired)

## References
- @.claude/rules/k8s-conventions.md
