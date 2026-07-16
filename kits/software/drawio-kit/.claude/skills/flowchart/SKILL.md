---
name: flowchart
description: Generate flowchart .drawio from a process description — start/end, process, decision, standard mxGraph, opens directly in draw.io.
user-invocable: true
argument-hint: "<process description> [--direction top-down|left-right]"
---

# /flowchart — Generate Flowchart (draw.io)

## When to use

Visualize a business process or control flow (business process, algorithm, approval flow) as a professional diagram editable in draw.io.

## Input examples

```
/flowchart leave request approval: submit request → manager approve → HR approve → confirm
/flowchart container search flow: enter keyword → validate → query DB → results? → display / empty state
/flowchart --direction left-right CI/CD process: push code → build → test → deploy
```

## Workflow

### Phase 1 — Analyze steps

Identify steps by type:
- **Start/End**: start/end points (ellipse)
- **Process**: action (rounded rectangle)
- **Decision**: Yes/No or multi-branch (rhombus)
- **Input/Output**: data in/out (parallelogram, if any)

### Phase 2 — Layout (L3 preview)

Print node list + planned positions as a table before generating XML:

```
# | Type | Content | Position (x,y)
1 | Start | Start | (360, 40)
2 | Process | Enter keyword | (360, 140)
3 | Decision | Keyword valid? | (360, 260)
...
```

User reviews layout → Phase 3.

### Phase 3 — Generate XML

Use `_templates/flowchart.drawio` as the frame, apply:
- Core shapes + colors per `drawio-conventions.md` sections 2–3
- Grid 20px, standard spacing section 4
- Orthogonal edges with explicit `exitX/exitY/entryX/entryY`, Yes/No labels on decision branches

### Phase 4 — Approval L1 → Write

## Mandatory rules

- Always exactly 1 Start and at least 1 End (multiple Ends allowed for different outcomes).
- Every Decision MUST label all outgoing branches (Yes/No, or specific case names).
- NO more than 15 nodes in one diagram — if the process is longer, split into child flowcharts + references (`docs/diagrams/{feature}/flowchart-{sub-slug}.drawio`).
- Consistent flow direction (`--direction` default `top-down`).

## Output

`docs/diagrams/{feature}/flowchart-{slug}.drawio`

## See also

Need sequence diagram, ERD, UML class, C4 model, or processes >15 steps that need auto-layout instead of manual child-flowchart splits → use `/diagram` (more powerful, requires draw.io desktop CLI).

## References

- @.claude/rules/drawio-conventions.md
- @.claude/rules/naming-conventions.md
- @.claude/rules/approval-gate.md
- @_templates/flowchart.drawio
- Brain: `DRAWIO-BRAIN.md`
