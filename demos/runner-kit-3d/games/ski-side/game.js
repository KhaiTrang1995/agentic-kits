// ── TUYẾT PHI — trượt tuyết màn ngang (side-view) ───────────────
// Góc nhìn ngang kiểu Flappy Bird: người trượt ở bên trái khung
// hình, chướng ngại vật lao tới từ bên phải. Một nút duy nhất:
// NHẢY qua đá / chông băng / cây thông, nhưng phải luồn DƯỚI ghế
// cáp treo. Minh hoạ chế độ mode:'side' của Spawner.
import * as THREE from 'three';
import { Game } from '../../kit/core.js';
import { Input } from '../../kit/input.js';
import { HUD } from '../../kit/hud.js';
import { Effects } from '../../kit/effects.js';
import { Spawner } from '../../kit/spawner.js';
import { Leaderboard } from '../../kit/leaderboard.js';
import { SFX, Music, Drone, wireAudio } from '../../kit/audio.js';

const CONFIG = {
  gravity: -38,
  jump: 13.2,
  speedStart: 12,
  speedMax: 24,
  speedRamp: 0.4,
  playerRadius: 0.55,
};

// ── khởi tạo kit ───────────────────────────────────────────────
const game = new Game({
  canvas: document.getElementById('game'),
  fov: { landscape: 55, portrait: 72 },
  bloom: { strength: 0.4, radius: 0.6, threshold: 0.85 },
});
const { scene, camera } = game;

const sfx = new SFX();
const music = new Music(sfx);
const wind = new Drone(sfx, { type: 'wind' });
wireAudio(game, sfx, music);
game.on('play', () => wind.start());

const lb = new Leaderboard({
  storageKey: 'tuyetphi-scores',
  nameKey: 'tuyetphi-name',
  title: '🏆 vận động viên xuất sắc',
});
const hud = new HUD({ bestKey: 'tuyetphi-best', lb }).attach(game).bindAudio(sfx);

const effects = new Effects(scene, {
  trailColor: 0xfff1e0,
  trailDrift: new THREE.Vector3(-7, 0.5, 0), // bụi tuyết lùi về bên trái
  trailScale: 110,
});

// ── hoàng hôn trên triền tuyết ─────────────────────────────────
scene.background = new THREE.Color(0xf2b98d);
scene.fog = new THREE.Fog(0xf2b98d, 55, 160);

scene.add(new THREE.HemisphereLight(0xffe0c0, 0x8a7a9e, 1.15));
const sun = new THREE.DirectionalLight(0xffca8f, 1.7);
sun.position.set(40, 26, -60);
scene.add(sun);

// mặt trời lặn sau rặng núi
const sunDisc = new THREE.Mesh(
  new THREE.SphereGeometry(9, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xffe3b3 })
);
sunDisc.position.set(55, 14, -110);
scene.add(sunDisc);

const snowMat = new THREE.MeshStandardMaterial({ color: 0xfbeee2, roughness: 0.95 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 120), snowMat);
ground.rotation.x = -Math.PI / 2;
ground.position.set(40, 0, -20);
scene.add(ground);

// hai lớp núi hậu cảnh cho chiều sâu
const farPeak = new THREE.MeshStandardMaterial({ color: 0xd8a8a0, roughness: 1, flatShading: true });
const nearPeak = new THREE.MeshStandardMaterial({ color: 0xe8cabc, roughness: 1, flatShading: true });
for (let i = 0; i < 12; i++) {
  const far = i % 2 === 0;
  const h = far ? 30 + Math.random() * 40 : 16 + Math.random() * 22;
  const peak = new THREE.Mesh(
    new THREE.ConeGeometry(12 + Math.random() * 16, h, 5),
    far ? farPeak : nearPeak
  );
  peak.position.set(-70 + i * 18 + Math.random() * 8, h / 2 - 2, far ? -95 - Math.random() * 25 : -55 - Math.random() * 20);
  scene.add(peak);
}

