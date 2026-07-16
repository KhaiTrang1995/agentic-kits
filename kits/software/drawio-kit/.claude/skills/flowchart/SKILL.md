---
name: flowchart
description: Sinh flowchart .drawio từ mô tả quy trình — start/end, process, decision, đúng chuẩn mxGraph, mở trực tiếp bằng draw.io.
user-invocable: true
argument-hint: "<mô tả quy trình> [--direction top-down|left-right]"
---

# /flowchart — Sinh Flowchart draw.io

## Khi nào dùng
Cần trực quan hóa 1 quy trình nghiệp vụ hoặc luồng xử lý (business process, thuật toán, luồng approval) thành sơ đồ chuyên nghiệp, chỉnh sửa được trong draw.io.

## Input examples
```
/flowchart quy trình duyệt đơn nghỉ phép: nộp đơn → quản lý duyệt → HR duyệt → xác nhận
/flowchart luồng xử lý tìm kiếm container: nhập từ khóa → validate → query DB → có kết quả? → hiển thị / empty state
/flowchart --direction left-right quy trình CI/CD: push code → build → test → deploy
```

## Quy trình

### Phase 1 — Phân tích bước
Xác định danh sách bước theo loại:
- **Start/End**: điểm bắt đầu/kết thúc (ellipse)
- **Process**: hành động (rounded rectangle)
- **Decision**: rẽ nhánh Yes/No hoặc nhiều nhánh (rhombus)
- **Input/Output**: nhập liệu/xuất kết quả (parallelogram, nếu có)

### Phase 2 — Layout (L3 preview)
In danh sách node + vị trí dự kiến dạng bảng trước khi sinh XML:
```
# | Loại | Nội dung | Vị trí (x,y)
1 | Start | Bắt đầu | (360, 40)
2 | Process | Nhập từ khóa | (360, 140)
3 | Decision | Từ khóa hợp lệ? | (360, 260)
...
```
User duyệt bố cục → Phase 3.

### Phase 3 — Sinh XML
Dùng `_templates/flowchart.drawio` làm khung, áp dụng:
- Core shapes + màu theo `drawio-conventions.md` mục 2-3
- Grid 20px, spacing chuẩn mục 4
- Edge orthogonal với `exitX/exitY/entryX/entryY` tường minh, nhãn Yes/No trên nhánh decision

### Phase 4 — Approval L1 → Write

## Rules bắt buộc
- Luôn có đúng 1 Start và tối thiểu 1 End (có thể nhiều End nếu có nhiều kết quả khác nhau).
- Decision PHẢI có đủ nhãn cho mọi nhánh ra (Yes/No, hoặc tên case cụ thể).
- KHÔNG quá 15 node trong 1 diagram — nếu quy trình dài hơn, tách thành flowchart con + tham chiếu (`docs/diagrams/{feature}/flowchart-{sub-slug}.drawio`).
- Hướng flow nhất quán (`--direction` mặc định `top-down`).

## Output
`docs/diagrams/{feature}/flowchart-{slug}.drawio`

## Xem thêm

Cần sequence diagram, ERD, UML class, C4 model, hoặc quy trình >15 bước cần auto-layout thay vì tách flowchart con thủ công → dùng `/diagram` (mạnh hơn nhưng cần draw.io desktop CLI).

## References
- @.claude/rules/drawio-conventions.md
- @.claude/rules/naming-conventions.md
- @.claude/rules/approval-gate.md
- @_templates/flowchart.drawio
- Brain: `DRAWIO-BRAIN.md`
