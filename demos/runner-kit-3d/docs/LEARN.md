# 📚 Học làm game với Runner Kit 3D

Kit này tách từ **TECHSPHEREX** (`flappy-bird-3D`): endless-runner 3D bằng Three.js, **không cần build**, chạy thẳng trên trình duyệt.

Mục tiêu: sau 1 buổi bạn hiểu vòng đời game, pool vật thể, và tự fork ra game riêng.

---

## 0. Chạy thử (5 phút)

```bash
cd runner-kit-3d
npm run dev
```

Mở `http://localhost:4180` → chơi 5 demo:

| Game | Học được gì |
|---|---|
| **TUYẾT PHONG** (`ski`) | Lái mượt `input.steer`, camera đuổi, cổng ghi điểm |
| **NEON RIDER** (`moto`) | Đổi làn `onSteerTap`, xe tự chạy (`tick`), đêm neon |
| **TUYẾT PHI** (`ski-side`) | `mode: 'side'`, nhảy 1 nút, luồn dưới vật cao |
| **CÁNH TRỜI** (`wing`) | Flappy thật: trọng lực liên tục + vỗ cánh, khe cột |
| **LOOP STREET** (`loop`) | Side-runner + `scoreCheck` (lọt vòng mới tính điểm) |

---

## 1. Bản đồ thư mục

```
runner-kit-3d/
├── kit/                 ← engine dùng chung (đừng sửa bừa khi học)
│   ├── core.js          Game loop, state, bloom
│   ├── input.js         Phím + chạm
│   ├── spawner.js       Pool cuộn + va chạm
│   ├── effects.js       Vệt, nổ, ring, shake
│   ├── audio.js         SFX / nhạc / drone procedural
│   ├── hud.js           Menu · điểm · game-over
│   ├── leaderboard.js   localStorage
│   ├── fonts.css        Outfit + Be Vietnam Pro (đủ dấu Việt)
│   ├── style.css        HUD theme (CSS variables)
│   └── index.js         export gộp
├── games/<tên>/         ← mỗi game = 1 folder
│   ├── index.html
│   └── game.js
├── scripts/new-game.mjs ← scaffold game mới
└── docs/LEARN.md        ← file này
```

---

## 2. Vòng đời `Game` (não bộ)

```
menu ──play()──► playing ──crash()──► dead ──play()──► playing
                     │                   │
                  update()            deadTick()
                     └────── frame() ──────┘  (mọi frame: camera + effects)
```

| Hook | Khi nào | Việc nên làm |
|---|---|---|
| `reset` | Vào `play()` | Đặt lại vị trí, tốc độ, `spawner.reset()` |
| `update(dt)` | Đang chơi | Vật lý, cuộn, va chạm, `addScore` / `crash` |
| `menuTick` | Menu | Animation chờ (xe nổ máy, chim vỗ cánh…) |
| `deadTick` | Chết | Ngã / trượt / nổ chậm |
| `frame` | **Mọi** frame | Camera, effects, tuyết rơi |

Sự kiện: `play` · `score` · `crash` · `over` — HUD và audio **chỉ** lắng nghe, không đụng gameplay.

---

## 3. Hai không gian: `forward` vs `side`

```
FORWARD (ski, moto)              SIDE (ski-side, wing, loop)
Người chơi nhìn -z               Camera nhìn từ +z
Vật thể sinh xa (-z)             Vật thể sinh phải (+x)
Cuộn về +z (về camera)           Cuộn về -x (lướt qua)
Va chạm mặt XZ: hits(px,pz,r)    Va chạm mặt XY: hits(px,py,r)
```

Chọn **side** khi muốn game kiểu Flappy / đua ngang / trượt ngang.  
Chọn **forward** khi muốn cảm giác đuổi sau lưng (Temple Run, Subway-ish, ski).

---

## 4. Ba kiểu điều khiển

```js
new Input({
  onAction: () => { /* Space / chạm — nhảy, vỗ cánh, bắt đầu */ },
  onSteerTap: (dir) => { /* gõ ←/→ — đổi làn ±1 */ },
});
// và mỗi frame:
input.steer  // -1..1 khi GIỮ phím/chạm — lái mượt
```

