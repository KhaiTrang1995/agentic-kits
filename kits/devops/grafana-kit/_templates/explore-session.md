---
type: grafana-explore
id: EXP-{{YYYYMMDD}}-{{slug}}
service: {{service}}
symptom: {{errors|latency}}
updated: {{date}}
---

# Explore Session: {{title}}

## Time range

{{from → to}} ({{TZ}})

## Metrics (PromQL)

```promql
{{...}}
```

Observations: {{...}}

## Logs (LogQL)

```logql
{{...}}
```

Observations: {{...}}

## Correlation

| Time | Metric | Log | Note |
|------|--------|-----|------|
| | | | |

## Conclusion

{{...}}

## Follow-ups

- [ ] Dashboard / alert update
- [ ] Runbook / incident
