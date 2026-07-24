// ── TUYẾT PHONG — demo trượt tuyết slalom của Runner Kit 3D ─────
// Lái ⛷️ xuống sườn núi vô tận: lọt qua cổng cờ để ghi điểm,
// né cây thông và tảng đá. Minh hoạ cách dùng kit với điều khiển
// "lái mượt" (input.steer liên tục).
import * as THREE from 'three';
import { Game } from '../../kit/core.js';
import { Input } from '../../kit/input.js';
import { HUD } from '../../kit/hud.js';
import { Effects } from '../../kit/effects.js';
import { Spawner } from '../../kit/spawner.js';
import { Leaderboard } from '../../kit/leaderboard.js';
import { SFX, Music, Drone, wireAudio } from '../../kit/audio.js';

const CONFIG = {
  speedStart: 15,
  speedMax: 34,
  speedRamp: 0.5,     // tốc độ tăng mỗi giây
  steerMax: 15,       // tốc độ ngang tối đa
  slopeHalf: 10,      // nửa bề rộng đường trượt
  gapStart: 5.4,      // độ rộng cổng cờ ban đầu
  gapMin: 3.2,
  gapShrink: 0.06,    // cổng hẹp dần theo điểm
  playerRadius: 0.55,
};

// ── khởi tạo kit ───────────────────────────────────────────────
const game = new Game({
  canvas: document.getElementById('game'),
  fov: { landscape: 62, portrait: 76 },
  bloom: { strength: 0.35, radius: 0.6, threshold: 0.85 },
});
const { scene, camera } = game;

const sfx = new SFX();
const music = new Music(sfx);
const wind = new Drone(sfx, { type: 'wind' });
wireAudio(game, sfx, music);
game.on('play', () => wind.start());

const lb = new Leaderboard({
  storageKey: 'tuyetphong-scores',
  nameKey: 'tuyetphong-name',
  title: '🏆 vận động viên xuất sắc',
});
const hud = new HUD({ bestKey: 'tuyetphong-best', lb }).attach(game).bindAudio(sfx);

const effects = new Effects(scene, {
  trailColor: 0xeaf6ff,
  trailDrift: new THREE.Vector3(0, 0.6, 9), // bụi tuyết bay lên và lùi lại
  trailScale: 75,
});

// ── bầu trời & sườn núi ────────────────────────────────────────
scene.background = new THREE.Color(0x9fc8e8);
scene.fog = new THREE.Fog(0x9fc8e8, 40, 170);

scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x8899bb, 1.1));
const sun = new THREE.DirectionalLight(0xfff2dd, 1.6);
sun.position.set(-30, 60, -40);
scene.add(sun);

const snowMat = new THREE.MeshStandardMaterial({ color: 0xf2f8ff, roughness: 0.95 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), snowMat);
ground.rotation.x = -Math.PI / 2;
ground.position.z = -120;
scene.add(ground);

// dãy núi mờ phía chân trời
const peakMat = new THREE.MeshStandardMaterial({ color: 0xdceaf8, roughness: 1, flatShading: true });
for (let i = 0; i < 9; i++) {
  const h = 26 + Math.random() * 34;
  const peak = new THREE.Mesh(new THREE.ConeGeometry(14 + Math.random() * 14, h, 5), peakMat);
  peak.position.set(-90 + i * 22 + (Math.random() - 0.5) * 10, h / 2 - 3, -160 - Math.random() * 30);
  peak.rotation.y = Math.random() * Math.PI;
  scene.add(peak);
}

// tuyết rơi — một đám hạt quấn quanh người chơi
const FLAKES = 400;
const flakePos = new Float32Array(FLAKES * 3);
for (let i = 0; i < FLAKES; i++) {
  flakePos[i * 3] = (Math.random() - 0.5) * 60;
  flakePos[i * 3 + 1] = Math.random() * 26;
  flakePos[i * 3 + 2] = -Math.random() * 90 + 10;
}
const flakeGeo = new THREE.BufferGeometry();
flakeGeo.setAttribute('position', new THREE.BufferAttribute(flakePos, 3));
const snowfall = new THREE.Points(flakeGeo, new THREE.PointsMaterial({
  color: 0xffffff, size: 0.16, transparent: true, opacity: 0.85, depthWrite: false,
}));
snowfall.frustumCulled = false;
scene.add(snowfall);

