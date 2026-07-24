# Naming conventions — runner-kit-3d

| Thing | Pattern | Example |
|-------|---------|---------|
| Game folder | `kebab-case` | `games/neon-dash/` |
| Storage keys | `{slug without dashes}-scores` | `neondash-scores` |
| Config object | `CONFIG` uppercase | `CONFIG.speedMax` |
| Player factory | `buildPlayer` / `buildBike` | `buildBird()` |
| Debug handle | `window.__game` | optional E2E |

Paths after scaffold:

```text
runner-kit-3d/
  games/{slug}/
    index.html
    game.js
  kit/
    *.js
```