// tuyết rơi quanh khung hình
const FLAKES = 350;
const flakePos = new Float32Array(FLAKES * 3);
for (let i = 0; i < FLAKES; i++) {
  flakePos[i * 3] = -25 + Math.random() * 75;
  flakePos[i * 3 + 1] = Math.random() * 24;
  flakePos[i * 3 + 2] = -30 + Math.random() * 42;
}
const flakeGeo = new THREE.BufferGeometry();
flakeGeo.setAttribute('position', new THREE.BufferAttribute(flakePos, 3));
const snowfall = new THREE.Points(flakeGeo, new THREE.PointsMaterial({
  color: 0xffffff, size: 0.14, transparent: true, opacity: 0.8, depthWrite: false,
}));
snowfall.frustumCulled = false;
scene.add(snowfall);

function updateSnowfall(dt, scroll) {
  const p = flakeGeo.attributes.position.array;
  for (let i = 0; i < FLAKES; i++) {
    p[i * 3] -= scroll * 0.5;
    p[i * 3 + 1] -= dt * (3.5 + (i % 5));
    if (p[i * 3 + 1] < 0) p[i * 3 + 1] += 24;
    if (p[i * 3] < -25) p[i * 3] += 75;
  }
  flakeGeo.attributes.position.needsUpdate = true;
}

// ── người trượt tuyết (nhìn nghiêng, lướt về +x) ───────────────
const HEADING = -Math.PI / 2 - 0.22; // ván chỉ về +x, hơi xoay về camera

function buildSkier() {
  const group = new THREE.Group();
  group.rotation.y = HEADING;
  const pose = new THREE.Group();
  group.add(pose);

  const jacket = new THREE.MeshStandardMaterial({ color: 0xff9e5e, roughness: 0.8, flatShading: true });
  const pants = new THREE.MeshStandardMaterial({ color: 0x35406b, roughness: 0.9, flatShading: true });
  const skin = new THREE.MeshStandardMaterial({ color: 0xf0c9a0, roughness: 0.8 });
  const helmet = new THREE.MeshStandardMaterial({ color: 0xd94f30, roughness: 0.35 });
  const skiMat = new THREE.MeshStandardMaterial({
    color: 0xffd6a8, roughness: 0.3, emissive: 0xaa5522, emissiveIntensity: 0.25,
  });

  for (const side of [-1, 1]) {
    const ski = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 2.0), skiMat);
    ski.position.set(side * 0.2, 0.05, -0.15);
    pose.add(ski);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.24), pants);
    leg.position.set(side * 0.2, 0.42, 0.05);
    pose.add(leg);
  }

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.4), jacket);
  torso.position.set(0, 0.95, 0.02);
  torso.rotation.x = 0.45;
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
  return { group, pose };
}

const player = buildSkier();
let py = 0;         // độ cao
let vy = 0;
let grounded = true;
let speed = CONFIG.speedStart;

// ── chướng ngại vật: đá / chông băng / thông / ghế cáp treo ────
const rockMat = new THREE.MeshStandardMaterial({ color: 0x8a7f8e, roughness: 0.95, flatShading: true });
const iceMat = new THREE.MeshStandardMaterial({
  color: 0xbfe8ff, roughness: 0.2, flatShading: true,
  emissive: 0x3388bb, emissiveIntensity: 0.35,
});
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5e3a24, roughness: 0.95, flatShading: true });
const pineMat = new THREE.MeshStandardMaterial({ color: 0x2a6647, roughness: 0.9, flatShading: true });
const pineSnow = new THREE.MeshStandardMaterial({ color: 0xf6ece2, roughness: 0.95, flatShading: true });
const steelMat = new THREE.MeshStandardMaterial({ color: 0x3a3f4c, roughness: 0.5 });
const chairMat = new THREE.MeshStandardMaterial({
  color: 0xd94f30, roughness: 0.6, flatShading: true,
  emissive: 0x581505, emissiveIntensity: 0.4,
});

function buildSmallPine() {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 0.7, 6), trunkMat);
  trunk.position.y = 0.35;
  tree.add(trunk);
  for (let l = 0; l < 2; l++) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.85 - l * 0.25, 0.95, 7), l === 1 ? pineSnow : pineMat);
    cone.position.y = 0.95 + l * 0.6;
    tree.add(cone);
  }
  return tree;
}

