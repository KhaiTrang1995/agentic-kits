---
name: runner-new
description: Scaffold a new endless-runner game folder from a control template (ski|moto|ski-side|wing|loop). Trigger `/runner-new <slug> --template <id>`.
user-invocable: true
argument-hint: "<slug> --template <id> [--title \"NAME\"]"
---

# /runner-new — Scaffold a game

## Goal

Create `games/{slug}/index.html` + `game.js` from the closest demo/template, with unique storage keys and themed CSS variables.

## Input examples

```text
/runner-new skate --template wing --title "SKATE RUSH"
/runner-new toboggan --template ski
/runner-new night-lane --template moto --title "NIGHT LANE"
```

## Process

1. Resolve `--template` (required). Unknown → list ids and stop.
2. Slugify name; refuse if `games/{slug}/` already exists unless user confirms overwrite (L2).
3. **L1 plan** — list files (`@../../rules/approval-gate.md`).
4. Copy structure from:
   - Live engine demos: `demos/runner-kit-3d/games/{template}/` when present in repo, **or**
   - Kit `_templates/` stubs + fill from `@../../../references/control-patterns.md`
5. Replace title, CSS `--accent` / `--bg`, storage keys (`{slugcompact}-scores`, `-best`, `-name`).
6. Ensure `game.js` imports from `../../kit/index.js` (or correct relative path).
7. Report next steps: `npm run dev`, open `/games/{slug}/`, optional hub card.

## Output

```text
games/{slug}/
  index.html
  game.js
```

## Mandatory rules

- Unique leaderboard keys
- No mid-game mesh allocation patterns
- Keep `window.__game` for debug if template had it
- Fonts: Be Vietnam Pro + Outfit (Vietnamese-safe)

## References

- @../../rules/runner-conventions.md
- @../../rules/naming-conventions.md
- @../../rules/approval-gate.md
- @../../../_templates/
- @../../../references/control-patterns.md
