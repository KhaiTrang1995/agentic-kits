---
name: diagram
description: Sinh mọi loại sơ đồ .drawio nâng cao (ERD, UML class/sequence, C4 model, ML/DL, mindmap/gantt/timeline qua Mermaid, kiến trúc phức tạp) — kể cả sinh từ code có sẵn (Python/JS/Go/Rust), từ hạ tầng IaC (Terraform/Kubernetes/docker-compose, hoặc hạ tầng đang chạy thật), từ SQL DDL, hoặc từ OpenAPI spec. Có shape search 10.000+ icon chuẩn (AWS/Azure/GCP/Cisco/K8s/UML/BPMN), style preset, xuất PNG/SVG/PDF/JPG qua draw.io desktop CLI kèm tự kiểm tra bằng vision. Dùng khi `/architecture` hoặc `/flowchart` (dựng tay XML, không phụ thuộc CLI) không đủ — cần độ chính xác cao, icon hãng cụ thể, auto-layout cho sơ đồ lớn, import từ code/hạ tầng thật, hoặc xuất ảnh.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
argument-hint: "<mô tả sơ đồ> [--type erd|uml|sequence|c4|architecture|ml|flowchart|mermaid] [--from-code <path>] [--from-sql <file>] [--from-iac <path>] [--style <preset>] [--export png|svg|pdf|jpg]"
---

# /diagram — Sơ đồ draw.io toàn năng (tích hợp drawio-skill)

## Nguồn gốc & Bản quyền

