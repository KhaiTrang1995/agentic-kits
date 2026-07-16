---
name: erd
description: Sinh ERD .drawio — entity, attribute, quan hệ 1-1/1-N/N-N, PK/FK. XML tay theo TechSphereX AI palette; SQL DDL phức tạp chuyển /diagram --from-sql.
user-invocable: true
argument-hint: "<mô tả entities/quan hệ> [--feature slug] [@schema.sql]"
---

# /erd — Entity-Relationship Diagram (draw.io)

## Khi nào dùng

- Data model cho tài liệu thiết kế / BA–dev alignment
- Vài–chục entity mô tả bằng lời (không cần importer SQL)
- Cần file `.drawio` chỉnh tay được

**Chuyển `/diagram` khi:** có file SQL DDL lớn (`sqlerd.py`), cần auto-layout hàng chục bảng, hoặc export PNG hàng loạt.

## Input examples

```
/erd Order 1-N OrderLine, Order N-1 Customer, Order 1-1 Payment --feature booking
/erd module auth: User, Role, UserRole (N-N), Permission
/erd @schema.sql   → gợi ý chuyển /diagram --from-sql nếu >8 bảng
```

## Quy trình

### Phase 1 — Inventory

Liệt kê:

| Entity | PK | Attributes (ngắn) | Notes |
|--------|----|--------------------|-------|
| | | | |

Quan hệ: `A 1—N B`, `A N—N B` (// associative entity nếu cần).

Thiếu tên quan hệ / cardinality → hỏi 1–2 câu; **không bịa** FK.

### Phase 2 — L3 layout preview

Bảng node + cạnh (ASCII/table). User duyệt trước khi XML.

### Phase 3 — Sinh XML

Dùng `@_templates/erd.drawio` làm khung:

- Entity = rounded rect (hoặc swimlane-style header): **tên entity bold** + list attr
- PK đánh dấu `PK`; FK `FK` (text only)
- Edge: `endArrow=ERoneToMany` / `ERmandOne` / `ERzeroToMany` khi phù hợp; fallback `endArrow=block` + nhãn `1` / `N` trên edge
- Palette: entity fill `#dae8fc`, associative `#fff2cc`, external ref `#f5f5f5` (theo conventions)
- Grid 20; entity box ~200×(40 + 20×attr count)

### Phase 4 — L1 → Write

`docs/diagrams/{feature}/erd-{slug}.drawio`

## Rules bắt buộc

- @.claude/rules/drawio-conventions.md (core shapes, escape XML)
- @.claude/rules/naming-conventions.md
- @.claude/rules/approval-gate.md
- Không bịa cột/quan hệ; TBD + hỏi
- ≤ 15 entity trên 1 trang — nhiều hơn: tách domain hoặc `/diagram` + sqlerd/autolayout

## Output

`docs/diagrams/{feature}/erd-{slug}.drawio`

## References

- @_templates/erd.drawio
- @.claude/rules/drawio-conventions.md
- Nâng cao: skill `/diagram` + `scripts/sqlerd.py`
