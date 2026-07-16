# Draw.io Kit — TechSphereX AI

> AI Skill Kit for generating **`.drawio`** diagrams (diagrams.net): hand-authored architecture, flowchart, and ERD, plus an advanced `/diagram` skill (integrates [drawio-skill](https://github.com/Agents365-ai/drawio-skill) MIT — scripts, shape index, style presets).

## Skills

| Skill | When to use | draw.io CLI? |
|-------|-------------|--------------|
| `/architecture` | Client → gateway → services → DB / external | No |
| `/flowchart` | Process start / process / decision / end | No |
| `/erd` | Entity–relationship (description or SQL hint) | No (complex SQL → `/diagram`) |
| `/diagram` | Sequence, C4, UML, import code/IaC/SQL/OpenAPI, 10k+ shapes, export PNG/SVG/PDF | **Yes** (desktop ≥ v30) |

## Brain

Read **`DRAWIO-BRAIN.md`** — skill map, anti-patterns, prerequisites.

## Rules

- `drawio-conventions.md` — XML, core shapes, TechSphereX AI palette, grid, edges, paths
- `naming-conventions.md` — file/slug/path
- `approval-gate.md` — L3 layout → L1 write → L2 diff

## Templates

| Template | Skill |
|----------|--------|
| `_templates/architecture.drawio` | `/architecture` |
| `_templates/flowchart.drawio` | `/flowchart` |
| `_templates/erd.drawio` | `/erd` |

## Assets (`/diagram`)

| Path | Contents |
|------|----------|
| `scripts/` | 28 Python scripts (upstream drawio-skill) |
| `references/` | toolbox, xml-authoring, styles, … |
| `styles/` | built-in presets |
| `data/` | shape-index + lobe icons |
| `LICENSE-drawio-skill` | MIT upstream |

## Install

```bash
# From this repo — skills + rules + templates (architecture / flowchart / erd)
cp -r kits/software/drawio-kit/.claude/ your-project/.claude/
cp -r kits/software/drawio-kit/_templates/ your-project/_templates/

# Full /diagram (scripts, shape index, styles)
cp -r kits/software/drawio-kit/scripts your-project/scripts
cp -r kits/software/drawio-kit/references your-project/docs/_drawio-ref
cp -r kits/software/drawio-kit/styles your-project/styles
cp -r kits/software/drawio-kit/data your-project/data
```

## Output

```text
docs/diagrams/{feature}/architecture-{slug}.drawio
docs/diagrams/{feature}/flowchart-{slug}.drawio
docs/diagrams/{feature}/erd-{slug}.drawio
docs/diagrams/{feature}/{type}-{slug}.drawio   # /diagram
```

## Examples

```text
/architecture TOPO: Angular → API Gateway → Booking/Auth → SQL Server
/flowchart leave request: employee submits → manager approves → HR → confirm
/erd Order, OrderLine, Customer, Payment — 1-N Order-OrderLine
/diagram --type sequence OAuth login Client, Auth, Resource
/diagram --from-sql @schema.sql --type erd
```

## Environment (reference)

- draw.io desktop CLI: v30+ (export / Mermaid / ELK)
- Graphviz: optional for `autolayout.py`
- Python 3: scripts

## Related

| Kit / package | How it differs |
|---------------|----------------|
| `diagram-skills-kit` (BA Mermaid/PlantUML/D2) | Not `.drawio` |
| Upstream [drawio-skill](https://github.com/Agents365-ai/drawio-skill) | Source of scripts; this kit wraps skills + TechSphereX AI rules |

## License

- TechSphereX AI skills/rules/templates: per parent repo
- `scripts/`, `data/`, `styles/`, `references/` (upstream portions): **MIT** — see `LICENSE-drawio-skill`
