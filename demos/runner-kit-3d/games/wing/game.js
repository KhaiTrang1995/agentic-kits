// ── CÁNH TRỜI — Flappy side-view (cầu nối từ TECHSPHEREX) ────────
// Góc nhìn ngang, trọng lực liên tục, một nút VỖ CÁNH. Cột đá có
// khe hở di chuyển — luồn qua để ghi điểm. Minh hoạ:
//   • mode: 'side' + va chạm XY
//   • vật lý bay (không đứng trên mặt đất như ski-side)
//   • pool biến thể: gap cao thấp theo điểm
//
// So sánh: ski-side = nhảy có mặt đất · wing = bay liên tục (Flappy).
import * as THREE from 'three';
import {
  Game, Input, HUD, Effects, Spawner, Leaderboard, SFX, Music, Drone, wireAudio,
} from '../../kit/index.js';

const CONFIG = {
  gravity: -28,
  flap: 9.2,
  maxFall: -18,
  speedStart: 11,
  speedMax: 22,
  speedRamp: 0.35,
  gapStart: 3.6,
  gapMin: 2.4,
  gapShrink: 0.04,
  ceil: 9.5,
  floor: 0.4,
  playerRadius: 0.42,
};

const game = new Game({
  canvas: document.getElementById('game'),
  fov: { landscape: 52, portrait: 68 },
  bloom: { strength: 0.7, radius: 0.65, threshold: 0.7 },
  exposure: 1.1,
});
const { scene, camera } = game;

const sfx = new SFX();
const music = new Music(sfx, { bar: 3.0 });
const wind = new Drone(sfx, { type: 'wind' });
wireAudio(game, sfx, music);
game.on('play', () => wind.start());

const lb = new Leaderboard({
  storageKey: 'canhtroi-scores',
  nameKey: 'canhtroi-name',
  title: '🏆 phi công lão luyện',
});
const hud = new HUD({ bestKey: 'canhtroi-best', lb }).attach(game).bindAudio(sfx);

const effects = new Effects(scene, {
  trailColor: 0x5ce1ff,
  trailDrift: new THREE.Vector3(-9, 0.3, 0),
  trailScale: 100,
});

// ── bầu trời thuỷ tinh ─────────────────────────────────────────
scene.background = new THREE.Color(0x1a3a6e);
scene.fog = new THREE.Fog(0x1a3a6e, 40, 130);

scene.add(new THREE.HemisphereLight(0xa8d8ff, 0x3a2a6e, 1.1));
const sun = new THREE.DirectionalLight(0xffe8c8, 1.4);
sun.position.set(30, 40, -50);
scene.add(sun);

// mặt biển
const sea = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 80),
  new THREE.MeshStandardMaterial({
    color: 0x1a5a8a, roughness: 0.35, metalness: 0.4,
    emissive: 0x0a2844, emissiveIntensity: 0.3,
  })
);
sea.rotation.x = -Math.PI / 2;
sea.position.set(40, 0, -10);
scene.add(sea);

// mây xa
const cloudMat = new THREE.MeshStandardMaterial({
  color: 0xd8e8ff, roughness: 1, transparent: true, opacity: 0.55, flatShading: true,
});
for (let i = 0; i < 10; i++) {
  const c = new THREE.Mesh(new THREE.SphereGeometry(3 + Math.random() * 4, 6, 5), cloudMat);
  c.scale.set(1.6 + Math.random(), 0.5, 1);
  c.position.set(-20 + i * 14 + Math.random() * 6, 8 + Math.random() * 6, -40 - Math.random() * 30);
  scene.add(c);
}

// mặt trời
const sunDisc = new THREE.Mesh(
  new THREE.SphereGeometry(5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffe0a0 })
);
sunDisc.position.set(50, 12, -90);
scene.add(sunDisc);

