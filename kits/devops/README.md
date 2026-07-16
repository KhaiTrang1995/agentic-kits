# DevOps Kits

Kits for containers, orchestration, and observability. Each kit is standalone — copy just the one you need — but they share conventions where it makes sense (`docker-swarm-kit` references `docker-kit`'s Dockerfile rules instead of repeating them).

> **Note — examples use .NET 10.**  
> Sample prompts and templates such as `docker-kit`’s `Dockerfile.dotnet` target **.NET 10** (e.g. Minimal API). Skills still work for other runtimes — specify the stack in the skill arguments.

**Docs UI (recommended):** open [`index.html`](./index.html) in this folder — same content, visual page.  
All kits: [`../`](../) · Site home: [`../../index.html`](../../index.html)

## Container / orchestration

| Kit | Scope | Skills |
|-----|-------|--------|
| [docker-kit](./docker-kit/) | Single-host containerization | `/dockerfile`, `/compose`, `/ci` |
| [docker-swarm-kit](./docker-swarm-kit/) | Multi-node orchestration, Compose-native | `/stack`, `/service`, `/secret` |
| [k8s-kit](./k8s-kit/) | Multi-node orchestration, full platform | `/deploy`, `/helm`, `/monitor` |

## Observability (monitor + log check)

| Kit | Scope | Skills | Brain |
|-----|-------|--------|-------|
| [zabbix-kit](./zabbix-kit/) | Zabbix hosts, templates, triggers, problems | `/zabbix`, `/zabbix-host`, `/zabbix-template`, `/zabbix-trigger`, `/zabbix-check` | `ZABBIX-BRAIN.md` |
| [elk-kit](./elk-kit/) | ELK stack + **log investigation** | `/elk`, **`/log-check`**, `/es-query`, `/logstash`, `/kibana-dashboard`, `/elk-health` | `ELK-BRAIN.md` |
| [grafana-kit](./grafana-kit/) | Grafana, Prometheus, Loki | `/grafana`, `/grafana-dashboard`, `/grafana-alert`, **`/loki-query`**, `/grafana-explore` | `GRAFANA-BRAIN.md` |

### Which log skill?

```
Full-text logs in Elasticsearch/Kibana  →  elk-kit      /log-check
Logs in Loki (Grafana Explore)          →  grafana-kit  /loki-query
Zabbix log item / host problem          →  zabbix-kit   /zabbix-check
PrometheusRules YAML on Kubernetes      →  k8s-kit      /monitor
```

## Which container kit?

```
Single container / single host, no orchestration
  → docker-kit

Multiple nodes, want to keep using docker-compose syntax,
small-to-mid team, don't need auto-scaling/Ingress/RBAC
  → docker-swarm-kit

Multiple nodes, need auto-scaling, Ingress, RBAC,
large ecosystem (Helm charts, operators, service mesh)
  → k8s-kit
```

They compose in the direction you'd expect in a real migration: start with `docker-kit` to containerize, move to `docker-swarm-kit` for the simplest multi-node story, graduate to `k8s-kit` when Swarm's primitives become a real constraint — not before.

Observability kits compose the same way: Zabbix for classic infra signals, ELK or Grafana/Loki for logs, `k8s-kit` `/monitor` for in-cluster PrometheusRules.

## Structure (all kits)

```
{kit-name}/
  .claude/
    skills/
      {skill-name}/
        SKILL.md          ← skill definition (trigger, input, output, process)
    rules/
      {convention}.md     ← conventions the AI must follow when generating output
  _templates/
    {output-template}     ← ready-to-fill output template
  references/             ← optional cheatsheets (obs kits)
  *-BRAIN.md              ← optional long-lived guidance (obs kits)
  README.md               ← how to use this kit
```

## Shared design principles

- **The agent never executes the risky command.** `docker build`, `kubectl apply`, Zabbix imports, ES deletes, Grafana API applies — left for a human after review. See each kit's `approval-gate.md`.
- **Rules are the single source of truth.** Skills reference `*-conventions.md` instead of repeating security/resource rules in every skill file.
- **Templates are copy-and-fill, not generate-from-scratch.** Known-good baselines for both AI and humans.
- **Evidence-only on investigations.** Log/problem checks do not invent hit counts or metric values.
