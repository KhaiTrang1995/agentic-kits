---
name: architecture
description: Sinh sơ đồ kiến trúc hệ thống .drawio — client, service, database, external system với icon chuẩn, đường kết nối rõ ràng.
user-invocable: true
argument-hint: "<mô tả hệ thống> [--cloud aws|azure|gcp|generic]"
---

# /architecture — Sinh Sơ Đồ Kiến Trúc draw.io

## Khi nào dùng
Cần trực quan hóa kiến trúc hệ thống (microservice, layered architecture, network topology) cho tài liệu thiết kế, ADR, hoặc trình bày cho stakeholder.

## Input examples
```
/architecture hệ thống TOPO: Angular SPA → API Gateway → 3 microservice (Container, Booking, Auth) → SQL Server
/architecture --cloud azure kiến trúc deploy: App Service, Azure SQL, Blob Storage, Front Door
/architecture luồng tích hợp với hệ thống Hải quan qua REST API
```

## Quy trình

### Phase 1 — Xác định component & trust boundary
Liệt kê component theo nhóm:
- **Client**: web app, mobile app, external user (actor)
- **Edge**: load balancer, API gateway, CDN
- **Service**: backend service/microservice (process box)
- **Data**: database, cache, message queue (cylinder/tape)
- **External**: hệ thống bên thứ 3 (cloud shape)

Xác định trust boundary (internet ↔ DMZ ↔ internal) — vẽ bằng container box `dashed=1;fillColor=none;`.

### Phase 2 — Layout (L3 preview)
In sơ đồ khối dạng bảng/ASCII trước khi sinh XML — xác nhận nhóm nào nằm trong boundary nào, hướng data flow.

### Phase 3 — Sinh XML
Dùng `_templates/architecture.drawio` làm khung:
- Mặc định dùng **core shapes** (`ellipse+shape=cloud`, `shape=cylinder3`, `shape=umlActor`, `rounded=1`) — đảm bảo mở được ở mọi máy.
- Nếu `--cloud aws|azure|gcp`: dùng thêm stencil tương ứng (`shape=mxgraph.aws4.*`, `shape=mxgraph.azure.*`) và **ghi chú rõ trong output** rằng cần bật shape library đó trong draw.io.
- Nhóm theo trust boundary bằng container box bao quanh.
- Data flow chính đi trái→phải hoặc trên→dưới, mũi tên orthogonal.

### Phase 4 — Approval L1 → Write

## Rules bắt buộc
- Mọi external system/3rd-party PHẢI phân biệt rõ bằng màu xám (`fillColor=#f5f5f5;strokeColor=#666666;`).
- Database luôn dùng `shape=cylinder3`, KHÔNG dùng rounded rectangle cho storage.
- Nếu có > 10 component, nhóm theo layer/boundary bằng container box để dễ đọc thay vì để tất cả rời rạc cùng cấp.
- Legend nhỏ ở góc dưới nếu dùng > 3 loại màu, giải thích ý nghĩa từng màu.

## Output
`docs/diagrams/{feature}/architecture-{slug}.drawio`

## Xem thêm

Cần icon hãng cụ thể (AWS/Azure/GCP thật, không phải core shape), auto-layout cho >15 component, vẽ từ Terraform/K8s/docker-compose thật, hoặc xuất PNG/SVG/PDF → dùng `/diagram` (mạnh hơn nhưng cần draw.io desktop CLI).

## References
- @.claude/rules/drawio-conventions.md
- @.claude/rules/naming-conventions.md
- @.claude/rules/approval-gate.md
- @_templates/architecture.drawio
- Brain: `DRAWIO-BRAIN.md`
