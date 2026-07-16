# Approval Gate — Diagram Kit

> AI PHẢI xin phép user trước khi tạo/sửa file. Không skill nào tự ý ghi file.

## 3 Levels

| Level | Khi nào | User trả lời |
|-------|---------|--------------|
| **L1 Plan** | Trước mọi Write/Edit file | Y = làm, n = hủy, sửa = thay đổi plan |
| **L2 Diff** | Khi Edit file `.drawio` đã tồn tại | Y = apply, n = giữ cũ |
| **L3 Iterate** | Output cần review (bố cục sơ đồ, danh sách node/edge trước khi sinh XML) | Đồng ý / Sửa: ... / Hủy |

## L1 — Plan Preview

Trước khi tạo file, skill in:

```
[/flowchart] Sẽ tạo:
  1. docs/diagrams/container/flowchart-search-flow.drawio   — 8 node (2 decision), 9 edge

Apply? (Y/n):
```

## Rules

- L1 bắt buộc ngay cả khi chỉ tạo 1 file.
- KHÔNG skip approval vì "file nhỏ" hay "user đã confirm ở skill khác".
- L2 chạy SAU L1 (L1 list file, L2 show diff khi user Y).
- L3 chạy TRƯỚC L1 — liệt kê danh sách node/edge dự kiến (dạng bảng hoặc ASCII layout) để user xác nhận bố cục trước khi sinh XML đầy đủ, tránh phải sửa lại nhiều lần trên file XML khó đọc bằng mắt thường.