Skill này đóng gói lại phần lớn năng lực của [drawio-skill](https://github.com/Agents365-ai/drawio-skill) (MIT License © Agents365-ai) — 28 script Python, shape search 10.000+ icon, hệ thống style preset, quy trình tự kiểm tra bằng vision. File `scripts/`, `references/`, `styles/`, `data/` ở root kit là bản sao gần như nguyên vẹn từ dự án gốc — **KHÔNG sửa logic bên trong các script**, chỉ gọi qua Bash. Giấy phép gốc giữ nguyên ở `LICENSE-drawio-skill`.

**Khác biệt so với hành vi gốc** (để khớp house convention TechSphereX AI):
- Ngôn ngữ giao tiếp: tiếng Việt.
- Approval: dùng `approval-gate.md` (L1/L2/L3) của kit này thay vì review-loop tự do của bản gốc — về bản chất tương đương (L3 ≈ self-check + review loop gốc, L1 ≈ bước "Plan" trước ghi file, L2 ≈ diff khi sửa file `.drawio` đã có).
- Style mặc định: **TechSphereX AI palette** (`drawio-conventions.md`) — KHÔNG phải preset `default` gốc — trừ khi user nêu tên preset khác hoặc đã đặt preset default riêng.
- Output path: `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio` (theo `drawio-conventions.md` mục 7), không phải thư mục làm việc hiện tại.
- **Không tự động xuất ảnh** — mặc định chỉ ghi `.drawio` (theo rule "KHÔNG xuất ảnh tĩnh trừ khi user yêu cầu riêng" của `drawio-conventions.md`). Chỉ xuất PNG draft nội bộ khi cần bước tự-kiểm-tra bằng vision cho sơ đồ phức tạp, và luôn nói rõ với user đây là bước tạm.

## Khi nào dùng `/diagram` thay vì `/architecture` / `/flowchart`

| Cần gì | Dùng skill nào |
|---|---|
| Kiến trúc/flowchart đơn giản, không cần export ảnh, không phụ thuộc draw.io CLI | `/architecture`, `/flowchart` |
| ERD từ SQL DDL, sequence diagram, C4 model, class diagram UML | `/diagram --type erd\|sequence\|c4\|uml` |
| Vẽ lại cấu trúc 1 codebase (Python/JS/Go/Rust) hoặc hạ tầng IaC/hạ tầng đang chạy thật | `/diagram --from-code` / `--from-iac` |
| Icon hãng cụ thể (AWS Lambda thật, K8s pod thật...) thay vì hình chữ nhật chung chung | `/diagram` (dùng `shapesearch.py`) |
| Sơ đồ > 15 node cần auto-layout thay vì đặt tay toạ độ | `/diagram` (dùng `autolayout.py` hoặc `--layout` ELK của CLI) |
| Xuất PNG/SVG/PDF, cần tự kiểm tra bằng vision trước khi giao | `/diagram` |
| Học/áp style riêng (màu, font, shape) từ 1 file/ảnh có sẵn | `/diagram` (Learn flow, xem `references/style-presets.md`) |

## Prerequisites (đã xác nhận trên máy này)

- **draw.io desktop CLI:** đã cài, **v30.2.6** tại `C:\Program Files\draw.io\draw.io.exe` — đủ điều kiện dùng Mermaid→`.drawio` conversion và `--layout` ELK (cả hai chỉ có từ v30).
- **Graphviz (`dot`):** chưa cài — `scripts/autolayout.py` cần Graphviz để tính layout. Thiếu thì dùng `--layout` ELK có sẵn trong CLI thay thế (xem `references/autolayout.md`), hoặc báo user cài `graphviz` nếu muốn dùng đúng `autolayout.py`.
- Luôn resolve đường dẫn binary thật trước khi chạy lệnh xuất ảnh — trên máy này dùng `"C:\Program Files\draw.io\draw.io.exe"` (KHÔNG phải lệnh `drawio` trần vì chưa chắc có trong PATH).

## Input examples

```
/diagram kiến trúc microservices: API Gateway, Auth/Order/Payment service, Kafka, Postgres, Redis
/diagram --type erd @schema.sql
/diagram --type sequence luồng đăng nhập OAuth: Client, Auth Server, Resource Server
/diagram --type c4 hệ thống TOPO (Context → Container → Component)
/diagram --from-code ./src --lang python --group          # sơ đồ import graph
/diagram --from-iac ./infra --lang terraform               # kiến trúc từ Terraform, icon cloud thật
/diagram vẽ lại kiến trúc container hiện có với style "corporate"
/diagram học style từ @docs/diagrams/container/architecture-overview.drawio đặt tên "TechSphereX AI-brand"
/diagram xuất docs/diagrams/topo/architecture-overview.drawio ra PNG
```

## Quy trình

### Bước 0 — Resolve style preset

Theo `references/style-presets.md`:
1. Quét câu user tìm tên preset rõ ràng ("dùng style X", "theo phong cách X"). Cụm `với X` không tính nếu X là tên component, không phải style.
2. Không có → kiểm tra có preset nào user đã đặt `"default": true` chưa (lưu ở `~/.drawio-skill/styles/` theo thiết kế gốc, hoặc thư mục tương đương trong project nếu user không có home directory dùng chung).
3. Không có preset nào → **mặc định dùng TechSphereX AI palette** (`drawio-conventions.md` mục 2-6), KHÔNG dùng preset `default.json` gốc của drawio-skill trừ khi user gọi đích danh `--style default`.
4. Preset hợp lệ → nạp từ `styles/built-in/<name>.json` (built-in: `default`, `corporate`, `handdrawn`, `colorblind-safe`, `dark`) hoặc file user tự lưu. Tên preset không tồn tại → báo lỗi, liệt kê preset có sẵn, KHÔNG âm thầm rơi về mặc định.

### Bước 1 — Xác định loại sơ đồ & làm rõ yêu cầu

Nếu thiếu thông tin quan trọng, hỏi tối đa 1-3 câu:
- **Loại sơ đồ** — xem `references/diagram-types.md` để map theo cách user diễn đạt (ERD/UML/Sequence/Architecture/ML/Flowchart/C4).
- **Nguồn dữ liệu** — mô tả bằng lời, hay từ code/SQL/IaC/OpenAPI có sẵn?
- **Có cần xuất ảnh không** — mặc định KHÔNG (chỉ `.drawio`), hỏi rõ nếu user không nêu.

Bỏ qua hỏi nếu request đã đủ rõ ràng.

**Chọn cách sinh XML** (rút gọn từ `references/toolbox.md`):

| User có gì | Dùng gì |
|---|---|
| Mô tả bằng lời, loại chuẩn không cần style riêng, CLI ≥ v30 | Viết `.mmd` (Mermaid) → convert bằng CLI (xem `references/mermaid-authoring.md`) |
| Mô tả cần style/icon riêng, số node vừa phải (≤ 15) | Viết tay XML — đọc `references/xml-authoring.md` trước |
| Sơ đồ lớn/nhiều node, cần đặt toạ độ tự động | `scripts/autolayout.py graph.json -o out.drawio` (cần Graphviz) hoặc CLI `--layout` |
| Project Python/JS/Go/Rust | `scripts/pyimports.py` / `jsimports.py` / `goimports.py` / `rustimports.py` (`--group` để đóng khung theo package) |
| Class hierarchy Python | `scripts/pyclasses.py` |
| Terraform / Kubernetes / docker-compose (khai báo) | `scripts/tfimports.py` / `k8simports.py` / `composeimports.py` — icon cloud chính thức tự resolve |
| Hạ tầng đang CHẠY THẬT | `terraform show -json` → `scripts/tfstate.py`; `docker inspect $(docker ps -q)` → `scripts/dockerimports.py`; `kubectl get ... -o json` → `scripts/k8simports.py` (xem `references/live-infra.md`) |
| SQL DDL (`CREATE TABLE`) | `scripts/sqlerd.py schema.sql -o out.drawio` |
| OpenAPI/Swagger spec | `scripts/openapiimports.py spec.yaml -o graph.json` (màu theo HTTP method) |
| Sequence diagram (participants + messages) | `scripts/seqlayout.py seq.json -o out.drawio` (không cần Graphviz, tính toán lifeline/activation xác định) |
| C4 model (Context→Container→Component) | `scripts/c4.py c4.json -o out.drawio` (multi-page, có link drill-down) |
| Cần icon hãng cụ thể (AWS/Azure/GCP/Cisco/K8s/UML/BPMN) | `scripts/shapesearch.py "<từ khoá>"` để lấy đúng `style=` — KHÔNG đoán |
| Cần logo brand AI/LLM (OpenAI, Claude, Gemini...) | `scripts/aiicons.py "<brand>"` |

### Bước 2 — L3 Preview (theo `approval-gate.md`)

- **Sơ đồ dựng tay/nhỏ:** liệt kê node/edge dạng bảng (giống `/architecture`, `/flowchart`) để user duyệt bố cục trước khi sinh XML đầy đủ.
- **Sơ đồ sinh từ script (autolayout/importer/sqlerd/seqlayout/c4):**
  1. Chạy script sinh `.drawio`.
  2. Chạy `scripts/validate.py <file>.drawio` — lint cấu trúc (dangling edge, id trùng, cell overlap) trước khi xuất ảnh.
  3. Nếu cần xem trước: xuất PNG draft (**không** `-e`, `--width 2000` để không vượt giới hạn 2576px của vision API) — nói rõ với user đây là ảnh tạm để duyệt, chưa phải file cuối.
  4. Nếu model có vision: tự đọc PNG, so với bảng lỗi thường gặp (chồng shape, nhãn bị cắt, mũi tên không nối, node lệch khung, edge chồng nhau) — tối đa 2 vòng tự sửa.
  5. Hiện ảnh cho user, hỏi Đồng ý / Sửa: ... / Hủy. Sửa đơn lẻ (đổi màu, thêm/xoá node, đổi label) → sửa trực tiếp XML, giữ layout. Sửa toàn bộ hướng/layout → sinh lại từ đầu.
  6. Tối đa 5 vòng lặp — sau đó đề xuất user tự mở file trong draw.io desktop để tinh chỉnh tay.

### Bước 3 — L1 Approval → Write

Ghi `.drawio` vào `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio`. Nếu file đã tồn tại → L2 diff trước khi ghi đè.

### Bước 4 — Export (chỉ khi user yêu cầu hoặc dùng `--export`)

Dùng binary đã xác nhận (`"C:\Program Files\draw.io\draw.io.exe"` trên máy này):

```bash
# Preview / self-check (Bước 2) — KHÔNG -e
"C:\Program Files\draw.io\draw.io.exe" -x -f png --width 2000 -o preview.png input.drawio

# Xuất cuối cùng — CÓ -e để giữ file .drawio.png vẫn mở lại sửa được trong draw.io
"C:\Program Files\draw.io\draw.io.exe" -x -f png -e -s 2 -o output.drawio.png input.drawio
python scripts/repair_png.py output.drawio.png   # BẮT BUỘC sau mọi lần xuất PNG có -e (CLI cắt thiếu IEND chunk)

# SVG / PDF (không bị lỗi IEND, -e an toàn)
"C:\Program Files\draw.io\draw.io.exe" -x -f svg -e -o output.svg input.drawio
"C:\Program Files\draw.io\draw.io.exe" -x -f pdf -e -o output.pdf input.drawio
```

Báo đường dẫn cả file `.drawio` gốc lẫn file ảnh đã xuất.

## Các tính năng mở rộng khác (gọi khi user cần)

| Nhu cầu | Script |
|---|---|
| So sánh 2 phiên bản sơ đồ / phát hiện thay đổi hạ tầng | `scripts/drawiodiff.py old.drawio new.drawio -o diff.json` |
| Xem tiến hoá kiến trúc theo lịch sử git | `scripts/timelapse.py <dir> --importer pyimports` |
| Diễn giải 1 file `.drawio` thành Markdown (cho README/PR) | `scripts/explain.py diagram.drawio -o out.md` |
| Chuyển sơ đồ (đặc biệt C4 nhiều trang) thành PowerPoint | `scripts/drawio2pptx.py c4.drawio -o deck.pptx` (cần `pip install python-pptx`) |
| Viewer HTML tương tác (pan/zoom/search, không cần draw.io) | `scripts/drawiohtml.py diagram.drawio -o viewer.html` |
| SVG có hiệu ứng "chạy" trên các mũi tên (data-flow động) | `scripts/svgflow.py diagram.drawio -o flow.svg` |
| Chuyển `.drawio` → Mermaid text (nhúng vào Markdown) | `scripts/drawio2mermaid.py diagram.drawio --fenced -o out.md` |
| Tô màu sơ đồ theo số liệu (cost/latency/traffic) | `scripts/heatmap.py diagram.drawio -m metrics.csv --palette heat` |
| Không có draw.io CLI, cần xem trên trình duyệt | `scripts/encode_drawio_url.py input.drawio` (hoặc `--edit` để mở editor) — không upload gì lên server, toàn bộ nằm trong URL fragment |

## Rules bắt buộc

- Mặc định **không xuất ảnh** — chỉ ghi `.drawio`, trừ khi user yêu cầu hoặc bước tự-kiểm-tra bằng vision thực sự cần ảnh tạm (và phải nói rõ đó là ảnh tạm).
- Style mặc định = TechSphereX AI palette (`drawio-conventions.md`), không phải preset gốc, trừ khi có preset khác được chỉ định.
- Core shape ưu tiên; icon vendor cụ thể qua `shapesearch.py`, PHẢI ghi chú cần bật shape library tương ứng trong draw.io nếu dùng stencil ngoài core.
- KHÔNG sửa logic bên trong các file ở `scripts/`, `references/`, `data/` — đây là mã nguồn mở bên thứ ba (MIT), chỉ gọi qua Bash. Nếu cần hành vi khác, wrap/override ở tầng SKILL.md này, không patch trực tiếp script gốc.
- Sau `-e` PNG luôn chạy `scripts/repair_png.py` ngay sau đó.
- Mọi lần chạy `autolayout.py`/importer xong PHẢI chạy `scripts/validate.py` trước khi xuất ảnh hoặc ghi báo cáo hoàn tất.

## Output

- `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio` — file nguồn chính.
- Ảnh xuất (nếu có yêu cầu): cùng thư mục, đuôi kép `.drawio.png` / `.svg` / `.pdf` (embed XML để vẫn sửa được trong draw.io).

## References

- @.claude/rules/approval-gate.md
- @.claude/rules/drawio-conventions.md
- @.claude/rules/naming-conventions.md
- Brain: `DRAWIO-BRAIN.md`
- @references/toolbox.md — bản đồ đầy đủ 28 script, đọc khi chưa chắc dùng script nào
- @references/diagram-types.md — preset shape/edge/layout theo loại sơ đồ user nêu tên
- @references/xml-authoring.md — trước khi viết tay XML
- @references/mermaid-authoring.md — khi dùng đường Mermaid → CLI convert
- @references/style-presets.md — quản lý/áp dụng style preset, Learn flow
- @references/style-extraction.md — quy trình trích style khi Learn
- @references/shapes.md — cheatsheet style shape + cách dùng `shapesearch.py`
- @references/autolayout.md — định dạng graph.json cho `autolayout.py`
- @references/live-infra.md — vẽ hạ tầng đang chạy thật (Terraform state/Docker/K8s live)
- @references/troubleshooting.md — export lỗi, vision từ chối ảnh, layout sai
- @LICENSE-drawio-skill — giấy phép gốc MIT của phần mã tích hợp