// ── chim / cánh bay ────────────────────────────────────────────
function buildBird() {
  const group = new THREE.Group();
  const pose = new THREE.Group();
  group.add(pose);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x5ce1ff, roughness: 0.4, metalness: 0.3, flatShading: true,
    emissive: 0x0a4a66, emissiveIntensity: 0.5,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xb44dff, roughness: 0.35, flatShading: true,
    emissive: 0x4a1a80, emissiveIntensity: 0.6,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4,
  });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 10), bodyMat);
  body.scale.set(1.3, 0.9, 0.85);
  pose.add(body);

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 6), accentMat);
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.5, 0.05, 0);
  pose.add(beak);

  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.9, 0.35), accentMat);
  wingL.position.set(0, 0.15, 0.45);
  wingL.rotation.x = 0.3;
  pose.add(wingL);
  const wingR = wingL.clone();
  wingR.position.z = -0.45;
  wingR.rotation.x = -0.3;
  pose.add(wingR);

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
  eye.position.set(0.28, 0.12, 0.22);
  pose.add(eye);

  // xoay chim hướng +x (bay sang phải khung hình)
  group.rotation.y = -Math.PI / 2;
  scene.add(group);
  return { group, pose, wingL, wingR };
}

const player = buildBird();
let py = 4;
let vy = 0;
let speed = CONFIG.speedStart;
let wingPhase = 0;

// ── cột đá khe hở (pipe style) ─────────────────────────────────
const rockMat = new THREE.MeshStandardMaterial({
  color: 0x6a7a8e, roughness: 0.9, flatShading: true,
});
const crystalMat = new THREE.MeshStandardMaterial({
  color: 0x5ce1ff, roughness: 0.25, flatShading: true,
  emissive: 0x1a6080, emissiveIntensity: 0.8,
});
const topCapMat = new THREE.MeshStandardMaterial({
  color: 0xb44dff, roughness: 0.3, flatShading: true,
  emissive: 0x5a2080, emissiveIntensity: 1.0,
});

const obstacles = new Spawner({
  scene,
  mode: 'side',
  count: 6,
  spacing: 14,
  first: 36,
  behind: 22,
  passLine: 1.5,
  build: () => {
    const item = new THREE.Group();
    // chiều cao mesh gốc = 1, scale.y = chiều cao thật
    const bot = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 1, 7), rockMat);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 0.95, 1, 7), rockMat);
    const botRim = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.1, 6, 16), crystalMat);
    botRim.rotation.x = Math.PI / 2;
    const topRim = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.1, 6, 16), topCapMat);
    topRim.rotation.x = Math.PI / 2;
    item.add(bot, top, botRim, topRim);
    item.userData.parts = { bot, top, botRim, topRim };
    return item;
  },
  place: (item, ctx = {}) => {
    const score = ctx.score || 0;
    const gap = Math.max(CONFIG.gapMin, CONFIG.gapStart - score * CONFIG.gapShrink);
    const mid = 2.4 + Math.random() * 4.2;
    const half = gap / 2;
    const { bot, top, botRim, topRim } = item.userData.parts;

    // cột dưới: từ y=0 lên botTop
    const botTop = Math.max(0.8, mid - half);
    bot.scale.set(1, botTop, 1);
    bot.position.y = botTop / 2;
    botRim.position.y = botTop;

    // cột trên: từ topBot lên trần
    const topBot = mid + half;
    const topH = Math.max(1.2, CONFIG.ceil + 2.5 - topBot);
    top.scale.set(1, topH, 1);
    top.position.y = topBot + topH / 2;
    topRim.position.y = topBot;

    // va chạm dọc thân cột (vòng tròn trên mặt XY)
    const cols = [];
    for (let y = 0.5; y < botTop - 0.2; y += 0.95) cols.push({ dx: 0, dy: y, r: 0.9 });
    cols.push({ dx: 0, dy: botTop - 0.1, r: 0.98 });
    for (let y = topBot + 0.15; y < topBot + topH; y += 0.95) cols.push({ dx: 0, dy: y, r: 0.9 });
    cols.push({ dx: 0, dy: topBot + 0.1, r: 0.98 });

    item.userData.colliders = cols;
    item.userData.scorable = true;
  },
});
obstacles.setVisible(false);

// mây parallax
const clouds = new Spawner({
  scene,
  mode: 'side',
  count: 10,
  spacing: 18,
  first: -10,
  behind: 35,
  passLine: 999,
  build: () => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(2.2 + Math.random() * 1.5, 6, 5),
      cloudMat
    );
    m.scale.set(1.8, 0.45, 1);
    m.position.set(0, 6 + Math.random() * 4, -18 - Math.random() * 20);
    g.add(m);
    return g;
  },
  place: () => {},
});
clouds.reset();

function flap() {
  if (game.state !== 'playing') return;
  vy = CONFIG.flap;
  wingPhase = 0;
  sfx.whoosh();
  effects.puff(new THREE.Vector3(-0.3, py, 0), 0x5ce1ff);
}

