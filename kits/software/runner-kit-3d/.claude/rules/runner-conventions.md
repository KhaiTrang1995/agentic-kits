# Runner conventions

> All skills in **runner-kit-3d** follow this file.

## 1. Engine first

- Prefer the shared `kit/` modules: `Game`, `Input`, `Spawner`, `Effects`, `HUD`, `Leaderboard`, audio helpers.
- Import via `../../kit/index.js` (or documented path after scaffold).
- Do **not** reimplement the game loop, bloom pipeline, or HUD event wiring unless the user explicitly wants a fork of the kit core.

## 2. Spawner discipline

- `build(i)` creates meshes **once** per pool slot.
- `place(item, ctx)` only toggles visibility, positions, colliders, score flags.
- Set `item.userData.colliders`, `scorable`, optional `scoreCheck`, optional `tick`.
- Scenery scrollers: `passLine: 999`, empty `place`.

## 3. Space modes

| mode | Scroll | hits(a,b,r) |
|------|--------|-------------|
| `forward` | +z toward camera | (px, pz, r) on XZ |
| `side` | −x past player | (px, py, r) on XY |

## 4. Hooks contract

```js
game.hooks.reset / update / menuTick / deadTick / frame / resize?
```

Gameplay state only in hooks — no second rAF loop.

## 5. Storage keys

Each game uses unique `storageKey` / `bestKey` / `nameKey` so leaderboards never collide.

## 6. Theme

CSS variables on `:root`: `--accent`, `--accent2`, `--bg`, `--ink`, `--gold`, `--panel`, `--shadow`.  
Load `kit/fonts.css` + Vietnamese-safe display stack (Be Vietnam Pro + Outfit).

## 7. Evidence-only

- No invented score APIs, CDN tokens, or “official” brand assets.
- Live demo paths: document real repo-relative or Pages URLs only.

## 8. One-liner

> **Pick a control template → pool obstacles → wire hooks. Never allocate mid-run.**