function updateSnowfall(dt, scroll) {
  const p = flakeGeo.attributes.position.array;
  for (let i = 0; i < FLAKES; i++) {
    p[i * 3 + 1] -= dt * (4 + (i % 5));
    p[i * 3 + 2] += scroll * 0.6;
    if (p[i * 3 + 1] < 0) p[i * 3 + 1] += 26;
    if (p[i * 3 + 2] > 3) p[i * 3 + 2] -= 93; // không bay sát ống kính

  }
  flakeGeo.attributes.position.needsUpdate = true;
}

// ── người trượt tuyết ──────────────────────────────────────────
function buildSkier() {
  const group = new THREE.Group(); // vị trí thế giới
  const pose = new THREE.Group();  // nghiêng người khi cua
  group.add(pose);

  const jacket = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.8, flatShading: true });
  const pants = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.9, flatShading: true });
  const skin = new THREE.MeshStandardMaterial({ color: 0xf0c9a0, roughness: 0.8 });
  const helmet = new THREE.MeshStandardMaterial({ color: 0x4fa8ff, roughness: 0.35 });
  const skiMat = new THREE.MeshStandardMaterial({
    color: 0xaee9ff, roughness: 0.3, emissive: 0x2266aa, emissiveIntensity: 0.25,
  });

  const skis = [];
  for (const side of [-1, 1]) {
    const ski = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 2.0), skiMat);
    ski.position.set(side * 0.2, 0.05, -0.15);
    pose.add(ski);
    skis.push(ski);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.24), pants);
    leg.position.set(side * 0.2, 0.42, 0.05);
    pose.add(leg);
  }

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.4), jacket);
  torso.position.set(0, 0.95, 0.02);
  torso.rotation.x = 0.45; // cúi người về trước
  pose.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), skin);
  head.position.set(0, 1.36, -0.14);
  pose.add(head);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), helmet);
  cap.position.copy(head.position);
  pose.add(cap);

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.5 });
  for (const side of [-1, 1]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1), poleMat);
    pole.position.set(side * 0.42, 0.75, 0.3);
    pole.rotation.x = -0.6;
    pose.add(pole);
  }

  scene.add(group);
  return { group, pose, skis };
}

const player = buildSkier();
let px = 0;      // vị trí ngang
let vx = 0;      // vận tốc ngang
let speed = CONFIG.speedStart;

// ── chướng ngại vật: cổng cờ / cây thông / tảng đá ─────────────
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5e3a24, roughness: 0.95, flatShading: true });
const pineMat = new THREE.MeshStandardMaterial({ color: 0x1e5c3a, roughness: 0.9, flatShading: true });
const pineSnowMat = new THREE.MeshStandardMaterial({ color: 0xe8f4ff, roughness: 0.95, flatShading: true });
const rockMat = new THREE.MeshStandardMaterial({ color: 0x7a8494, roughness: 0.95, flatShading: true });
const flagRed = new THREE.MeshStandardMaterial({
  color: 0xff4444, emissive: 0xcc1111, emissiveIntensity: 0.7, side: THREE.DoubleSide,
});
const flagBlue = new THREE.MeshStandardMaterial({
  color: 0x4fa8ff, emissive: 0x1155cc, emissiveIntensity: 0.7, side: THREE.DoubleSide,
});
const poleMat2 = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4 });

function buildPine(scale = 1) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.9, 6), trunkMat);
  trunk.position.y = 0.45;
  tree.add(trunk);
  for (let l = 0; l < 3; l++) {
    const r = 1.15 - l * 0.3;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, 1.15, 7), l === 2 ? pineSnowMat : pineMat);
    cone.position.y = 1.15 + l * 0.75;
    tree.add(cone);
  }
  tree.scale.setScalar(scale);
  return tree;
}

