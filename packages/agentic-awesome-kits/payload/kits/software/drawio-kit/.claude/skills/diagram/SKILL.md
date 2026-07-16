---
name: diagram
description: Generate advanced .drawio diagrams (ERD, UML class/sequence, C4 model, ML/DL, mindmap/gantt/timeline via Mermaid, complex architecture) — including from existing code (Python/JS/Go/Rust), IaC (Terraform/Kubernetes/docker-compose, or live running infra), SQL DDL, or OpenAPI specs. Includes shape search across 10,000+ standard icons (AWS/Azure/GCP/Cisco/K8s/UML/BPMN), style presets, and PNG/SVG/PDF/JPG export via draw.io desktop CLI with vision self-check. Use when `/architecture` or `/flowchart` (hand-authored XML, no CLI dependency) is not enough — need high accuracy, vendor-specific icons, auto-layout for large diagrams, import from real code/infra, or image export.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
argument-hint: "<diagram description> [--type erd|uml|sequence|c4|architecture|ml|flowchart|mermaid] [--from-code <path>] [--from-sql <file>] [--from-iac <path>] [--style <preset>] [--export png|svg|pdf|jpg]"
---

# /diagram — Full-power draw.io diagrams (drawio-skill integration)

## Origin & license

This skill packages most of the capability of [drawio-skill](https://github.com/Agents365-ai/drawio-skill) (MIT License © Agents365-ai) — 28 Python scripts, shape search across 10,000+ icons, style-preset system, vision self-check workflow. The kit-root `scripts/`, `references/`, `styles/`, and `data/` trees are near-verbatim copies of upstream — **do NOT modify script internals**; invoke them via Bash only. Original license is preserved in `LICENSE-drawio-skill`.

**Differences from upstream behavior** (to match TechSphereX AI house conventions):
- Communication language: English (match project / user language if they write in another language).
- Approval: use this kit’s `approval-gate.md` (L1/L2/L3) instead of upstream’s free-form review loop — essentially equivalent (L3 ≈ upstream self-check + review loop, L1 ≈ “Plan” before writing files, L2 ≈ diff when editing an existing `.drawio`).
- Default style: **TechSphereX AI palette** (`drawio-conventions.md`) — NOT the upstream `default` preset — unless the user names another preset or has set a personal default.
- Output path: `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio` (per `drawio-conventions.md` section 7), not the current working directory.
- **No automatic image export** — default is write `.drawio` only (per “do NOT export static images unless the user explicitly asks” in `drawio-conventions.md`). Export a temporary PNG draft only when vision self-check is needed for a complex diagram, and always tell the user it is temporary.

## When to use `/diagram` instead of `/architecture` / `/flowchart`

| Need | Use which skill |
|---|---|
| Simple architecture/flowchart, no image export, no draw.io CLI dependency | `/architecture`, `/flowchart` |
| ERD from SQL DDL, sequence diagram, C4 model, UML class diagram | `/diagram --type erd\|sequence\|c4\|uml` |
| Reconstruct structure of a codebase (Python/JS/Go/Rust) or IaC / live running infra | `/diagram --from-code` / `--from-iac` |
| Vendor-specific icons (real AWS Lambda, real K8s pod, …) instead of generic rectangles | `/diagram` (use `shapesearch.py`) |
| Diagrams > 15 nodes needing auto-layout instead of hand-placed coordinates | `/diagram` (`autolayout.py` or CLI `--layout` ELK) |
| Export PNG/SVG/PDF, vision self-check before delivery | `/diagram` |
| Learn/apply a custom style (colors, fonts, shapes) from an existing file/image | `/diagram` (Learn flow — see `references/style-presets.md`) |

## Prerequisites (confirm on this machine)

- **draw.io desktop CLI:** installed, **v30.2.6** at `C:\Program Files\draw.io\draw.io.exe` — supports Mermaid→`.drawio` conversion and `--layout` ELK (both require v30+).
- **Graphviz (`dot`):** may be missing — `scripts/autolayout.py` needs Graphviz for layout. If missing, use CLI `--layout` ELK instead (see `references/autolayout.md`), or tell the user to install `graphviz` if they want `autolayout.py` specifically.
- Always resolve the real binary path before export commands — on this machine use `"C:\Program Files\draw.io\draw.io.exe"` (NOT bare `drawio`, which may not be on PATH).

## Input examples

```
/diagram microservices architecture: API Gateway, Auth/Order/Payment service, Kafka, Postgres, Redis
/diagram --type erd @schema.sql
/diagram --type sequence OAuth login flow: Client, Auth Server, Resource Server
/diagram --type c4 TOPO system (Context → Container → Component)
/diagram --from-code ./src --lang python --group          # import graph diagram
/diagram --from-iac ./infra --lang terraform               # architecture from Terraform, real cloud icons
/diagram redraw existing container architecture with style "corporate"
/diagram learn style from @docs/diagrams/container/architecture-overview.drawio name it "TechSphereX AI-brand"
/diagram export docs/diagrams/topo/architecture-overview.drawio to PNG
```

## Workflow

### Step 0 — Resolve style preset

Per `references/style-presets.md`:
1. Scan the user request for an explicit preset name (“use style X”, “in the X look”). The phrase `with X` does not count if X is a component name, not a style.
2. If none → check whether the user has set any preset `"default": true` (stored under `~/.drawio-skill/styles/` per upstream design, or an equivalent project directory if there is no shared home).
3. If none → **default to the TechSphereX AI palette** (`drawio-conventions.md` sections 2–6). Do NOT use drawio-skill’s built-in `default.json` unless the user explicitly passes `--style default`.
4. Valid preset → load from `styles/built-in/<name>.json` (built-ins: `default`, `corporate`, `handdrawn`, `colorblind-safe`, `dark`) or a user-saved file. Unknown preset name → report error, list available presets, do NOT silently fall back.

### Step 1 — Determine diagram type & clarify requirements

If important information is missing, ask at most 1–3 questions:
- **Diagram type** — see `references/diagram-types.md` to map the user’s wording (ERD/UML/Sequence/Architecture/ML/Flowchart/C4).
- **Data source** — free-form description, or existing code/SQL/IaC/OpenAPI?
- **Image export needed?** — default NO (`.drawio` only); ask if the user did not specify.

Skip questions when the request is already clear enough.

**Choose how to produce XML** (condensed from `references/toolbox.md`):

| User has | Use |
|---|---|
| Free-form description, standard type, no custom style, CLI ≥ v30 | Write `.mmd` (Mermaid) → convert with CLI (see `references/mermaid-authoring.md`) |
| Description needs custom style/icons, moderate node count (≤ 15) | Hand-author XML — read `references/xml-authoring.md` first |
| Large diagram / many nodes, need automatic coordinates | `scripts/autolayout.py graph.json -o out.drawio` (needs Graphviz) or CLI `--layout` |
| Python/JS/Go/Rust project | `scripts/pyimports.py` / `jsimports.py` / `goimports.py` / `rustimports.py` (`--group` to frame by package) |
| Python class hierarchy | `scripts/pyclasses.py` |
| Terraform / Kubernetes / docker-compose (declared) | `scripts/tfimports.py` / `k8simports.py` / `composeimports.py` — official cloud icons auto-resolve |
| Infra that is LIVE / RUNNING | `terraform show -json` → `scripts/tfstate.py`; `docker inspect $(docker ps -q)` → `scripts/dockerimports.py`; `kubectl get ... -o json` → `scripts/k8simports.py` (see `references/live-infra.md`) |
| SQL DDL (`CREATE TABLE`) | `scripts/sqlerd.py schema.sql -o out.drawio` |
| OpenAPI/Swagger spec | `scripts/openapiimports.py spec.yaml -o graph.json` (color by HTTP method) |
| Sequence diagram (participants + messages) | `scripts/seqlayout.py seq.json -o out.drawio` (no Graphviz; deterministic lifeline/activation) |
| C4 model (Context→Container→Component) | `scripts/c4.py c4.json -o out.drawio` (multi-page, drill-down links) |
| Vendor-specific icons (AWS/Azure/GCP/Cisco/K8s/UML/BPMN) | `scripts/shapesearch.py "<keywords>"` for exact `style=` — do NOT guess |
| AI/LLM brand logos (OpenAI, Claude, Gemini…) | `scripts/aiicons.py "<brand>"` |

### Step 2 — L3 Preview (per `approval-gate.md`)

- **Hand-authored / small diagrams:** list nodes/edges as a table (like `/architecture`, `/flowchart`) so the user reviews layout before full XML.
- **Script-generated diagrams (autolayout/importer/sqlerd/seqlayout/c4):**
  1. Run the script to produce `.drawio`.
  2. Run `scripts/validate.py <file>.drawio` — structural lint (dangling edges, duplicate ids, cell overlap) before any image export.
  3. If a preview is needed: export a PNG draft (**without** `-e`, `--width 2000` so it stays under the vision API’s 2576px limit) — tell the user this is a temporary review image, not the final deliverable.
  4. If the model has vision: read the PNG and check against common defects (overlapping shapes, clipped labels, unconnected arrows, nodes outside the page, crossing edges) — at most 2 self-fix rounds.
  5. Show the image to the user; ask Approve / Edit: … / Cancel. Localized edits (color, add/remove node, rename label) → edit XML in place, keep layout. Full direction/layout changes → regenerate from scratch.
  6. At most 5 review loops — then suggest the user open the file in draw.io desktop for manual polish.

### Step 3 — L1 Approval → Write

Write `.drawio` to `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio`. If the file already exists → L2 diff before overwrite.

### Step 4 — Export (only when the user asks or passes `--export`)

Use the confirmed binary (`"C:\Program Files\draw.io\draw.io.exe"` on this machine):

```bash
# Preview / self-check (Step 2) — NO -e
"C:\Program Files\draw.io\draw.io.exe" -x -f png --width 2000 -o preview.png input.drawio

# Final export — WITH -e so the .drawio.png stays re-editable in draw.io
"C:\Program Files\draw.io\draw.io.exe" -x -f png -e -s 2 -o output.drawio.png input.drawio
python scripts/repair_png.py output.drawio.png   # REQUIRED after every -e PNG export (CLI may omit IEND chunk)

# SVG / PDF (no IEND issue; -e is safe)
"C:\Program Files\draw.io\draw.io.exe" -x -f svg -e -o output.svg input.drawio
"C:\Program Files\draw.io\draw.io.exe" -x -f pdf -e -o output.pdf input.drawio
```

Report paths for both the source `.drawio` and any exported images.

## Extended features (invoke when the user needs them)

| Need | Script |
|---|---|
| Compare two diagram versions / detect infra drift | `scripts/drawiodiff.py old.drawio new.drawio -o diff.json` |
| Architecture evolution over git history | `scripts/timelapse.py <dir> --importer pyimports` |
| Explain a `.drawio` file as Markdown (for README/PR) | `scripts/explain.py diagram.drawio -o out.md` |
| Convert diagrams (esp. multi-page C4) to PowerPoint | `scripts/drawio2pptx.py c4.drawio -o deck.pptx` (needs `pip install python-pptx`) |
| Interactive HTML viewer (pan/zoom/search, no draw.io needed) | `scripts/drawiohtml.py diagram.drawio -o viewer.html` |
| SVG with animated “flow” on edges (dynamic data-flow) | `scripts/svgflow.py diagram.drawio -o flow.svg` |
| Convert `.drawio` → Mermaid text (embed in Markdown) | `scripts/drawio2mermaid.py diagram.drawio --fenced -o out.md` |
| Color a diagram by metrics (cost/latency/traffic) | `scripts/heatmap.py diagram.drawio -m metrics.csv --palette heat` |
| No draw.io CLI; view in the browser | `scripts/encode_drawio_url.py input.drawio` (or `--edit` for the editor) — nothing is uploaded; everything lives in the URL fragment |

## Mandatory rules

- Default: **no image export** — write `.drawio` only, unless the user asks or vision self-check truly needs a temporary image (and say so).
- Default style = TechSphereX AI palette (`drawio-conventions.md`), not upstream preset, unless another preset is specified.
- Prefer core shapes; vendor icons via `shapesearch.py` — MUST note that the matching shape library must be enabled in draw.io when using non-core stencils.
- Do NOT modify logic inside `scripts/`, `references/`, or `data/` — third-party MIT source; invoke via Bash only. For different behavior, wrap/override at this SKILL.md layer; do not patch upstream scripts.
- After every `-e` PNG export, immediately run `scripts/repair_png.py`.
- After every `autolayout.py`/importer run, MUST run `scripts/validate.py` before image export or completion report.

## Output

- `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio` — primary source file.
- Exported images (if requested): same directory, double extension `.drawio.png` / `.svg` / `.pdf` (embedded XML so they remain editable in draw.io).

## References

- @.claude/rules/approval-gate.md
- @.claude/rules/drawio-conventions.md
- @.claude/rules/naming-conventions.md
- Brain: `DRAWIO-BRAIN.md`
- @references/toolbox.md — full map of 28 scripts; read when unsure which to use
- @references/diagram-types.md — shape/edge/layout presets by diagram type
- @references/xml-authoring.md — before hand-authoring XML
- @references/mermaid-authoring.md — when using Mermaid → CLI convert
- @references/style-presets.md — manage/apply style presets, Learn flow
- @references/style-extraction.md — style extraction for Learn
- @references/shapes.md — shape style cheatsheet + how to use `shapesearch.py`
- @references/autolayout.md — graph.json format for `autolayout.py`
- @references/live-infra.md — diagram live running infra (Terraform state/Docker/K8s live)
- @references/troubleshooting.md — export failures, vision rejecting images, bad layout
- @LICENSE-drawio-skill — original MIT license for the integrated code
