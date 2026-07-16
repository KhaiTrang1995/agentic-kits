# Agentic Kits

Reusable **AI Skill Kits** for coding agents (Claude Code and any other subagent/slash-command-compatible tool). Each kit is a self-contained package of **Skills** (slash commands), **Rules** (conventions the agent must follow), and **Templates** (fill-in-the-blank output baselines) — copy `.claude/` into your project and the skills work immediately.

```
/dockerfile .NET 10 Minimal API --prod
/deploy container-api --namespace prod --replicas 3 --with-ingress
/log-check booking-api --env prod --since 1h
```

> **Note — examples use .NET 10.**  
> Sample commands, `Dockerfile.dotnet`, and related container templates in this repo target **.NET 10** (e.g. Minimal API). Skills are stack-agnostic: pass another runtime in the prompt when you need it.

Browse the visual index: [`index.html`](./index.html) · DevOps docs: [`devops/`](./devops/)

**Live site (GitHub Pages + Jekyll):**  
https://KhaiTrang1995.github.io/agentic-kits/

## Why this exists

Prompting an agent to "write me a Dockerfile" gets you *a* Dockerfile — not necessarily a multi-stage, non-root, healthcheck'd one your team would actually ship. A kit turns that tribal knowledge into a `rules/*.md` file the agent reads before generating anything, so the output is consistent whether it's you, a teammate, or a different agent session asking.

## Categories

| Category | Status | Kits |
|----------|--------|------|
| [devops](./devops/) | ✅ Available | **Run:** `docker-kit`, `docker-swarm-kit`, `k8s-kit` · **Observe:** `zabbix-kit`, `elk-kit` (`/log-check`), `grafana-kit` (`/loki-query`) |
| [software](./software/) | ✅ Partial | **[drawio-kit](./software/drawio-kit/)** — `.drawio` architecture / flowchart / ERD / advanced diagram · more role kits TBD |

### DevOps at a glance

| Kit | Skills (highlight) |
|-----|--------------------|
| [docker-kit](./devops/docker-kit/) | `/dockerfile`, `/compose`, `/ci` |
| [docker-swarm-kit](./devops/docker-swarm-kit/) | `/stack`, `/service`, `/secret` |
| [k8s-kit](./devops/k8s-kit/) | `/deploy`, `/helm`, `/monitor` |
| [zabbix-kit](./devops/zabbix-kit/) | `/zabbix-check`, `/zabbix-trigger`, … + `ZABBIX-BRAIN.md` |
| [elk-kit](./devops/elk-kit/) | **`/log-check`**, `/es-query`, `/logstash`, … + `ELK-BRAIN.md` |
| [grafana-kit](./devops/grafana-kit/) | **`/loki-query`**, `/grafana-dashboard`, `/grafana-alert`, … + `GRAFANA-BRAIN.md` |

**Log check quick map**

```
Elasticsearch / Kibana  →  elk-kit      /log-check
Loki / Grafana          →  grafana-kit  /loki-query
Zabbix problem / log item → zabbix-kit  /zabbix-check
```

### Software at a glance

| Kit | Skills (highlight) |
|-----|--------------------|
| [drawio-kit](./software/drawio-kit/) | `/architecture`, `/flowchart`, `/erd`, `/diagram` (draw.io CLI for advanced) |

## Quick start

```bash
git clone <this-repo>
cp -r agentic-kits/devops/docker-kit/.claude/ your-project/.claude/
cp -r agentic-kits/devops/docker-kit/_templates/ your-project/_templates/

# In Claude Code (or any compatible agent) — example uses .NET 10:
/dockerfile .NET 10 Minimal API --prod
```

You can copy multiple kits into the same project. Watch for skill-name collisions across kits (rare, but check `.claude/skills/` before merging).

## Structure of every kit

```
{kit-name}/
  .claude/
    skills/
      {skill-name}/
        SKILL.md          ← trigger, input examples, process, output, references
    rules/
      {convention}.md     ← what the agent must/must never do when generating output
  _templates/
    {output-template}     ← ready-to-fill baseline (Dockerfile, .yml, ...)
  references/             ← optional cheatsheets (observability kits)
  *-BRAIN.md              ← optional long-lived guidance (observability kits)
  README.md               ← how to use this specific kit
```

## Design principles shared across every kit

1. **The agent never runs the risky command.** It generates `Dockerfile`s, manifests, queries, and checklists — it does not run `docker build`, `kubectl apply`, `helm install`, or mutate prod monitoring systems. A human reviews and runs those. See each kit's `approval-gate.md`.
2. **Rules are the single source of truth.** Skills reference a shared `*-conventions.md` file instead of repeating the same security/resource rules inside every skill.
3. **Approval gate, not a wall of Y/n.** Every kit follows the same L1 (plan preview) → L2 (diff on edit) → L3 (iterate on creative output) pattern, so switching between kits doesn't mean relearning a new interaction model.
4. **Kits compose.** Where it makes sense, one kit references another instead of duplicating content — e.g. `docker-swarm-kit` points at `docker-kit`'s Dockerfile conventions rather than restating them.
5. **Evidence-only on investigations.** Log and problem checks do not invent hit counts or metric values.

## Contributing

Want to improve a kit, add a skill, or fix docs? See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for structure, checklists, and PR guidelines.

## GitHub Pages (Jekyll)

This repo publishes a static docs site with **Jekyll** (GitHub Pages).

| File | Role |
|------|------|
| [`_config.yml`](./_config.yml) | Site title, `baseurl`, exclude rules for kit internals |
| [`Gemfile`](./Gemfile) | `github-pages` + plugins for local parity |
| [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) | Build & deploy on push to `main` |
| [`index.html`](./index.html) / [`devops/index.html`](./devops/index.html) | Docs UI |

**Enable once:** repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Local preview

```bash
# Ruby 3+ recommended
bundle install
bundle exec jekyll serve

# open http://127.0.0.1:4000/agentic-kits/
```

> Kit skill packages (`.claude/`, templates, brains) are **excluded** from the Jekyll site so they stay source-only on GitHub. Use the HTML docs for browsing; clone the repo for skills.

## License

[CC BY-NC-SA 4.0](./LICENSE) — share, adapt, and build on these kits freely, including commercially-adjacent internal use, but **do not resell them** and keep derivatives under the same license with attribution.

## Roadmap

- [x] Observability kits — Zabbix, ELK (`/log-check`), Grafana/Loki (`/loki-query`)
- [x] `software/drawio-kit` — technical diagrams as `.drawio`
- [ ] More `software/` kits — BA, PM, dev (per-stack), QA, tech lead
- [ ] Cross-kit index / search once the kit count grows past a handful per category