new Input({
  onAction: () => {
    if (game.state === 'menu') game.play();
    else if (game.state === 'playing') flap();
    else if (game.state === 'dead' && game.overShown) game.play();
  },
});

let scroll = 0;

game.hooks.reset = () => {
  py = 4.2;
  vy = 0;
  speed = CONFIG.speedStart;
  player.group.position.set(0, py, 0);
  player.pose.rotation.set(0, 0, 0);
  effects.clearTrail();
  obstacles.reset({ score: 0 });
  obstacles.setVisible(true);
};

game.hooks.update = (dt) => {
  vy += CONFIG.gravity * dt;
  if (vy < CONFIG.maxFall) vy = CONFIG.maxFall;
  py += vy * dt;

  // trần / sàn = chết
  if (py < CONFIG.floor || py > CONFIG.ceil) {
    effects.crashBurst(new THREE.Vector3(0, py, 0), 0x5ce1ff, 0xb44dff);
    game.crash();
    return;
  }

  player.group.position.y = py;
  // nghiêng theo vận tốc đứng
  const pitch = THREE.MathUtils.clamp(vy * 0.04, -0.55, 0.45);
  player.pose.rotation.z = -pitch; // group đã xoay Y

  // đập cánh
  wingPhase += dt * (vy > 2 ? 22 : 10);
  const flapA = Math.sin(wingPhase) * 0.55;
  player.wingL.rotation.x = 0.3 + flapA;
  player.wingR.rotation.x = -0.3 - flapA;

  speed = Math.min(CONFIG.speedMax, speed + CONFIG.speedRamp * dt);
  scroll = speed * dt;
  wind.set(0.3 + 0.7 * (speed / CONFIG.speedMax));

  const scored = obstacles.update(scroll, dt, { score: game.score });
  if (scored) {
    game.addScore(scored);
    effects.ring(new THREE.Vector3(-1.2, py, 0), 0xb44dff);
  }
  clouds.update(scroll * 0.35, dt);

  effects.emitTrail(new THREE.Vector3(-0.6, py - 0.1, 0), dt);

  if (obstacles.hits(0, py, CONFIG.playerRadius)) {
    effects.crashBurst(new THREE.Vector3(0, py, 0), 0xffffff, 0x5ce1ff);
    game.crash();
  }
};

game.hooks.menuTick = (dt, elapsed) => {
  scroll = 2 * dt;
  py = 4 + Math.sin(elapsed * 1.6) * 0.45;
  player.group.position.y = py;
  wingPhase += dt * 8;
  const flapA = Math.sin(wingPhase) * 0.4;
  player.wingL.rotation.x = 0.3 + flapA;
  player.wingR.rotation.x = -0.3 - flapA;
  player.pose.rotation.z = Math.sin(elapsed * 1.2) * 0.08;
  clouds.update(scroll * 0.35, dt);
  wind.set(0.15);
};

game.hooks.deadTick = (dt) => {
  vy += CONFIG.gravity * dt;
  py = Math.max(-1, py + vy * dt);
  player.group.position.y = py;
  player.pose.rotation.z += dt * 6;
  player.pose.rotation.x += dt * 2;
  scroll = Math.max(0, scroll - dt * 2);
  obstacles.update(scroll, dt, { score: game.score });
  clouds.update(scroll * 0.35, dt);
  wind.set(0);
};

game.hooks.frame = (dt, rawDt, elapsed) => {
  effects.update(dt, rawDt);
  // sóng biển nhẹ
  sea.position.y = Math.sin(elapsed * 1.2) * 0.04;

  const shakeX = (Math.random() - 0.5) * effects.shake * 0.7;
  const shakeY = (Math.random() - 0.5) * effects.shake * 0.7;
  const camX = 2.2 + Math.sin(elapsed * 0.15) * 0.25 + shakeX;
  const camY = 4.2 + (py - 4) * 0.25 + shakeY;
  camera.position.x += (camX - camera.position.x) * Math.min(1, rawDt * 6);
  camera.position.y += (camY - camera.position.y) * Math.min(1, rawDt * 5);
  camera.position.z = 14.5;
  camera.lookAt(3.2, 3.8 + (py - 4) * 0.2, 0);
};

game.start();

window.__game = {
  game, sfx, music, obstacles, flap,
  get py() { return py; },
  get speed() { return speed; },
};
