# Draw.io (diagrams.net) Conventions — TechSphereX AI

> Mọi skill sinh sơ đồ PHẢI xuất định dạng `.drawio` (mxGraph XML) mở được trực tiếp bằng draw.io Desktop / diagrams.net / VS Code extension — KHÔNG xuất ảnh tĩnh (PNG/SVG) trừ khi user yêu cầu riêng.

## 1. Cấu trúc file `.drawio` chuẩn

```xml
<mxfile host="app.diagrams.net" modified="{{iso_datetime}}" agent="TechSphereX AI-AI" version="24.0.0" type="device">
  <diagram name="{{page_name}}" id="{{page_id}}">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" tooltips="1"
        connect="1" arrows="1" fold="1" page="1" pageScale="1"
        pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- mọi vertex/edge có parent="1" -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

- `<mxCell id="0">` và `id="1"` PHẢI luôn có — đây là root layer bắt buộc của mxGraph, thiếu sẽ không mở được.
- Mỗi vertex (hình) là 1 `<mxCell vertex="1" parent="1">` kèm `<mxGeometry x y width height as="geometry"/>`.
- Mỗi edge (mũi tên nối) là 1 `<mxCell edge="1" parent="1" source="{{id}}" target="{{id}}">` kèm `<mxGeometry relative="1" as="geometry"/>`.
- `id` mỗi cell PHẢI duy nhất trong toàn file.

## 2. CHỈ dùng Core Shapes — đảm bảo mở được ở MỌI máy

draw.io có 2 loại shape:
1. **Core shape** — luôn render được, không cần bật thêm shape library. **Ưu tiên dùng loại này.**
2. **Stencil library** (AWS, Azure, GCP, Network, mscae...) — cần user bật "More Shapes" trong draw.io, nếu tắt sẽ hiện ô xám placeholder. Chỉ dùng khi user yêu cầu rõ icon cloud provider cụ thể, và PHẢI ghi chú trong output rằng cần bật shape library tương ứng.

**Core shape bắt buộc dùng cho icon phổ biến (không cần style prefix `shape=mxgraph.*` phức tạp):**

| Ý nghĩa | `style` attribute |
|---------|--------------------|
| Process / bước xử lý | `rounded=1;whiteSpace=wrap;html=1;` |
| Decision (rẽ nhánh) | `rhombus;whiteSpace=wrap;html=1;` |
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
| Container/Group box | `rounded=0;whiteSpace=wrap;html=1;fillColor=none;dashed=1;` (bao nhóm component) |

Nếu user yêu cầu icon cloud provider cụ thể (AWS EC2, Azure VM...), có thể dùng thêm `shape=mxgraph.aws4.ec2` / `shape=mxgraph.azure.virtual_machines` / `shape=mxgraph.networks.server` — nhưng LUÔN ghi chú: *"Icon này cần bật shape library tương ứng trong draw.io (Extras > Edit Diagram không đủ — vào More Shapes để bật AWS/Azure/Network)."*

## 3. Màu sắc theo loại (TechSphereX AI palette)

| Loại node | fillColor | strokeColor |
|-----------|-----------|-------------|
| Start/End | `#d5e8d4` | `#82b366` (xanh lá) |
| Process | `#dae8fc` | `#6c8ebf` (xanh dương) |
| Decision | `#ffe6cc` | `#d79b00` (cam) |
| Database/Storage | `#e1d5e7` | `#9673a6` (tím) |
| External/Cloud | `#f5f5f5` | `#666666` (xám) |
| Error/Critical | `#f8cecc` | `#b85450` (đỏ) |

Style đầy đủ ví dụ: `rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=12;fontFamily=Segoe UI;`

## 4. Layout & Spacing — Grid kỷ luật

- **Grid 20px** (`gridSize="10"` nhưng canh theo bội số 20 cho gọn: x, y luôn chia hết cho 20).
- Kích thước chuẩn: process box `160x60`, decision `160x80`, start/end `120x60`, database `100x80`.
- Khoảng cách ngang giữa 2 node cùng hàng: tối thiểu `40px`. Khoảng cách dọc giữa 2 hàng: tối thiểu `60px`.
- Flow chính đi từ trên xuống dưới hoặc trái sang phải — nhất quán trong 1 diagram, KHÔNG đảo hướng giữa chừng.
- KHÔNG để 2 node đè lên nhau (kiểm tra tọa độ trước khi sinh XML).

## 5. Kết nối (Edge) — Orthogonal, có điểm neo rõ ràng

- Style chuẩn: `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;`
- `exitX/exitY` và `entryX/entryY` PHẢI khai báo tường minh (0/0.5/1) — tránh draw.io tự chọn điểm neo lung tung khi mở lại.
- Nhãn trên edge (Yes/No cho decision) đặt qua thuộc tính `value` của chính edge cell, KHÔNG tạo thêm text box rời rạc đè lên đường nối.
- Mũi tên 1 chiều: `startArrow=none;endArrow=block;` (mặc định).

## 6. Font & Text

- `fontFamily=Segoe UI;fontSize=12;` cho node thường, `fontSize=14;fontStyle=1` (bold) cho tiêu đề nhóm.
- Text trong node PHẢI ngắn gọn (≤ 4 dòng) — chi tiết dài đưa vào `tooltip` (`<mxCell ... tooltip="...">` không được hỗ trợ trực tiếp qua attribute chuẩn, thay vào đó dùng `<UserObject>` wrapper nếu cần custom data, nhưng mặc định giữ đơn giản: text ngắn trong node).

## 7. Đặt tên file & vị trí

- `docs/diagrams/{feature}/{diagram-type}-{slug}.drawio`
- Ví dụ: `docs/diagrams/container/flowchart-search-flow.drawio`, `docs/diagrams/topo/architecture-overview.drawio`

## 8. Kiểm tra trước khi Write

- XML PHẢI well-formed (đóng thẻ đúng, escape ký tự `<`, `>`, `&`, `"` trong `value`/`style` bằng `&lt;`, `&gt;`, `&amp;`, `&quot;`).
- Mọi `source`/`target` của edge PHẢI trỏ tới `id` có tồn tại trong file.
- Không trùng `id`.