const obstacles = new Spawner({
  scene,
  mode: 'side',
  count: 8,
  spacing: 16,
  first: 40,
  behind: 26, // tái chế khi lùi quá 26 về bên trái
  passLine: 2,
  build: () => {
    const item = new THREE.Group();

    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85), rockMat);
    rock.position.y = 0.5;
    rock.rotation.set(Math.random(), Math.random(), Math.random());

    const spikes = new THREE.Group();
    for (let s = 0; s < 3; s++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.1 + Math.random() * 0.5, 5), iceMat);
      spike.position.set(-0.55 + s * 0.55, 0.55, (Math.random() - 0.5) * 0.3);
      spike.rotation.z = (Math.random() - 0.5) * 0.25;
      spikes.add(spike);
    }

    const pine = buildSmallPine();

    // ghế cáp treo lơ lửng — luồn bên dưới, đừng nhảy!
    const chair = new THREE.Group();
    const cable = new THREE.Mesh(new THREE.BoxGeometry(16, 0.05, 0.05), steelMat);
    cable.position.y = 4.6;
    const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5), steelMat);
    hanger.position.y = 3.85;
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.16, 0.6), chairMat);
    seat.position.y = 3.05;
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.7, 0.14), chairMat);
    back.position.set(0, 3.45, 0.25);
    chair.add(cable, hanger, seat, back);

    item.add(rock, spikes, pine, chair);
    item.userData.variants = { rock, spikes, pine, chair };
    return item;
  },
  place: (item) => {
    const { rock, spikes, pine, chair } = item.userData.variants;
    rock.visible = spikes.visible = pine.visible = chair.visible = false;
    const roll = Math.random();
    item.userData.scorable = true;
    item.userData.scoreCheck = null;

    if (roll < 0.3) {
      rock.visible = true;
      item.userData.colliders = [{ dx: 0, dy: 0.5, r: 0.75 }];
    } else if (roll < 0.55) {
      spikes.visible = true;
      item.userData.colliders = [
        { dx: -0.55, dy: 0.55, r: 0.55 },
        { dx: 0.55, dy: 0.55, r: 0.55 },
      ];
    } else if (roll < 0.8) {
      pine.visible = true;
      item.userData.colliders = [
        { dx: 0, dy: 0.7, r: 0.6 },
        { dx: 0, dy: 1.4, r: 0.45 },
      ];
    } else {
      chair.visible = true;
      item.userData.colliders = [
        { dx: 0, dy: 3.1, r: 0.8 },
        { dx: 0, dy: 3.9, r: 0.5 },
      ];
    }
  },
});
obstacles.setVisible(false);

// rừng thông hậu cảnh chạy chậm hơn tạo hiệu ứng thị sai (parallax)
const bgTrees = new Spawner({
  scene,
  mode: 'side',
  count: 16,
  spacing: 9,
  first: -20,
  behind: 40,
  passLine: 999,
  build: () => {
    const clump = new THREE.Group();
    for (let t = 0; t < 2; t++) {
      const tree = buildSmallPine();
      const s = 1.6 + Math.random() * 1.8;
      tree.scale.setScalar(s);
      tree.position.set((Math.random() - 0.5) * 4, 0, -10 - Math.random() * 14);
      clump.add(tree);
    }
    return clump;
  },
  place: () => {},
});
bgTrees.reset();

// ── điều khiển: một nút nhảy ───────────────────────────────────
function jump() {
  if (!grounded) return;
  grounded = false;
  vy = CONFIG.jump;
  sfx.whoosh();
  effects.puff(new THREE.Vector3(-0.4, 0.15, 0), 0xffffff);
}

new Input({
  onAction: () => {
    if (game.state === 'menu') game.play();
    else if (game.state === 'playing') jump();
    else if (game.state === 'dead' && game.overShown) game.play();
  },
});

// ── móc gameplay vào vòng đời của kit ──────────────────────────
let scroll = 0;

