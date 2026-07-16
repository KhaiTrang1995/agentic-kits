---
name: grafana-explore
description: Guide a Grafana Explore session — correlate Prometheus metrics and Loki logs for the same window/labels.
user-invocable: true
argument-hint: "<service> [--symptom latency|errors] [--since 1h]"
---

# /grafana-explore

## Examples

```
/grafana-explore booking-api --symptom errors --since 1h
```

## Process

1. Fix shared time range  
2. PromQL golden signal for symptom  
3. LogQL with matching labels  
4. Note inflection points / deploys  
5. Optional L1 → `docs/ops/grafana/explore/EXP-....md`

## Output

`@_templates/explore-session.md`