function buildFlag(mat) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.7), poleMat2);
  pole.position.y = 0.85;
  g.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.44), mat);
  flag.position.set(0.33, 1.42, 0);
  g.add(flag);
  return g;
}

// mỗi slot trong pool chứa đủ 3 biến thể, place() bật đúng loại
const obstacles = new Spawner({
  scene,
  count: 10,
  spacing: 20,
  first: 55,
  behind: 14,
  passLine: 1.5,
  build: () => {
    const item = new THREE.Group();

    const gate = new THREE.Group();
    const flagL = buildFlag(flagRed);
    const flagR = buildFlag(flagBlue);
    gate.add(flagL, flagR);
    gate.userData = { flagL, flagR };

    const tree = buildPine(1 + Math.random() * 0.5);
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9), rockMat);
    rock.position.y = 0.55;
    rock.rotation.set(Math.random(), Math.random(), Math.random());

    item.add(gate, tree, rock);
    item.userData.variants = { gate, tree, rock };
    return item;
  },
  place: (item, ctx) => {
    const { gate, tree, rock } = item.userData.variants;
    const score = ctx.score || 0;
    const roll = Math.random();
    gate.visible = tree.visible = rock.visible = false;

    if (roll < 0.5) {
      // cổng slalom — lọt giữa hai lá cờ thì ghi điểm, tông cờ thì ngã
      const gap = Math.max(CONFIG.gapMin, CONFIG.gapStart - score * CONFIG.gapShrink);
      const half = gap / 2;
      const gx = (Math.random() - 0.5) * 2 * (CONFIG.slopeHalf - half - 1);
      gate.visible = true;
      gate.userData.flagL.position.x = gx - half;
      gate.userData.flagR.position.x = gx + half;
      item.position.x = 0;
      item.userData.colliders = [
        { dx: gx - half, dz: 0, r: 0.3 },
        { dx: gx + half, dz: 0, r: 0.3 },
      ];
      item.userData.scorable = true;
      item.userData.gateX = gx;
      item.userData.gateHalf = half;
      item.userData.scoreCheck = (c) => Math.abs(c.playerX - gx) < half - 0.2;
    } else if (roll < 0.8) {
      tree.visible = true;
      item.position.x = (Math.random() - 0.5) * 2 * (CONFIG.slopeHalf - 1);
      item.userData.colliders = [{ dx: 0, dz: 0, r: 0.75 }];
      item.userData.scorable = false;
      item.userData.scoreCheck = null;
    } else {
      rock.visible = true;
      item.position.x = (Math.random() - 0.5) * 2 * (CONFIG.slopeHalf - 1);
      item.userData.colliders = [{ dx: 0, dz: 0, r: 0.8 }];
      item.userData.scorable = false;
      item.userData.scoreCheck = null;
    }
  },
});

// rừng thông trang trí hai bên đường trượt (không va chạm)
const forest = new Spawner({
  scene,
  count: 22,
  spacing: 8,
  first: -10,
  behind: 16,
  passLine: 999, // không bao giờ tính điểm
  build: () => {
    const clump = new THREE.Group();
    for (const side of [-1, 1]) {
      for (let t = 0; t < 2; t++) {
        const tree = buildPine(1.2 + Math.random() * 1.4);
        tree.position.set(side * (13 + Math.random() * 9), 0, (Math.random() - 0.5) * 6);
        clump.add(tree);
      }
    }
    return clump;
  },
  place: () => {},
});
forest.reset();

obstacles.setVisible(false);

// ── điều khiển ─────────────────────────────────────────────────
const input = new Input({
  onAction: () => {
    if (game.state === 'menu') game.play();
    else if (game.state === 'dead' && game.overShown) game.play();
  },
  onSteerTap: () => {
    if (game.state === 'playing') sfx.whoosh();
  },
});

