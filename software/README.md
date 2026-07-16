# Software Kits

Role and craft kits for the software delivery lifecycle — same structure as [`devops/`](../devops/): `.claude/skills` + `.claude/rules` + `_templates` (+ optional brain, scripts, references).

| Kit | Status | Scope | Skills (highlight) |
|-----|--------|--------|--------------------|
| [drawio-kit](https://github.com/KhaiTrang1995/agentic-kits/tree/main/software/drawio-kit) | Available | Architecture & technical diagrams (`.drawio` / diagrams.net) | `/architecture`, `/flowchart`, `/erd`, `/diagram` — brain: `DRAWIO-BRAIN.md` |

More role kits (BA full pack, PM, QA, tech lead, …) may land here over time. Container and observability kits stay under [`devops/`](../devops/).

## Install pattern

```bash
cp -r software/{kit-name}/.claude/ your-project/.claude/
cp -r software/{kit-name}/_templates/ your-project/_templates/
```

See each kit’s README for extra assets (e.g. `drawio-kit` scripts and draw.io desktop CLI).

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
