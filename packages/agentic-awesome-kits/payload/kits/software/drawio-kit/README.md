# Draw.io Kit â€” TechSphereX AI

> Bá»™ AI Skill Kit sinh sÆ¡ Ä‘á»“ **`.drawio`** (diagrams.net): kiáº¿n trÃºc, flowchart, ERD dá»±ng tay, vÃ  skill `/diagram` nÃ¢ng cao (tÃ­ch há»£p [drawio-skill](https://github.com/Agents365-ai/drawio-skill) MIT â€” scripts, shape index, style presets).

## Skills

| Skill | Khi dÃ¹ng | CLI draw.io? |
|-------|----------|--------------|
| `/architecture` | Client â†’ gateway â†’ services â†’ DB / external | KhÃ´ng |
| `/flowchart` | Quy trÃ¬nh start / process / decision / end | KhÃ´ng |
| `/erd` | Entityâ€“relationship (mÃ´ táº£ hoáº·c gá»£i Ã½ tá»« SQL) | KhÃ´ng (SQL phá»©c táº¡p â†’ `/diagram`) |
| `/diagram` | Sequence, C4, UML, import code/IaC/SQL/OpenAPI, shape 10k+, export PNG/SVG/PDF | **CÃ³** (desktop â‰¥ v30) |

## Brain

Äá»c **`DRAWIO-BRAIN.md`** â€” skill map, anti-pattern, prereq.

## Rules

- `drawio-conventions.md` â€” XML, core shapes, TechSphereX AI palette, grid, edges, paths
- `naming-conventions.md` â€” file/slug/path
- `approval-gate.md` â€” L3 layout â†’ L1 write â†’ L2 diff

## Templates

| Template | Skill |
|----------|--------|
| `_templates/architecture.drawio` | `/architecture` |
| `_templates/flowchart.drawio` | `/flowchart` |
| `_templates/erd.drawio` | `/erd` |

## Assets (`/diagram`)

| Path | Ná»™i dung |
|------|----------|
| `scripts/` | 28 Python scripts (upstream drawio-skill) |
| `references/` | toolbox, xml-authoring, styles, â€¦ |
| `styles/` | built-in presets |
| `data/` | shape-index + lobe icons |
| `LICENSE-drawio-skill` | MIT upstream |

## CÃ i Ä‘áº·t

```bash
# From this repo â€” skills + rules + templates (architecture / flowchart / erd)
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

## VÃ­ dá»¥

```text
/architecture TOPO: Angular â†’ API Gateway â†’ Booking/Auth â†’ SQL Server
/flowchart duyá»‡t nghá»‰ phÃ©p: NV ná»™p â†’ QL duyá»‡t â†’ HR â†’ xÃ¡c nháº­n
/erd Order, OrderLine, Customer, Payment â€” 1-N Order-OrderLine
/diagram --type sequence OAuth login Client, Auth, Resource
/diagram --from-sql @schema.sql --type erd
```

## MÃ´i trÆ°á»ng (tham chiáº¿u)

- draw.io desktop CLI: v30+ (export / Mermaid / ELK)
- Graphviz: optional cho `autolayout.py`
- Python 3: scripts

## LiÃªn quan

| Kit / package | KhÃ¡c gÃ¬ |
|---------------|---------|
| `diagram-skills-kit` (BA Mermaid/PlantUML/D2) | KhÃ´ng pháº£i `.drawio` |
| Upstream [drawio-skill](https://github.com/Agents365-ai/drawio-skill) | Nguá»“n scripts; kit nÃ y bá»c skill + TechSphereX AI rules |

## License

- Skills/rules/templates TechSphereX AI: theo repo chá»§
- `scripts/`, `data/`, `styles/`, `references/` (pháº§n upstream): **MIT** â€” xem `LICENSE-drawio-skill`
