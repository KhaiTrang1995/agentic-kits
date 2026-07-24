# Software Kits

Role and craft kits for the software delivery lifecycle — same structure as [`../devops/`](../devops/): `.claude/skills` + `.claude/rules` + `_templates` (+ optional brain, scripts, references).

| Kit | Status | Scope | Skills (highlight) |
|-----|--------|--------|--------------------|
| [drawio-kit](./drawio-kit/) | Available | Architecture & technical diagrams (`.drawio` / diagrams.net) | `/architecture`, `/flowchart`, `/erd`, `/diagram` — brain: `DRAWIO-BRAIN.md` |
| [runner-kit-3d](./runner-kit-3d/) | Available | 3D endless-runner games (Three.js engine skills) | `/runner`, `/runner-new`, `/runner-tune` — brain: `RUNNER-BRAIN.md` · **live:** [`../../demos/runner-kit-3d/`](../../demos/runner-kit-3d/) |

Container and observability kits stay under [`../devops/`](../devops/).

## Install pattern

```bash
cp -r kits/software/{kit-name}/.claude/ your-project/.claude/
cp -r kits/software/{kit-name}/_templates/ your-project/_templates/

# or
npx agentic-awesome-kits --claude --category software
npx agentic-awesome-kits --claude --kit runner-kit-3d --kit drawio-kit
```

For **runner-kit-3d**, also copy the playable engine when you need games:

```bash
cp -r demos/runner-kit-3d your-project/runner-kit-3d
```

See each kit’s README for extra assets (e.g. `drawio-kit` scripts and draw.io desktop CLI).

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md).