// ── móc gameplay vào vòng đời của kit ──────────────────────────
let scroll = 0;

game.hooks.reset = () => {
  px = 0;
  vx = 0;
  speed = CONFIG.speedStart;
  player.group.position.set(0, 0, 0);
  player.pose.rotation.set(0, 0, 0);
  player.group.rotation.set(0, 0, 0);
  effects.clearTrail();
  obstacles.reset({ score: 0, playerX: 0 });
  obstacles.setVisible(true);
};

game.hooks.update = (dt) => {
  // lái: mượt dần tới vận tốc ngang mục tiêu
  const target = input.steer * CONFIG.steerMax;
  vx += (target - vx) * Math.min(1, dt * 5);
  px = THREE.MathUtils.clamp(px + vx * dt, -CONFIG.slopeHalf, CONFIG.slopeHalf);
  player.group.position.x = px;

  // nghiêng người theo cua
  player.pose.rotation.z = -vx * 0.042;
  player.group.rotation.y = -vx * 0.035;

  speed = Math.min(CONFIG.speedMax, speed + CONFIG.speedRamp * dt);
  scroll = speed * dt;
  wind.set(speed / CONFIG.speedMax);

  const ctx = { score: game.score, playerX: px };
  const scored = obstacles.update(scroll, dt, ctx);
  if (scored) {
    game.addScore(scored);
    effects.ring(new THREE.Vector3(px, 1.2, -1), 0xaee9ff);
  }
  forest.update(scroll, dt);

  // bụi tuyết sau ván trượt — cua càng gắt càng nhiều
  effects.emitTrail(new THREE.Vector3(px - vx * 0.02, 0.12, 1.0), dt);
  if (Math.abs(vx) > 9 && Math.random() < 0.5) {
    effects.puff(new THREE.Vector3(px, 0.15, 0.8), 0xffffff);
  }

  if (obstacles.hits(px, 0, CONFIG.playerRadius)) {
    effects.crashBurst(new THREE.Vector3(px, 0.8, 0), 0xffffff, 0x4fa8ff);
    game.crash();
  }
};

game.hooks.menuTick = (dt, elapsed) => {
  // đứng chờ ở vạch xuất phát, lắc lư nhẹ
  scroll = 2.2 * dt;
  player.group.position.x = px = Math.sin(elapsed * 0.5) * 2;
  player.pose.rotation.z = Math.sin(elapsed * 1.7) * 0.06;
  forest.update(scroll, dt);
  wind.set(0.12);
};

game.hooks.deadTick = (dt) => {
  // ngã lăn lộn, trượt chậm dần
  scroll = Math.max(0, scroll - dt * 3);
  player.pose.rotation.x += dt * 6;
  player.pose.rotation.z += dt * 4;
  obstacles.update(scroll, dt, { score: game.score, playerX: px });
  forest.update(scroll, dt);
  wind.set(0);
};

game.hooks.frame = (dt, rawDt, elapsed) => {
  updateSnowfall(dt, scroll);
  effects.update(dt, rawDt);

  // camera đuổi sau lưng, rung khi va chạm
  const shakeX = (Math.random() - 0.5) * effects.shake;
  const shakeY = (Math.random() - 0.5) * effects.shake;
  const camX = px * 0.55 + Math.sin(elapsed * 0.2) * 0.3 + shakeX;
  const camY = 4.4 + shakeY;
  camera.position.x += (camX - camera.position.x) * Math.min(1, rawDt * 5);
  camera.position.y += (camY - camera.position.y) * Math.min(1, rawDt * 5);
  camera.position.z = 8.5;
  camera.lookAt(px * 0.85, 0.9, -9);
};

game.on('crash', () => {
  obstacles.setVisible(true);
});
game.on('play', () => hud.el.menuBest && (hud.el.menuBest.textContent = hud.best));

game.start();

// tay nắm debug/E2E — kiểm thử không cần cào UI
window.__game = {
  game, sfx, music, obstacles,
  get px() { return px; },
  set px(v) { px = v; },
};
