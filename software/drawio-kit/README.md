# Draw.io Kit — TechSphereX AI

> Bộ AI Skill Kit sinh sơ đồ **`.drawio`** (diagrams.net): kiến trúc, flowchart, ERD dựng tay, và skill `/diagram` nâng cao (tích hợp [drawio-skill](https://github.com/Agents365-ai/drawio-skill) MIT — scripts, shape index, style presets).

## Skills

| Skill | Khi dùng | CLI draw.io? |
|-------|----------|--------------|
| `/architecture` | Client → gateway → services → DB / external | Không |
| `/flowchart` | Quy trình start / process / decision / end | Không |
| `/erd` | Entity–relationship (mô tả hoặc gợi ý từ SQL) | Không (SQL phức tạp → `/diagram`) |
| `/diagram` | Sequence, C4, UML, import code/IaC/SQL/OpenAPI, shape 10k+, export PNG/SVG/PDF | **Có** (desktop ≥ v30) |

## Brain

Đọc **`DRAWIO-BRAIN.md`** — skill map, anti-pattern, prereq.

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

| Path | Nội dung |
|------|----------|
| `scripts/` | 28 Python scripts (upstream drawio-skill) |
| `references/` | toolbox, xml-authoring, styles, … |
| `styles/` | built-in presets |
| `data/` | shape-index + lobe icons |
| `LICENSE-drawio-skill` | MIT upstream |

## Cài đặt

```bash
# From this repo — skills + rules + templates (architecture / flowchart / erd)
cp -r software/drawio-kit/.claude/ your-project/.claude/
cp -r software/drawio-kit/_templates/ your-project/_templates/

# Full /diagram (scripts, shape index, styles)
cp -r software/drawio-kit/scripts your-project/scripts
cp -r software/drawio-kit/references your-project/docs/_drawio-ref
cp -r software/drawio-kit/styles your-project/styles
cp -r software/drawio-kit/data your-project/data
```

## Output

```text
docs/diagrams/{feature}/architecture-{slug}.drawio
docs/diagrams/{feature}/flowchart-{slug}.drawio
docs/diagrams/{feature}/erd-{slug}.drawio
docs/diagrams/{feature}/{type}-{slug}.drawio   # /diagram
```

## Ví dụ

```text
/architecture TOPO: Angular → API Gateway → Booking/Auth → SQL Server
/flowchart duyệt nghỉ phép: NV nộp → QL duyệt → HR → xác nhận
/erd Order, OrderLine, Customer, Payment — 1-N Order-OrderLine
/diagram --type sequence OAuth login Client, Auth, Resource
/diagram --from-sql @schema.sql --type erd
```

## Môi trường (tham chiếu)

- draw.io desktop CLI: v30+ (export / Mermaid / ELK)
- Graphviz: optional cho `autolayout.py`
- Python 3: scripts

## Liên quan

| Kit / package | Khác gì |
|---------------|---------|
| `diagram-skills-kit` (BA Mermaid/PlantUML/D2) | Không phải `.drawio` |
| Upstream [drawio-skill](https://github.com/Agents365-ai/drawio-skill) | Nguồn scripts; kit này bọc skill + TechSphereX AI rules |

## License

- Skills/rules/templates TechSphereX AI: theo repo chủ
- `scripts/`, `data/`, `styles/`, `references/` (phần upstream): **MIT** — xem `LICENSE-drawio-skill`
