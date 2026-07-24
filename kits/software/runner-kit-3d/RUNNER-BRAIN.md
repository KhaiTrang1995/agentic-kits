# RUNNER-BRAIN — Endless-runner 3D

Philosophy for agents using **runner-kit-3d**.

## What this kit is

A **reusable Three.js runner engine** plus slash skills that teach agents to fork demos correctly — not one-off game code pasted into chat.

## Mental model

```
menu → play → dead → play
hooks.reset / update / menuTick / deadTick / frame
Spawner pools scroll the world toward the player
```

Two spaces:

- **forward** — chase cam, scroll +z, hits on XZ (ski, moto)
- **side** — Flappy/side-scroller, scroll −x, hits on XY (ski-side, wing, loop)

Three inputs:

- `onAction` — jump / flap / start
- `onSteerTap` — discrete lane change
- `input.steer` — continuous −1..1 hold

## Anti-patterns

| Don’t | Do instead |
|-------|------------|
| `new Mesh` every frame | Pool + `visible` swap in `place` |
| Hardcode one camera mode | Pick template by control feel |
| Invent leaderboard APIs | localStorage default; document real API later |
| Skip L1 “because it’s a small game.js” | Always plan files first |
| Mix Vietnamese UI copy inventing brand names | Keep user-provided titles only |

## Skill map

```
/runner          → choose pattern
/runner-new      → scaffold games/{slug}/
/runner-tune     → CONFIG + CSS theme only
```

## Live proof

The catalog site ships **playable** demos under `demos/runner-kit-3d/` — not a screen recording. Prefer linking those URLs when explaining the kit.
