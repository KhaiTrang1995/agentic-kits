# Kits

Public skill kits for coding agents. Grouped by domain so the repo root stays small as more categories appear.

```text
kits/
  devops/      # run, deploy, observe
  software/    # diagrams, future role kits
  # future: security/, data/, ...
```

| Category | Path | Examples |
|----------|------|----------|
| **DevOps** | [devops/](./devops/) | docker, swarm, k8s, zabbix, elk, grafana |
| **Software** | [software/](./software/) | drawio-kit |

## Install (any kit)

```bash
cp -r kits/{category}/{kit-name}/.claude/ your-project/.claude/
cp -r kits/{category}/{kit-name}/_templates/ your-project/_templates/
```

Example:

```bash
cp -r kits/devops/docker-kit/.claude/ your-project/.claude/
cp -r kits/software/drawio-kit/.claude/ your-project/.claude/
```

Docs UI: [devops/index.html](./devops/index.html) · site home: [../index.html](../index.html)

NPX installer (plan bundle) lives separately under [`packages/agentic-awesome-kits/`](../packages/agentic-awesome-kits/) — research sources stay in `share-untrack/`.
