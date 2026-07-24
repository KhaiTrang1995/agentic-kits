---
name: runner-tune
description: Tune an existing runner game — CONFIG difficulty, theme CSS, bloom — without rewriting architecture. Trigger `/runner-tune <game>`.
user-invocable: true
argument-hint: "<game-folder> [--gravity n] [--speed-max n] [--accent #hex]"
---

# /runner-tune — Difficulty & theme

## Goal

Adjust **numbers and theme** on an existing `games.js` / `index.html`. Do not replace the Spawner/hook architecture unless the user asks.

## Examples

```text
/runner-tune wing --gravity -32 --flap 10
/runner-tune moto --speed-max 50 --accent #33e6ff
/runner-tune loop --jump 15
```

## Process

1. Read current `CONFIG` and `:root` CSS variables.
2. L1 short plan of keys to change.
3. Patch only those keys; keep comments.
4. Suggest playtest checklist (mobile touch, keyboard, mute).

## Do not

- Rewrite mesh builders “for fun”
- Change `mode: 'side'|'forward'` without explicit request
- Invent external leaderboard endpoints

## References

- @../../rules/runner-conventions.md
- @../../rules/approval-gate.md
