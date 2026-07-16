# Panel Design — On-call

```text
Row 1 — Traffic & errors
  [ RPS ] [ Error % ] [ p95/p99 ]

Row 2 — Saturation
  [ CPU ] [ Memory ] [ Pods ready ]

Row 3 — Logs (Loki)
  [ Error log rate ] [ Last error lines ]
```

| Signal | Panel type |
|--------|------------|
| Rate / ratio | Time series |
| Current burn | Stat / Gauge |
| Top offenders | Bar / Table |
| Log lines | Logs panel |
