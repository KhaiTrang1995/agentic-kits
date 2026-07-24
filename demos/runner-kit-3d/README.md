# 🎮 RUNNER KIT 3D

> Bộ kit làm game 3D dạng **endless-runner** bằng Three.js — trích xuất từ kiến trúc **TECHSPHEREX** (`flappy-bird-3D`).  
> Một engine lõi, nhiều game: trượt tuyết, đua xe, flappy, side-runner…  
> Chạy **thuần trình duyệt, không cần build** · **MIT** · sẵn sàng share để học.

**Học nhanh:** [docs/LEARN.md](docs/LEARN.md) · **Tạo game:** `npm run new-game mygame`

---

## 🕹️ Năm demo kèm sẵn

| Game | Thư mục | Điều khiển | Góc nhìn | Học pattern |
|---|---|---|---|---|
| ⛷️ **TUYẾT PHONG** | `games/ski/` | Lái mượt (`input.steer`) | Đuổi sau | Cổng slalom + scoreCheck |
| 🏍️ **NEON RIDER** | `games/moto/` | Đổi làn (`onSteerTap`) | Đuổi sau | Traffic `tick`, 3 làn |
| 🎿 **TUYẾT PHI** | `games/ski-side/` | Nhảy (`onAction`) | Ngang `side` | Nhảy mặt đất + luồn dưới |
| 🪽 **CÁNH TRỜI** | `games/wing/` | Vỗ cánh (`onAction`) | Ngang `side` | Flappy: gravity liên tục + khe cột |
| 🏎️ **LOOP STREET** | `games/loop/` | Nhảy + lái nhẹ | Ngang `side` | `scoreCheck` vòng neon |

Năm demo cố tình phủ **đủ kiểu điều khiển + hai góc nhìn** để làm khuôn cho mọi runner tương tự.

---

## 🚀 Chạy thử

```bash
npm run dev
# hoặc: npx http-server -p 4180
```

Mở `http://localhost:4180` → chọn game.  
(Cần web server vì ES Modules bị chặn khi mở file trực tiếp.)

---

## ✨ Tạo game mới (scaffold)

```bash
# liệt kê template
npm run new-game -- --list

# copy template gần nhất
npm run new-game skate -- --template ski-side --title "SKATE RUSH"
```

| Template | Khi nào dùng |
|---|---|
| `ski` | Lái mượt, camera đuổi |
| `moto` | Đổi làn rời rạc, camera đuổi |
| `ski-side` | Nhảy một nút, màn ngang |
| `wing` | Flappy / bay liên tục, màn ngang |
| `loop` | Side-runner vừa nhảy vừa lái |

Sau đó sửa 4 chỗ trong `games/<tên>/game.js`: **CONFIG · nhân vật · Spawner.place · hooks**.  
Chi tiết từng bước: [docs/LEARN.md](docs/LEARN.md).

---

## 🧱 Kiến trúc kit — `kit/`

Mỗi module một việc; game chỉ lắp ghép. Import gọn:

```js
import {
  Game, Input, Spawner, Effects, HUD, Leaderboard,
  SFX, Music, Drone, wireAudio,
} from '../../kit/index.js';
```

| Module | Vai trò |
|---|---|
| `core.js` | **Game** — renderer + bloom, camera, loop, state `menu → playing → dead`, slow-mo chết, sự kiện `play / score / crash / over` |
| `input.js` | **Input** — `onAction` · `onSteerTap` · `input.steer` (-1..1) |
| `spawner.js` | **Spawner** — pool cuộn, `mode: 'forward' \| 'side'`, tái chế, va chạm, điểm |
| `effects.js` | Vệt đuôi, bụi, vòng điểm, rung camera |
| `audio.js` | SFX + nhạc generative + drone (máy/gió) — không file âm thanh |
| `hud.js` | Menu / điểm / game-over / mute (null-safe) |
| `leaderboard.js` | Bảng xếp hạng localStorage |
| `fonts.css` | **Fonts** — Outfit (UI) + Be Vietnam Pro (tiêu đề, đủ dấu Việt) |
| `style.css` | HUD chuẩn — theme bằng CSS variables |
| `index.js` | Barrel export |

### Quy ước không gian

- **`forward`**: nhìn **-z**, thế giới cuộn **+z**, `hits(px, pz, r)` trên mặt XZ.  
- **`side`**: camera từ **+z**, vật sinh **+x** cuộn **-x**, `hits(px, py, r)` trên mặt XY (kiểu Flappy).

### Hooks gameplay

```js
game.hooks.reset    = () => { /* vạch xuất phát */ };
game.hooks.update   = (dt) => { /* chơi: lái, cuộn, va chạm */ };
game.hooks.menuTick = (dt, t) => { /* chờ menu */ };
game.hooks.deadTick = (dt) => { /* ngã / nổ */ };
game.hooks.frame    = (dt, rawDt, t) => { /* camera + effects */ };
```

### Mẹo từ demo

- **Pool đa biến thể**: `build` chứa mọi mesh, `place` chỉ `visible` + colliders.  
- **Tự chuyển động**: `item.userData.tick = (it, dt) => …`  
- **Điểm có điều kiện**: `scoreCheck: (ctx) => bool`  
- **Cảnh trang trí**: Spawner với `passLine: 999`  
- **Neon**: material `emissive` + bloom của `Game`

---

## 🌐 Leaderboard toàn cầu (tuỳ chọn)

Mặc định: localStorage (GitHub Pages OK).  
Online: viết lại `fetchTop()` / `submit()` — tham khảo token chống gian lận trong `flappy-bird-3D/api/`.

---

## 🛠️ Công nghệ

- **Three.js r165** qua Import Maps CDN — không bundler  
- **UnrealBloomPass** — neon / tuyết rực  
- **Web Audio API** — SFX + nhạc procedural  
- **LocalStorage** — kỷ lục + BXH cục bộ  

---

## 📦 Share cho người học

```text
1. Clone / zip thư mục runner-kit-3d
2. npm run dev
3. Đọc docs/LEARN.md (lộ trình 1 buổi)
4. npm run new-game … để fork demo
```

Giấy phép: **MIT** (xem `LICENSE`) — remix thoải mái, giữ notice bản quyền khi redistribute.

---

*Trích xuất và phát triển từ dự án TECHSPHEREX · Runner Kit 3D.* 🎮
