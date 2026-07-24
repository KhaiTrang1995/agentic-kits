# runner-kit-3d

AI skill kit for **3D endless-runner games** (Three.js, no build step).  
Pairs with the live engine under [`demos/runner-kit-3d/`](../../../demos/runner-kit-3d/) — ski, moto, side-jump, flappy-wing, street racer.

```text
/runner --list
/runner-new skate --template wing --title "SKATE RUSH"
/runner-tune wing --gravity -32 --flap 10
```

## Install

```bash
# From this repo
cp -r kits/software/runner-kit-3d/.claude/ your-project/.claude/
cp -r kits/software/runner-kit-3d/_templates/ your-project/_templates/

# Or via npm (after pack)
npx agentic-awesome-kits --claude --kit runner-kit-3d
```

Copy or clone the **engine + demos** when you need playable code:

```bash
cp -r demos/runner-kit-3d your-project/runner-kit-3d
cd your-project/runner-kit-3d && npm run dev
# http://localhost:4180
```

**Live demo (GitHub Pages):**  
`https://KhaiTrang1995.github.io/agentic-awesome-kits/demos/runner-kit-3d/`

## Skills

| Skill | Purpose |
|-------|---------|
| `/runner` | Hub — list templates, pick control pattern, open LEARN path |
| `/runner-new` | Scaffold a new game folder from a control template |
| `/runner-tune` | Adjust CONFIG / difficulty / theme CSS without rewriting architecture |

## Control templates (match demo games)

| Template id | Control | Camera | Demo |
|-------------|---------|--------|------|
| `ski` | Continuous steer | Forward chase | TUYẾT PHONG |
| `moto` | Lane tap | Forward chase | NEON RIDER |
| `ski-side` | Single-button jump | Side | TUYẾT PHI |
| `wing` | Continuous flap (Flappy) | Side | CÁNH TRỜI |
| `loop` | Jump + light steer | Side | LOOP STREET |

## Design rules (summary)

- **Pool, don’t allocate** — Spawner `build` once, `place` recycles.
- **Two spaces** — `mode: 'forward' | 'side'`.
- **Hooks only** — gameplay via `game.hooks.*`; kit owns loop/HUD/audio.
- **Evidence-only** — do not invent API keys or leaderboard endpoints.
- **Approval gate** — L1 before writing game files.

Full conventions: `.claude/rules/runner-conventions.md` · brain: `RUNNER-BRAIN.md`.

## Engine modules (`kit/`)

| Module | Role |
|--------|------|
| `core.js` | Game loop, bloom, state machine |
| `input.js` | Action / steerTap / continuous steer |
| `spawner.js` | Object pool + collision + score |
| `effects.js` / `audio.js` / `hud.js` / `leaderboard.js` | Polish |

## License note

- **Skill package** (this folder): same as monorepo (CC BY-NC-SA 4.0).
- **Playable engine demos** under `demos/runner-kit-3d/`: **MIT** (see that folder’s `LICENSE`).
