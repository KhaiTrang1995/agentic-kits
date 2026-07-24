# Kits

Public AI skill kits, grouped by category. Each kit is standalone: copy `.claude/` (+ optional `_templates/`) into your project.

| Category | Path | Kits |
|----------|------|------|
| **DevOps** | [`devops/`](./devops/) | docker-kit, docker-swarm-kit, k8s-kit, zabbix-kit, elk-kit, grafana-kit |
| **Software** | [`software/`](./software/) | drawio-kit, runner-kit-3d |

Site catalog: [`../index.html`](../index.html) · DevOps docs UI: [`devops/index.html`](./devops/index.html)

## Software kits (highlight)

| Kit | Scope | Skills |
|-----|--------|--------|
| [drawio-kit](./software/drawio-kit/) | Architecture & technical diagrams (`.drawio`) | `/architecture`, `/flowchart`, `/erd`, `/diagram` |
| [runner-kit-3d](./software/runner-kit-3d/) | 3D endless-runner games (Three.js skills) | `/runner`, `/runner-new`, `/runner-tune` |

**Live engine demos** (playable games, not the skill package): [`../demos/runner-kit-3d/`](../demos/runner-kit-3d/)

## Install / pack

```bash
# Copy one kit
cp -r kits/software/runner-kit-3d/.claude/ your-project/.claude/
cp -r kits/software/runner-kit-3d/_templates/ your-project/_templates/

# Or via npm installer (packed payload)
npx agentic-awesome-kits --claude --category software
npx agentic-awesome-kits --claude --kit runner-kit-3d --kit drawio-kit

# Maintainer: rebuild npm payload from kits/
node packages/agentic-awesome-kits/scripts/pack-kits.mjs
node packages/agentic-awesome-kits/bin/cli.js --list
```

Pack discovers only `kits/{category}/{kit}/.claude/` (not loose folders under `kits/`).

## Layout

```text
kits/
  devops/           # containers + observability
  software/         # drawio-kit, runner-kit-3d, …
demos/
  runner-kit-3d/    # live Three.js engine + sample games
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