| Pattern | Demo | Gợi ý game |
|---|---|---|
| Action only | wing, ski-side | Flappy, endless jumper |
| Steer continuous | ski | Trượt tuyết, lướt ván, lái mượt |
| Steer tap | moto | Đua 3 làn, Subway Surfers-lite |
| Action + steer | loop | Side racer vừa nhảy vừa lái |

---

## 5. Spawner — trái tim hiệu năng

```js
const obstacles = new Spawner({
  scene,
  mode: 'side',          // hoặc 'forward'
  count: 8,              // số slot pool
  spacing: 15,
  first: 40,             // khoảng cách slot đầu
  behind: 24,            // tái chế khi qua mốc này
  passLine: 2,           // mốc "đã vượt" → có thể ghi điểm
  build: (i) => { /* tạo mesh 1 lần */ return group; },
  place: (item, ctx) => {
    // bật đúng biến thể, gán colliders / scorable / scoreCheck / tick
    item.userData.colliders = [{ dx: 0, dy: 0.5, r: 0.7 }]; // side
    item.userData.scorable = true;
  },
});
```

**Quy tắc vàng:** mọi mesh tạo trong `build`, chỉ bật/tắt trong `place` — không `new Mesh` giữa game.

Mẹo hay trong demo:

- **Pool đa biến thể**: 1 group chứa đủ rock/tree/banner, `place` set `visible`
- **`tick`**: xe cộ tự chạy (`moto`)
- **`scoreCheck`**: chỉ điểm khi lọt vòng (`loop`) hoặc lọt cổng (`ski`)
- **Scenery**: `passLine: 999`, `place: () => {}`

---

## 6. Tạo game mới trong 10 phút

```bash
npm run new-game skate -- --template ski-side --title "SKATE RUSH"
npm run dev
# mở http://localhost:4180/games/skate/
```

Rồi sửa **4 chỗ** trong `games/skate/game.js`:

1. **`CONFIG`** — tốc độ, trọng lực, độ khó  
2. **`buildPlayer()`** — mesh nhân vật  
3. **`place()` của Spawner** — chướng ngại + collider  
4. **hooks** — vật lý + camera trong `frame`

Theme màu: sửa CSS variables trong `index.html`:

```css
:root {
  --accent: #4fa8ff;
  --accent2: #aee9ff;
  --bg: #0e1d33;
}
```

Thêm card vào hub: copy 1 thẻ `<a class="card">` trong `index.html` gốc.

---

## 7. Checklist khi fork

- [ ] Đổi `storageKey` / `bestKey` / `nameKey` (scaffold làm sẵn)
- [ ] `window.__game` để debug trong DevTools
- [ ] Chơi thử mobile (chạm) + desktop (phím)
- [ ] Không `console` spam; không import npm package (CDN Three là đủ)
- [ ] README ngắn trong folder game nếu share riêng

---

## 8. Lộ trình học đề xuất

1. **Chơi** 5 demo, ghi chú cảm giác điều khiển  
2. **Đọc** `kit/core.js` + `kit/spawner.js` (≈200 dòng, có comment)  
3. **Sửa số** trong `CONFIG` của `wing` (gravity, flap, gap)  
4. **Đổi màu** mesh + CSS theme  
5. **`npm run new-game`** và thay chướng ngại bằng ý tưởng của bạn  
6. (Nâng cao) Leaderboard API — xem `flappy-bird-3D/api/`

---

## 9. Câu hỏi thường gặp

**Q: Mở file HTML trực tiếp bị lỗi module?**  
A: Cần web server (`npm run dev`). ES Modules bị chặn với `file://`.

**Q: Muốn leaderboard online?**  
A: Viết lại `Leaderboard.fetchTop` / `submit` gọi API. Mẫu token chống gian lận ở `flappy-bird-3D/api/`.

**Q: Có dùng React / Vite không?**  
A: Cố ý **không** — dễ share cho người mới, dễ nhúng GitHub Pages. Bạn có thể bọc Vite sau nếu cần.

**Q: Sửa kit hay chỉ sửa game?**  
A: Học thì **chỉ sửa `games/`**. Khi hiểu rõ, mới mở rộng `kit/` (ví dụ thêm mode camera).

---

*Chia sẻ thoải mái để học tập. Giữ credit kit nếu fork công khai — xem LICENSE.*
