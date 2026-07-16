# Naming Conventions — Draw.io Kit

## 1. File names

| Object | Format | Example |
|--------|--------|---------|
| Architecture | `architecture-{slug}.drawio` | `architecture-topo-overview.drawio` |
| Flowchart | `flowchart-{slug}.drawio` | `flowchart-leave-approval.drawio` |
| ERD | `erd-{slug}.drawio` | `erd-booking-core.drawio` |
| Advanced | `{type}-{slug}.drawio` | `sequence-oauth-login.drawio`, `c4-topo-context.drawio` |
| Slug | kebab-case, ASCII, ≤40 chars | `oauth-login`, `order-payment` |

## 2. Paths

| Kind | Path |
|------|------|
| All diagrams | `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio` |
| Feature slug | kebab-case folder under `docs/diagrams/` |

`feature` = domain/module (e.g. `booking`, `topo`, `auth`). If the user does not specify → derive from the description or ask once.

## 3. Page / cell IDs

- `diagram name` = short English title
- `mxCell id` = unique strings (`n1`, `n2`, `e1`…) — never reuse

## 4. Frontmatter note (optional markdown companion)

When writing an accompanying note:

```yaml
---
type: drawio-diagram
diagram_type: architecture|flowchart|erd|sequence|c4|...
feature: booking
slug: overview
file: docs/diagrams/booking/architecture-overview.drawio
updated: 2026-07-16
---
```
