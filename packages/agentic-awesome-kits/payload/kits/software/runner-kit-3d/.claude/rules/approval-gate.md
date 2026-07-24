# Approval Gate — runner-kit-3d

> The agent generates game files and checklists. It does **not** deploy to hosting or open PRs without the user asking.

## Levels

| Level | When | User responds |
|-------|------|----------------|
| **L1 Plan** | Before any Write/Edit of game files | Y / n / edit plan |
| **L2 Diff** | Editing an existing `game.js` / `index.html` | Y apply / n keep |
| **L3 Iterate** | Creative pass (theme, difficulty curve) | Approve / Revise / Cancel |

## L1 format

```
[/runner-new] Will create:
  1. games/skate/index.html   — HUD + theme CSS variables
  2. games/skate/game.js      — CONFIG, player, Spawner, hooks
  3. (optional) hub index card

Template: wing · title: SKATE RUSH
Apply? (Y/n):
```

## Rules

- L1 mandatory even for a single file.
- Never run production deploys or force-push.
- Tuning numbers only still needs a short L1 when overwriting user CONFIG.
