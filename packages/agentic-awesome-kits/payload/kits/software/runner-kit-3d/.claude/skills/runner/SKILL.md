---
name: runner
description: Hub for 3D endless-runner games — list control templates, recommend a pattern, point to live demos and /runner-new. Trigger `/runner` or `/runner --list`.
user-invocable: true
argument-hint: "[--list] | --template <id> | (interactive)"
---

# /runner — Runner kit hub

## Goal

Help the user **choose** a control + camera pattern, then hand off to `/runner-new` or `/runner-tune`.

## Templates

| ID | Control | Camera | Good for |
|----|---------|--------|----------|
| `ski` | Continuous steer | Forward | Ski, skate, smooth lane |
| `moto` | Lane tap | Forward | 3-lane racer |
| `ski-side` | Jump | Side | Grounded side-runner |
| `wing` | Flap (gravity always on) | Side | Flappy-style |
| `loop` | Jump + light steer | Side | Street side-scroller |

Catalog detail: `@../../../references/control-patterns.md`

## Approach

### `--list` or empty

Print the table above + link to live demos:

- Hub: `demos/runner-kit-3d/` (or Pages URL if known)
- Games: `games/ski/`, `moto/`, `ski-side/`, `wing/`, `loop/`

Recommend one template from the user’s goal (e.g. “like Flappy” → `wing`).

### User already chose

Suggest:

```text
/runner-new {slug} --template {id} --title "DISPLAY TITLE"
```

## Constraints

- Do not invent new engine APIs — `@../../rules/runner-conventions.md`
- L1 only when writing files (this hub is usually read-only)

## References

- @../../rules/runner-conventions.md
- @../../rules/approval-gate.md
- @../../../references/control-patterns.md
- @../../../references/learn.md
- @../../../RUNNER-BRAIN.md