game.hooks.reset = () => {
  py = 0;
  vy = 0;
  grounded = true;
  speed = CONFIG.speedStart;
  player.group.position.set(0, 0, 0);
  player.pose.rotation.set(0, 0, 0);
  effects.clearTrail();
  obstacles.reset({});
  obstacles.setVisible(true);
};

game.hooks.update = (dt) => {
  // vật lý nhảy
  if (!grounded) {
    vy += CONFIG.gravity * dt;
    py += vy * dt;
    if (py <= 0) {
      py = 0;
      vy = 0;
      grounded = true;
      effects.puff(new THREE.Vector3(0, 0.15, 0), 0xffffff); // bụi tuyết khi tiếp đất
    }
  }
  player.group.position.y = py;

  // dáng người: cúi khi trên đất, duỗi khi bay
  const targetPitch = grounded ? 0 : THREE.MathUtils.clamp(-vy * 0.03, -0.4, 0.3);
  player.pose.rotation.x += (targetPitch - player.pose.rotation.x) * Math.min(1, dt * 8);

  speed = Math.min(CONFIG.speedMax, speed + CONFIG.speedRamp * dt);
  scroll = speed * dt;
  wind.set(speed / CONFIG.speedMax);

  const scored = obstacles.update(scroll, dt, {});
  if (scored) {
    game.addScore(scored);
    effects.ring(new THREE.Vector3(-1.5, 1.2, 0), 0xffd6a8);
  }
  bgTrees.update(scroll * 0.5, dt); // hậu cảnh trôi chậm hơn

  // bụi tuyết sau ván khi lướt trên mặt đất
  if (grounded) effects.emitTrail(new THREE.Vector3(-0.9, 0.12, 0.1), dt);

  if (obstacles.hits(0, py + 0.75, CONFIG.playerRadius)) {
    effects.crashBurst(new THREE.Vector3(0, py + 0.8, 0), 0xffffff, 0xff9e5e);
    game.crash();
  }
};

game.hooks.menuTick = (dt, elapsed) => {
  scroll = 2.2 * dt;
  py = 0;
  player.group.position.y = 0;
  player.pose.rotation.z = Math.sin(elapsed * 1.7) * 0.05;
  bgTrees.update(scroll * 0.5, dt);
  wind.set(0.1);
};

game.hooks.deadTick = (dt) => {
  // ngã nhào theo quán tính
  vy += CONFIG.gravity * dt;
  py = Math.max(0, py + vy * dt);
  player.group.position.y = py;
  player.pose.rotation.z += dt * 7;
  player.pose.rotation.x += dt * 3;
  scroll = Math.max(0, scroll - dt * 2);
  obstacles.update(scroll, dt, {});
  bgTrees.update(scroll * 0.5, dt);
  wind.set(0);
};

game.hooks.frame = (dt, rawDt, elapsed) => {
  updateSnowfall(dt, scroll);
  effects.update(dt, rawDt);

  // camera nhìn ngang kiểu flappy: người chơi lệch trái khung hình,
  // hơi nghiêng trục để triền tuyết đọc như đang đổ dốc
  const shakeX = (Math.random() - 0.5) * effects.shake * 0.7;
  const shakeY = (Math.random() - 0.5) * effects.shake * 0.7;
  const camX = 2.4 + Math.sin(elapsed * 0.18) * 0.35 + shakeX;
  const camY = 3.4 + py * 0.3 + shakeY;
  camera.position.x += (camX - camera.position.x) * Math.min(1, rawDt * 6);
  camera.position.y += (camY - camera.position.y) * Math.min(1, rawDt * 5);
  camera.position.z = 15.5;
  camera.lookAt(3.4, 1.5 + py * 0.4, 0);
  camera.rotateZ(0.055);
};

game.on('play', () => hud.el.menuBest && (hud.el.menuBest.textContent = hud.best));

game.start();

// tay nắm debug/E2E — kiểm thử không cần cào UI
window.__game = {
  game, sfx, music, obstacles, jump,
  get py() { return py; },
  get grounded() { return grounded; },
  get speed() { return speed; },
};
