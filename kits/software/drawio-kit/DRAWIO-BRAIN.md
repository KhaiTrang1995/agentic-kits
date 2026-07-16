# TechSphereX AI Draw.io Brain — Index

> TechSphereX AI **draw.io / diagrams.net** brain. Use when choosing skill, layout, palette, or export — **evidence-only**; do not invent components or relationships that are not in the user description.

## 1. Philosophy

1. **`.drawio` is the primary artifact** — PNG/SVG only when the user asks (except temporary self-check for `/diagram`)
2. **Core shapes first** — open on any machine; AWS/Azure stencils only when the user needs vendor icons
3. **Right skill for the job** — fast hand-authored XML vs powerful CLI; do not cram everything into one skill
4. **Disciplined layout** — grid 20, spacing, orthogonal edges, no overlapping nodes
5. **HITL** — L3 layout preview → L1 write; editing an existing file → L2 diff
6. **Third-party code intact** — `scripts/` from drawio-skill (MIT); do not patch script logic

## 2. Knowledge map

| Layer | File |
|-------|------|
| XML / palette / path rules | `.claude/rules/drawio-conventions.md` |
| HITL | `.claude/rules/approval-gate.md` |
| Path / slug | `.claude/rules/naming-conventions.md` |
| Toolbox (28 scripts) | `references/toolbox.md` |
| Diagram types | `references/diagram-types.md` |
| Hand-authored XML | `references/xml-authoring.md` |
| Mermaid → draw.io | `references/mermaid-authoring.md` |
| Style presets | `references/style-presets.md` |
| Autolayout | `references/autolayout.md` |
| Live infra | `references/live-infra.md` |
| Troubleshooting | `references/troubleshooting.md` |
| Upstream license | `LICENSE-drawio-skill` |

## 3. Skill map

```text
/architecture     ← client/edge/service/data/external architecture (hand XML, no CLI)
/flowchart        ← process start/decision/end (hand XML, no CLI)
/erd              ← ERD entity-relationship (hand XML or hand off to /diagram --from-sql)
/diagram          ← ERD/UML/sequence/C4/ML/import code-IaC, shapesearch, export (needs draw.io CLI)
```

| Need | Skill |
|------|--------|
| Architecture 3–12 boxes, stakeholders | `/architecture` |
| Approval / business process flow | `/flowchart` |
| ERD of a few entities, described in words | `/erd` |
| ERD from `CREATE TABLE` / sequence / C4 / AWS icons / export PNG | `/diagram` |
| BA Mermaid/PlantUML/D2 (not .drawio) | package `diagram-skills` (different kit) |

## 4. Healthy diagram checklist

- [ ] File opens in draw.io (root cells 0 + 1)
- [ ] Core shapes (or note required stencil library)
- [ ] Consistent TechSphereX AI palette (unless user chose a preset)
- [ ] Edges have clear exit/entry; decisions have branch labels
- [ ] Path matches `docs/diagrams/{feature}/{type}-{slug}.drawio`
- [ ] No secrets in labels/tooltips
- [ ] >15 nodes: group in containers or switch to `/diagram` + autolayout

## 5. Anti-patterns

- Export PNG as the “source of truth” and lose the `.drawio` file
- Guess `shape=mxgraph.aws4.*` without `shapesearch.py`
- Overlapping nodes / unanchored edges
- Invent services/DBs not in the description
- Edit upstream `scripts/*.py` directly
- One 40-step flowchart instead of splitting into sub-diagrams

## 6. Prerequisites (dev machine)

| Tool | Required for |
|------|----------------|
| Nothing | `/architecture`, `/flowchart`, `/erd` (XML write only) |
| draw.io desktop ≥ v30 | `/diagram` Mermaid convert, ELK layout, export |
| Graphviz `dot` | `scripts/autolayout.py` (optional; can use CLI `--layout`) |
| Python 3 | run scripts |

## 7. Install & use

```bash
cp -r kits/software/drawio-kit/.claude/ your-project/.claude/
cp -r kits/software/drawio-kit/_templates/ your-project/_templates/
# optional assets for /diagram
cp -r kits/software/drawio-kit/scripts your-project/scripts
cp -r kits/software/drawio-kit/references your-project/docs/_drawio-ref
cp -r kits/software/drawio-kit/styles your-project/styles
cp -r kits/software/drawio-kit/data your-project/data
```

When using `/diagram`, keep `scripts/`, `styles/`, and `data/` on the project (or adjust paths in the skill if you relocate them).
