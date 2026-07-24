import * as THREE from 'three';

// ── Spawner — pool vật thể cuộn về phía người chơi ─────────────
// Hai chế độ không gian (mode):
//   'forward' (mặc định) — người chơi nhìn về -z, vật thể sinh ở xa
//     (-z) và cuộn +z về phía camera (game đuổi: trượt tuyết, đua xe).
//   'side' — góc nhìn ngang kiểu Flappy Bird: vật thể sinh bên phải
//     (+x) và cuộn -x lướt qua người chơi; va chạm trên mặt XY
//     (độ cao thay vì chiều sâu). Demo: ski-side, wing, loop.
//
// Qua khỏi behind thì tái chế ra xa nhất — KHÔNG cấp phát trong lúc chơi.
//
//   build(i)          → THREE.Group cho slot i (gọi 1 lần lúc khởi tạo)
//   place(item, ctx)  → bố trí lại khi tái chế; gán item.userData:
//         colliders  : forward [{dx,dz,r}] · side [{dx,dy,r}]
//         scorable   : true → vượt passLine = +1 điểm
//         scoreCheck : (ctx) => bool — điều kiện thêm (lọt cổng, nhặt xu…)
//         tick       : (item, dt, ctx) — chuyển động riêng (xe chạy tới)
//
// Mẹo: cảnh trang trí = Spawner với passLine: 999 và place: () => {}
export class Spawner {
  constructor({ scene, count = 10, spacing = 18, first = 60, behind = 14, passLine = 2, mode = 'forward', build, place }) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.spacing = spacing;
    this.first = first;
    this.behind = behind;
    this.passLine = passLine;
    this.side = mode === 'side';
    this.place = place;
    this.items = [];
    for (let i = 0; i < count; i++) {
      const item = build(i);
      this.group.add(item);
      this.items.push(item);
    }
  }

  reset(ctx = {}) {
    this.items.forEach((item, i) => {
      if (this.side) item.position.set(this.first + i * this.spacing, 0, 0);
      else item.position.set(0, 0, -(this.first + i * this.spacing));
      item.userData.passed = false;
      this.place(item, ctx);
    });
  }

  // Cuộn mọi vật thể về trước dist; trả về số điểm ghi được frame này.
  update(dist, dt, ctx = {}) {
    let scored = 0;
    for (const item of this.items) {
      // toạ độ cuộn: forward chạy trên z, side chạy ngược trên x
      const p = this.side
        ? (item.position.x -= dist, -item.position.x)
        : (item.position.z += dist);
      item.userData.tick?.(item, dt, ctx);

      if (!item.userData.passed && p > this.passLine) {
        item.userData.passed = true;
        if (item.userData.scorable && (!item.userData.scoreCheck || item.userData.scoreCheck(ctx))) {
          scored++;
          this.lastScored = item;
        }
      }
      if (p > this.behind) {
        if (this.side) {
          let maxX = -Infinity;
          for (const it of this.items) maxX = Math.max(maxX, it.position.x);
          item.position.x = maxX + this.spacing;
        } else {
          let minZ = Infinity;
          for (const it of this.items) minZ = Math.min(minZ, it.position.z);
          item.position.z = minZ - this.spacing;
        }
        item.userData.passed = false;
        this.place(item, ctx);
      }
    }
    return scored;
  }

  // Va chạm vòng tròn: forward trên mặt XZ — hits(px, pz, pr);
  // side trên mặt XY — hits(px, py, pr). Trả về item trúng hoặc null.
  hits(px, b, pr) {
    for (const item of this.items) {
      const cols = item.userData.colliders;
      if (!cols) continue;
      for (const c of cols) {
        const dx = px - (item.position.x + c.dx);
        const db = this.side
          ? b - (item.position.y + c.dy)
          : b - (item.position.z + c.dz);
        const rr = c.r + pr;
        if (dx * dx + db * db < rr * rr) return item;
      }
    }
    return null;
  }

  setVisible(v) {
    this.group.visible = v;
  }
}
