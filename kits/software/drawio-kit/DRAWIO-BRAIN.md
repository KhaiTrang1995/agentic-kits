# TechSphereX AI Draw.io Brain â€” Index

> Bá»™ nÃ£o **draw.io / diagrams.net** cá»§a TechSphereX AI. DÃ¹ng khi chá»n skill, layout, palette, export â€” **evidence-only**, khÃ´ng bá»‹a component/quan há»‡ khÃ´ng cÃ³ trong mÃ´ táº£ user.

## 1. Triáº¿t lÃ½

1. **`.drawio` lÃ  artifact chÃ­nh** â€” PNG/SVG chá»‰ khi user yÃªu cáº§u (trá»« self-check táº¡m cá»§a `/diagram`)
2. **Core shapes trÆ°á»›c** â€” má»Ÿ Ä‘Æ°á»£c má»i mÃ¡y; stencil AWS/Azure chá»‰ khi user cáº§n icon hÃ£ng
3. **ÄÃºng skill Ä‘Ãºng viá»‡c** â€” tay nhanh vs CLI máº¡nh; Ä‘á»«ng nhá»“i má»i thá»© vÃ o 1 skill
4. **Layout cÃ³ ká»· luáº­t** â€” grid 20, spacing, orthogonal edges, khÃ´ng chá»“ng node
5. **HITL** â€” L3 layout preview â†’ L1 write; sá»­a file cÅ© â†’ L2 diff
6. **Third-party code nguyÃªn váº¹n** â€” `scripts/` tá»« drawio-skill (MIT); khÃ´ng patch logic script

## 2. Báº£n Ä‘á»“ tri thá»©c

| Layer | File |
|-------|------|
| Luáº­t XML / palette / path | `.claude/rules/drawio-conventions.md` |
| HITL | `.claude/rules/approval-gate.md` |
| Path / slug | `.claude/rules/naming-conventions.md` |
| Toolbox 28 scripts | `references/toolbox.md` |
| Loáº¡i sÆ¡ Ä‘á»“ | `references/diagram-types.md` |
| XML tay | `references/xml-authoring.md` |
| Mermaid â†’ draw.io | `references/mermaid-authoring.md` |
| Style presets | `references/style-presets.md` |
| Autolayout | `references/autolayout.md` |
| Live infra | `references/live-infra.md` |
| Troubleshooting | `references/troubleshooting.md` |
| License upstream | `LICENSE-drawio-skill` |

## 3. Skill map

```text
/architecture     â† kiáº¿n trÃºc client/edge/service/data/external (XML tay, no CLI)
/flowchart        â† process start/decision/end (XML tay, no CLI)
/erd              â† ERD entity-relationship (XML tay hoáº·c gá»£i Ã½ /diagram --from-sql)
/diagram          â† ERD/UML/sequence/C4/ML/import code-IaC, shapesearch, export (cáº§n draw.io CLI)
```

| Nhu cáº§u | Skill |
|---------|--------|
| Kiáº¿n trÃºc 3â€“12 box, stakeholder | `/architecture` |
| Quy trÃ¬nh approval / business flow | `/flowchart` |
| ERD vÃ i entity, mÃ´ táº£ báº±ng lá»i | `/erd` |
| ERD tá»« `CREATE TABLE` / sequence / C4 / AWS icon / export PNG | `/diagram` |
| BA Mermaid/PlantUML/D2 (khÃ´ng .drawio) | package `diagram-skills` (khÃ¡c kit) |

## 4. â€œChuáº©n khá»eâ€ diagram

- [ ] File má»Ÿ Ä‘Æ°á»£c trong draw.io (root cell 0 + 1)
- [ ] Core shapes (hoáº·c ghi chÃº stencil library)
- [ ] Palette TechSphereX AI nháº¥t quÃ¡n (trá»« preset user chá»n)
- [ ] Edge cÃ³ exit/entry rÃµ; decision cÃ³ nhÃ£n nhÃ¡nh
- [ ] Path Ä‘Ãºng `docs/diagrams/{feature}/{type}-{slug}.drawio`
- [ ] KhÃ´ng secret trong label/tooltip
- [ ] >15 node: nhÃ³m container hoáº·c chuyá»ƒn `/diagram` + autolayout

## 5. Anti-patterns

- Xuáº¥t PNG lÃ m â€œbáº£n chÃ­nhâ€, máº¥t file `.drawio`
- ÄoÃ¡n `shape=mxgraph.aws4.*` khÃ´ng qua `shapesearch.py`
- Node chá»“ng / edge khÃ´ng neo
- Bá»‹a service/DB khÃ´ng cÃ³ trong mÃ´ táº£
- Sá»­a trá»±c tiáº¿p `scripts/*.py` cá»§a upstream
- Má»™t flowchart 40 bÆ°á»›c thay vÃ¬ tÃ¡ch sub-diagram

## 6. Prereq (mÃ¡y dev)

| Tool | Báº¯t buá»™c cho |
|------|----------------|
| KhÃ´ng cáº§n gÃ¬ | `/architecture`, `/flowchart`, `/erd` (chá»‰ ghi XML) |
| draw.io desktop â‰¥ v30 | `/diagram` Mermaid convert, ELK layout, export |
| Graphviz `dot` | `scripts/autolayout.py` (optional; cÃ³ thá»ƒ dÃ¹ng CLI `--layout`) |
| Python 3 | cháº¡y scripts |

## 7. CÃ i & dÃ¹ng

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
