# Grafana Kit

> AI Skill Kit for **Grafana** (+ Prometheus / Loki) — dashboards, alert rules, Explore sessions, and **`/loki-query`** for log checks. Complements `elk-kit` (Elastic/KQL) and `k8s-kit` `/monitor` (PrometheusRules YAML on cluster).

## Skills

| Skill | Description |
|-------|-------------|
| `/grafana` | Hub Q&A — route dashboard / alert / loki / explore |
| `/grafana-dashboard` | Dashboard rows, panels, variables, PromQL/LogQL |
| `/grafana-alert` | Alert rules, `for`, labels, annotations |
| `/loki-query` | **Check logs with LogQL** — query + investigation report |
| `/grafana-explore` | Correlate Prometheus metrics + Loki logs |

## Brain

See **`GRAFANA-BRAIN.md`**.

## Rules

- `grafana-conventions.md`
- `naming-conventions.md`
- `approval-gate.md`

## Templates

| Template | Skill |
|----------|--------|
| `dashboard-spec.md` | `/grafana-dashboard` |
| `alert-rule.md` | `/grafana-alert` |
| `loki-log-check.md` | `/loki-query` |
| `explore-session.md` | `/grafana-explore` |

## Usage

```bash
cp -r kits/devops/grafana-kit/.claude/ your-project/.claude/
cp -r kits/devops/grafana-kit/_templates/ your-project/_templates/

/grafana-dashboard booking-api --oncall --logs
/loki-query booking-api --env prod --since 1h
/grafana-alert booking-api high error rate --sev critical --prom
```

## Log check flow (Loki)

```
/loki-query ...
  → /grafana-explore (correlate)
  → /grafana-alert if pattern should page
```

For Elastic full-text search use **`elk-kit` `/log-check`**.

## Safety

Agent generates specs and sample queries only — no Grafana API provisioning, no live silence storms.
