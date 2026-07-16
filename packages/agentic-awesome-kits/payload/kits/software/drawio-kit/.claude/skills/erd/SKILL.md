---
name: erd
description: Generate ERD .drawio — entities, attributes, 1-1/1-N/N-N relationships, PK/FK. Hand-authored XML with TechSphereX AI palette; complex SQL DDL → /diagram --from-sql.
user-invocable: true
argument-hint: "<entity/relationship description> [--feature slug] [@schema.sql]"
---

# /erd — Entity-Relationship Diagram (draw.io)

## When to use

- Data model for design docs / BA–dev alignment
- A few–dozens of entities described in words (no SQL importer needed)
- Need a hand-editable `.drawio` file

**Switch to `/diagram` when:** large SQL DDL file (`sqlerd.py`), auto-layout for dozens of tables, or batch PNG export.

## Input examples

```
/erd Order 1-N OrderLine, Order N-1 Customer, Order 1-1 Payment --feature booking
/erd auth module: User, Role, UserRole (N-N), Permission
/erd @schema.sql   → suggest /diagram --from-sql if >8 tables
```

## Workflow

### Phase 1 — Inventory

List:

| Entity | PK | Attributes (short) | Notes |
|--------|----|--------------------|-------|
| | | | |

Relationships: `A 1—N B`, `A N—N B` (// associative entity if needed).

Missing relationship names / cardinality → ask 1–2 questions; **do not invent** FKs.

### Phase 2 — L3 layout preview

Node + edge table (ASCII/table). User reviews before XML.

### Phase 3 — Generate XML

Use `@_templates/erd.drawio` as the frame:

- Entity = rounded rect (or swimlane-style header): **bold entity name** + attr list
- Mark PK as `PK`; FK as `FK` (text only)
- Edge: `endArrow=ERoneToMany` / `ERmandOne` / `ERzeroToMany` when appropriate; fallback `endArrow=block` + labels `1` / `N` on the edge
- Palette: entity fill `#dae8fc`, associative `#fff2cc`, external ref `#f5f5f5` (per conventions)
- Grid 20; entity box ~200×(40 + 20×attr count)

### Phase 4 — L1 → Write

`docs/diagrams/{feature}/erd-{slug}.drawio`

## Mandatory rules

- @.claude/rules/drawio-conventions.md (core shapes, escape XML)
- @.claude/rules/naming-conventions.md
- @.claude/rules/approval-gate.md
- Do not invent columns/relationships; TBD + ask
- ≤ 15 entities per page — more: split by domain or use `/diagram` + sqlerd/autolayout

## Output

`docs/diagrams/{feature}/erd-{slug}.drawio`

## References

- @_templates/erd.drawio
- @.claude/rules/drawio-conventions.md
- Advanced: skill `/diagram` + `scripts/sqlerd.py`
