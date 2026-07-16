# Draw.io (diagrams.net) Conventions — TechSphereX AI

> Every diagram-generating skill MUST produce `.drawio` (mxGraph XML) that opens directly in draw.io Desktop / diagrams.net / the VS Code extension — do NOT export static images (PNG/SVG) unless the user explicitly asks.

## 1. Standard `.drawio` file structure

```xml
<mxfile host="app.diagrams.net" modified="{{iso_datetime}}" agent="TechSphereX AI-AI" version="24.0.0" type="device">
  <diagram name="{{page_name}}" id="{{page_id}}">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" tooltips="1"
        connect="1" arrows="1" fold="1" page="1" pageScale="1"
        pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- every vertex/edge has parent="1" -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

- `<mxCell id="0">` and `id="1"` MUST always be present — required mxGraph root layers; missing them means the file will not open.
- Each vertex (shape) is one `<mxCell vertex="1" parent="1">` with `<mxGeometry x y width height as="geometry"/>`.
- Each edge (connector) is one `<mxCell edge="1" parent="1" source="{{id}}" target="{{id}}">` with `<mxGeometry relative="1" as="geometry"/>`.
- Every cell `id` MUST be unique within the file.

## 2. Use core shapes only — open on EVERY machine

draw.io has two shape kinds:
1. **Core shapes** — always render; no extra shape library. **Prefer these.**
2. **Stencil libraries** (AWS, Azure, GCP, Network, mscae…) — user must enable “More Shapes” in draw.io; if off, shapes show as gray placeholders. Use only when the user explicitly wants a cloud-provider icon, and MUST note in the output that the matching shape library needs to be enabled.

**Core shapes required for common icons (no complex `shape=mxgraph.*` style prefix):**

| Meaning | `style` attribute |
|---------|--------------------|
| Process / step | `rounded=1;whiteSpace=wrap;html=1;` |
| Decision (branch) | `rhombus;whiteSpace=wrap;html=1;` |
| Start / End | `ellipse;whiteSpace=wrap;html=1;` |
| Database | `shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;` |
| Cloud / external service | `ellipse;shape=cloud;whiteSpace=wrap;html=1;` |
| Actor / User | `shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;` |
| Document | `shape=document;whiteSpace=wrap;html=1;` |
| Input/Output | `shape=parallelogram;whiteSpace=wrap;html=1;fixedSize=1;` |
| Manual operation | `shape=trapezoid;whiteSpace=wrap;html=1;fixedSize=1;` |
| Preparation | `shape=hexagon;whiteSpace=wrap;html=1;fixedSize=1;` |
| Delay/Tape | `shape=tape;whiteSpace=wrap;html=1;` |
| Display/Screen | `shape=display;whiteSpace=wrap;html=1;` |
| Container/Group box | `rounded=0;whiteSpace=wrap;html=1;fillColor=none;dashed=1;` (group components) |

If the user asks for a specific cloud-provider icon (AWS EC2, Azure VM…), you may add `shape=mxgraph.aws4.ec2` / `shape=mxgraph.azure.virtual_machines` / `shape=mxgraph.networks.server` — but ALWAYS note: *"This icon requires the matching shape library in draw.io (Extras > Edit Diagram is not enough — open More Shapes and enable AWS/Azure/Network)."*

## 3. Colors by type (TechSphereX AI palette)

| Node type | fillColor | strokeColor |
|-----------|-----------|-------------|
| Start/End | `#d5e8d4` | `#82b366` (green) |
| Process | `#dae8fc` | `#6c8ebf` (blue) |
| Decision | `#ffe6cc` | `#d79b00` (orange) |
| Database/Storage | `#e1d5e7` | `#9673a6` (purple) |
| External/Cloud | `#f5f5f5` | `#666666` (gray) |
| Error/Critical | `#f8cecc` | `#b85450` (red) |

Full style example: `rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=12;fontFamily=Segoe UI;`

## 4. Layout & spacing — disciplined grid

- **20px grid** (`gridSize="10"` but align to multiples of 20 for clarity: x, y always divisible by 20).
- Standard sizes: process box `160x60`, decision `160x80`, start/end `120x60`, database `100x80`.
- Horizontal gap between nodes in the same row: at least `40px`. Vertical gap between rows: at least `60px`.
- Primary flow top→bottom or left→right — consistent within one diagram; do NOT reverse direction mid-diagram.
- Do NOT place two nodes on top of each other (check coordinates before generating XML).

## 5. Connections (edges) — orthogonal, clear anchors

- Standard style: `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;`
- `exitX/exitY` and `entryX/entryY` MUST be declared explicitly (0/0.5/1) — avoid draw.io picking arbitrary anchors on reopen.
- Edge labels (Yes/No for decisions) go on the edge cell’s `value` attribute — do NOT create separate floating text boxes over connectors.
- One-way arrows: `startArrow=none;endArrow=block;` (default).

## 6. Font & text

- `fontFamily=Segoe UI;fontSize=12;` for normal nodes; `fontSize=14;fontStyle=1` (bold) for group titles.
- Node text MUST stay short (≤ 4 lines) — longer detail goes in `tooltip` (`<mxCell ... tooltip="...">` is not a standard attribute; use a `<UserObject>` wrapper if custom data is needed, but default to simple short in-node text).

## 7. File naming & location

- `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio`
- Examples: `docs/diagrams/container/flowchart-search-flow.drawio`, `docs/diagrams/topo/architecture-overview.drawio`

## 8. Checks before Write

- XML MUST be well-formed (correct closing tags; escape `<`, `>`, `&`, `"` in `value`/`style` as `&lt;`, `&gt;`, `&amp;`, `&quot;`).
- Every edge `source`/`target` MUST point to an `id` that exists in the file.
- No duplicate `id`s.
