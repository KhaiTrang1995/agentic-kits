# Control patterns

| Template | Input API | Spawner mode | Score pattern |
|----------|-----------|--------------|---------------|
| ski | `input.steer` | forward | gates + `scoreCheck` |
| moto | `onSteerTap` | forward | pass traffic + `tick` on cars |
| ski-side | `onAction` jump | side | pass obstacle |
| wing | `onAction` flap | side | pass pipe gap |
| loop | `onAction` + `steer` | side | `scoreCheck` on neon rings |

## Minimal hooks skeleton

```js
game.hooks.reset = () => { /* positions, spawner.reset, clearTrail */ };
game.hooks.update = (dt) => { /* physics, spawner.update, hits → crash */ };
game.hooks.menuTick = (dt, t) => { /* idle anim */ };
game.hooks.deadTick = (dt) => { /* tumble */ };
game.hooks.frame = (dt, rawDt, t) => { /* camera, effects.update */ };
```

## Live demos (repo)

| Template | Path |
|----------|------|
| ski | `demos/runner-kit-3d/games/ski/` |
| moto | `demos/runner-kit-3d/games/moto/` |
| ski-side | `demos/runner-kit-3d/games/ski-side/` |
| wing | `demos/runner-kit-3d/games/wing/` |
| loop | `demos/runner-kit-3d/games/loop/` |
