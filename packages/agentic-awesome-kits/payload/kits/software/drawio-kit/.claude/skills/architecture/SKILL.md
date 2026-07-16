---
name: architecture
description: Generate system architecture .drawio diagrams — client, service, database, external systems with standard icons and clear connections.
user-invocable: true
argument-hint: "<system description> [--cloud aws|azure|gcp|generic]"
---

# /architecture — Generate Architecture Diagram (draw.io)

## When to use

Visualize system architecture (microservice, layered architecture, network topology) for design docs, ADRs, or stakeholder presentations.

## Input examples

```
/architecture TOPO system: Angular SPA → API Gateway → 3 microservices (Container, Booking, Auth) → SQL Server
/architecture --cloud azure deploy architecture: App Service, Azure SQL, Blob Storage, Front Door
/architecture integration flow with Customs system via REST API
```

## Workflow

### Phase 1 — Identify components & trust boundaries

List components by group:
- **Client**: web app, mobile app, external user (actor)
- **Edge**: load balancer, API gateway, CDN
- **Service**: backend service/microservice (process box)
- **Data**: database, cache, message queue (cylinder/tape)
- **External**: third-party system (cloud shape)

Identify trust boundaries (internet ↔ DMZ ↔ internal) — draw with container boxes `dashed=1;fillColor=none;`.

### Phase 2 — Layout (L3 preview)

Print a block diagram as table/ASCII before generating XML — confirm which groups sit inside which boundaries and the data-flow direction.

### Phase 3 — Generate XML

Use `_templates/architecture.drawio` as the frame:
- Default to **core shapes** (`ellipse+shape=cloud`, `shape=cylinder3`, `shape=umlActor`, `rounded=1`) — opens on any machine.
- If `--cloud aws|azure|gcp`: add matching stencils (`shape=mxgraph.aws4.*`, `shape=mxgraph.azure.*`) and **note clearly in the output** that the user must enable that shape library in draw.io.
- Group by trust boundary with surrounding container boxes.
- Primary data flow left→right or top→bottom, orthogonal arrows.

### Phase 4 — Approval L1 → Write

## Mandatory rules

- Every external system/3rd-party MUST be visually distinct with gray (`fillColor=#f5f5f5;strokeColor=#666666;`).
- Databases always use `shape=cylinder3` — NEVER use a rounded rectangle for storage.
- If there are > 10 components, group by layer/boundary with container boxes for readability instead of leaving all at the same level.
- Small legend in the lower corner if using > 3 color types, explaining each color.

## Output

`docs/diagrams/{feature}/architecture-{slug}.drawio`

## See also

Need real vendor icons (AWS/Azure/GCP, not core shapes), auto-layout for >15 components, draw from real Terraform/K8s/docker-compose, or export PNG/SVG/PDF → use `/diagram` (more powerful, requires draw.io desktop CLI).

## References

- @.claude/rules/drawio-conventions.md
- @.claude/rules/naming-conventions.md
- @.claude/rules/approval-gate.md
- @_templates/architecture.drawio
- Brain: `DRAWIO-BRAIN.md`
