# TechSphereX AI Draw.io Brain — Index

> Bộ não **draw.io / diagrams.net** của TechSphereX AI. Dùng khi chọn skill, layout, palette, export — **evidence-only**, không bịa component/quan hệ không có trong mô tả user.

## 1. Triết lý

1. **`.drawio` là artifact chính** — PNG/SVG chỉ khi user yêu cầu (trừ self-check tạm của `/diagram`)
2. **Core shapes trước** — mở được mọi máy; stencil AWS/Azure chỉ khi user cần icon hãng
3. **Đúng skill đúng việc** — tay nhanh vs CLI mạnh; đừng nhồi mọi thứ vào 1 skill
4. **Layout có kỷ luật** — grid 20, spacing, orthogonal edges, không chồng node
5. **HITL** — L3 layout preview → L1 write; sửa file cũ → L2 diff
6. **Third-party code nguyên vẹn** — `scripts/` từ drawio-skill (MIT); không patch logic script

## 2. Bản đồ tri thức

| Layer | File |
|-------|------|
| Luật XML / palette / path | `.claude/rules/drawio-conventions.md` |
| HITL | `.claude/rules/approval-gate.md` |
| Path / slug | `.claude/rules/naming-conventions.md` |
| Toolbox 28 scripts | `references/toolbox.md` |
| Loại sơ đồ | `references/diagram-types.md` |
| XML tay | `references/xml-authoring.md` |
| Mermaid → draw.io | `references/mermaid-authoring.md` |
| Style presets | `references/style-presets.md` |
| Autolayout | `references/autolayout.md` |
| Live infra | `references/live-infra.md` |
| Troubleshooting | `references/troubleshooting.md` |
| License upstream | `LICENSE-drawio-skill` |

## 3. Skill map

```text
/architecture     ← kiến trúc client/edge/service/data/external (XML tay, no CLI)
/flowchart        ← process start/decision/end (XML tay, no CLI)
/erd              ← ERD entity-relationship (XML tay hoặc gợi ý /diagram --from-sql)
/diagram          ← ERD/UML/sequence/C4/ML/import code-IaC, shapesearch, export (cần draw.io CLI)
```

| Nhu cầu | Skill |
|---------|--------|
| Kiến trúc 3–12 box, stakeholder | `/architecture` |
| Quy trình approval / business flow | `/flowchart` |
| ERD vài entity, mô tả bằng lời | `/erd` |
| ERD từ `CREATE TABLE` / sequence / C4 / AWS icon / export PNG | `/diagram` |
| BA Mermaid/PlantUML/D2 (không .drawio) | package `diagram-skills` (khác kit) |

## 4. “Chuẩn khỏe” diagram

- [ ] File mở được trong draw.io (root cell 0 + 1)
- [ ] Core shapes (hoặc ghi chú stencil library)
- [ ] Palette TechSphereX AI nhất quán (trừ preset user chọn)
- [ ] Edge có exit/entry rõ; decision có nhãn nhánh
- [ ] Path đúng `docs/diagrams/{feature}/{type}-{slug}.drawio`
- [ ] Không secret trong label/tooltip
- [ ] >15 node: nhóm container hoặc chuyển `/diagram` + autolayout

## 5. Anti-patterns

- Xuất PNG làm “bản chính”, mất file `.drawio`
- Đoán `shape=mxgraph.aws4.*` không qua `shapesearch.py`
- Node chồng / edge không neo
- Bịa service/DB không có trong mô tả
- Sửa trực tiếp `scripts/*.py` của upstream
- Một flowchart 40 bước thay vì tách sub-diagram

## 6. Prereq (máy dev)

| Tool | Bắt buộc cho |
|------|----------------|
| Không cần gì | `/architecture`, `/flowchart`, `/erd` (chỉ ghi XML) |
| draw.io desktop ≥ v30 | `/diagram` Mermaid convert, ELK layout, export |
| Graphviz `dot` | `scripts/autolayout.py` (optional; có thể dùng CLI `--layout`) |
| Python 3 | chạy scripts |

## 7. Cài & dùng

```bash
cp -r software/drawio-kit/.claude/ your-project/.claude/
cp -r software/drawio-kit/_templates/ your-project/_templates/
# optional assets for /diagram
cp -r software/drawio-kit/scripts your-project/scripts
cp -r software/drawio-kit/references your-project/docs/_drawio-ref
cp -r software/drawio-kit/styles your-project/styles
cp -r software/drawio-kit/data your-project/data
```

When using `/diagram`, keep `scripts/`, `styles/`, and `data/` on the project (or adjust paths in the skill if you relocate them).
