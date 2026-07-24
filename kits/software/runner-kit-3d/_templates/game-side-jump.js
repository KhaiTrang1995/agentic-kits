// Template: side + jump (ski-side / loop family)
// Replace CONFIG, buildPlayer, Spawner place(), theme.
import * as THREE from 'three';
import {
  Game, Input, HUD, Effects, Spawner, Leaderboard, SFX, Music, Drone, wireAudio,
} from '../../kit/index.js';

const CONFIG = {
  gravity: -38,
  jump: 13,
  speedStart: 12,
  speedMax: 24,
  speedRamp: 0.4,
  playerRadius: 0.55,
};

const game = new Game({ canvas: document.getElementById('game') });
const { scene, camera } = game;
const sfx = new SFX();
const music = new Music(sfx);
const wind = new Drone(sfx, { type: 'wind' });
wireAudio(game, sfx, music);
game.on('play', () => wind.start());

const lb = new Leaderboard({
  storageKey: '{{STORAGE}}-scores',
  nameKey: '{{STORAGE}}-name',
  title: '🏆 top pilots',
});
const hud = new HUD({ bestKey: '{{STORAGE}}-best', lb }).attach(game).bindAudio(sfx);
const effects = new Effects(scene, {
  trailColor: 0xffffff,
  trailDrift: new THREE.Vector3(-7, 0.4, 0),
  trailScale: 100,
});

scene.background = new THREE.Color(0x1a1038);
scene.fog = new THREE.Fog(0x1a1038, 40, 140);
scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x443366, 1.1));

// TODO: ground + player mesh
const player = { group: new THREE.Group(), pose: new THREE.Group() };
player.group.add(player.pose);
scene.add(player.group);

let py = 0, vy = 0, grounded = true, speed = CONFIG.speedStart, scroll = 0;

const obstacles = new Spawner({
  scene,
  mode: 'side',
  count: 8,
  spacing: 16,
  first: 40,
  behind: 24,
  passLine: 2,
  build: () => {
    const g = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x888899, flatShading: true }),
    );
    box.position.y = 0.5;
    g.add(box);
    return g;
  },
  place: (item) => {
    item.userData.colliders = [{ dx: 0, dy: 0.5, r: 0.7 }];
    item.userData.scorable = true;
  },
});
obstacles.setVisible(false);

function jump() {
  if (!grounded || game.state !== 'playing') return;
  grounded = false;
  vy = CONFIG.jump;
  sfx.whoosh();
}

new Input({
  onAction: () => {
    if (game.state === 'menu') game.play();
    else if (game.state === 'playing') jump();
    else if (game.state === 'dead' && game.overShown) game.play();
  },
});

game.hooks.reset = () => {
  py = 0; vy = 0; grounded = true; speed = CONFIG.speedStart;
  player.group.position.set(0, 0, 0);
  effects.clearTrail();
  obstacles.reset({});
  obstacles.setVisible(true);
};

game.hooks.update = (dt) => {
  if (!grounded) {
    vy += CONFIG.gravity * dt;
    py += vy * dt;
    if (py <= 0) { py = 0; vy = 0; grounded = true; }
  }
  player.group.position.y = py;
  speed = Math.min(CONFIG.speedMax, speed + CONFIG.speedRamp * dt);
  scroll = speed * dt;
  wind.set(speed / CONFIG.speedMax);
  const scored = obstacles.update(scroll, dt, {});
  if (scored) game.addScore(scored);
  if (grounded) effects.emitTrail(new THREE.Vector3(-0.8, 0.12, 0), dt);
  if (obstacles.hits(0, py + 0.5, CONFIG.playerRadius)) {
    effects.crashBurst(new THREE.Vector3(0, py + 0.6, 0));
    game.crash();
  }
};

game.hooks.menuTick = (dt) => { scroll = 2 * dt; };
game.hooks.deadTick = (dt) => {
  scroll = Math.max(0, scroll - dt * 2);
  obstacles.update(scroll, dt, {});
  wind.set(0);
};

game.hooks.frame = (dt, rawDt, elapsed) => {
  effects.update(dt, rawDt);
  camera.position.set(2.4, 3.4 + py * 0.3, 15);
  camera.lookAt(3.4, 1.5 + py * 0.3, 0);
};

game.start();
window.__game = { game, obstacles, jump };
