// ── NEON RIDER — demo đua moto của Runner Kit 3D ────────────────
// Phóng 🏍️ trên xa lộ neon 3 làn về đêm, gõ ←/→ (hoặc chạm
// trái/phải) để đổi làn, vượt xe ghi điểm. Minh hoạ cách dùng kit
// với điều khiển "đổi làn rời rạc" (onSteerTap).
import * as THREE from 'three';
import { Game } from '../../kit/core.js';
import { Input } from '../../kit/input.js';
import { HUD } from '../../kit/hud.js';
import { Effects } from '../../kit/effects.js';
import { Spawner } from '../../kit/spawner.js';
import { Leaderboard } from '../../kit/leaderboard.js';
import { SFX, Music, Drone, wireAudio } from '../../kit/audio.js';

const CONFIG = {
  lanes: [-3.4, 0, 3.4],
  speedStart: 24,
  speedMax: 46,
  speedRamp: 0.55,
  trafficSpeed: 10,   // xe cộ cũng chạy tới, ta vượt bằng tốc độ chênh lệch
  playerRadius: 0.55,
};

// ── khởi tạo kit ───────────────────────────────────────────────
const game = new Game({
  canvas: document.getElementById('game'),
  fov: { landscape: 64, portrait: 78 },
  bloom: { strength: 0.85, radius: 0.75, threshold: 0.55 }, // đêm neon cần rực hơn
});
const { scene, camera } = game;

const sfx = new SFX();
const music = new Music(sfx, { bar: 2.6 }); // nhịp gấp hơn cho không khí đua
const engine = new Drone(sfx, { type: 'engine' });
wireAudio(game, sfx, music);
game.on('play', () => engine.start());

const lb = new Leaderboard({
  storageKey: 'neonrider-scores',
  nameKey: 'neonrider-name',
  title: '🏆 tay đua cự phách',
});
const hud = new HUD({ bestKey: 'neonrider-best', lb }).attach(game).bindAudio(sfx);

const effects = new Effects(scene, {
  trailColor: 0xff3355,                       // vệt đèn hậu đỏ
  trailDrift: new THREE.Vector3(0, 0.2, 14),
  trailScale: 55,
});

// ── màn đêm & xa lộ ────────────────────────────────────────────
scene.background = new THREE.Color(0x0a0616);
scene.fog = new THREE.Fog(0x0a0616, 30, 150);

scene.add(new THREE.HemisphereLight(0x4455cc, 0x141022, 1.0));
const moonlight = new THREE.DirectionalLight(0x8899ff, 0.5);
moonlight.position.set(20, 50, -30);
scene.add(moonlight);

const asphalt = new THREE.Mesh(
  new THREE.PlaneGeometry(13, 400),
  new THREE.MeshStandardMaterial({ color: 0x14121c, roughness: 0.9 })
);
asphalt.rotation.x = -Math.PI / 2;
asphalt.position.z = -140;
scene.add(asphalt);

const shoulder = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 400),
  new THREE.MeshStandardMaterial({ color: 0x0c0a14, roughness: 1 })
);
shoulder.rotation.x = -Math.PI / 2;
shoulder.position.set(0, -0.02, -140);
scene.add(shoulder);

// lan can phát sáng hai bên — bloom biến chúng thành dải neon
const railMat = new THREE.MeshStandardMaterial({
  color: 0xff2d78, emissive: 0xff2d78, emissiveIntensity: 1.4,
});
for (const side of [-1, 1]) {
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 400), railMat);
  rail.position.set(side * 6.4, 0.5, -140);
  scene.add(rail);
}

// trăng và sao
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(6, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xd8e2ff })
);
moon.position.set(35, 55, -180);
scene.add(moon);

const STARS = 250;
const starPos = new Float32Array(STARS * 3);
for (let i = 0; i < STARS; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 360;
  starPos[i * 3 + 1] = 25 + Math.random() * 110;
  starPos[i * 3 + 2] = -140 - Math.random() * 80;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
  color: 0xffffff, size: 0.5, transparent: true, opacity: 0.8, depthWrite: false,
})));

// vạch kẻ làn đứt quãng — tái dùng Spawner làm dải trang trí cuộn
const dashMat = new THREE.MeshStandardMaterial({
  color: 0xf6f2ff, emissive: 0xaaaacc, emissiveIntensity: 0.5,
});
const dashes = new Spawner({
  scene,
  count: 34,
  spacing: 6,
  first: -12,
  behind: 12,
  passLine: 999,
  build: () => {
    const g = new THREE.Group();
    for (const x of [-1.7, 1.7]) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 2.2), dashMat);
      dash.position.set(x, 0.01, 0);
      g.add(dash);
    }
    return g;
  },
  place: () => {},
});
dashes.reset();

// đèn đường + toà nhà neon hai bên
const lampPole = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.6 });
const lampGlow = new THREE.MeshStandardMaterial({
  color: 0xffe9b0, emissive: 0xffc860, emissiveIntensity: 3,
});
const buildingMat = new THREE.MeshStandardMaterial({ color: 0x110d20, roughness: 0.8, flatShading: true });
const neonMats = [0x33e6ff, 0xff2d78, 0xb44dff, 0x3dff9e].map((c) =>
  new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 2.2 })
);

const scenery = new Spawner({
  scene,
  count: 12,
  spacing: 24,
  first: 0,
  behind: 20,
  passLine: 999,
  build: () => {
    const g = new THREE.Group();
    for (const side of [-1, 1]) {
      // đèn cao áp
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 5.6), lampPole);
      pole.position.set(side * 6.8, 2.8, 0);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), lampGlow);
      lamp.position.set(side * 6.1, 5.5, 0);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), lampPole);
      arm.position.set(side * 6.4, 5.55, 0);
      g.add(pole, lamp, arm);

      // toà nhà tối với viền neon trên nóc
      const h = 6 + Math.random() * 16;
      const w = 4 + Math.random() * 5;
      const bld = new THREE.Mesh(new THREE.BoxGeometry(w, h, 6 + Math.random() * 6), buildingMat);
      bld.position.set(side * (13 + Math.random() * 10), h / 2, (Math.random() - 0.5) * 10);
      const neon = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.2, 0.18, 0.18),
        neonMats[Math.floor(Math.random() * neonMats.length)]
      );
      neon.position.set(bld.position.x, h + 0.1, bld.position.z + 3);
      g.add(bld, neon);
    }
    return g;
  },
  place: () => {},
});
scenery.reset();

// ── chiếc moto ─────────────────────────────────────────────────
function buildBike() {
  const group = new THREE.Group();
  const pose = new THREE.Group(); // nghiêng xe khi đổi làn
  group.add(pose);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff2d78, roughness: 0.35, metalness: 0.4, flatShading: true,
    emissive: 0x66102f, emissiveIntensity: 0.5,
  });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.7, flatShading: true });
  const riderMat = new THREE.MeshStandardMaterial({ color: 0x2c2c3a, roughness: 0.85, flatShading: true });
  const helmetMat = new THREE.MeshStandardMaterial({
    color: 0x33e6ff, roughness: 0.2, emissive: 0x0e5866, emissiveIntensity: 0.6,
  });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0c0c12, roughness: 0.9 });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xcfe8ff, emissiveIntensity: 4,
  });
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xff2222, emissive: 0xff1111, emissiveIntensity: 3,
  });

  // thân xe
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.42, 1.5), bodyMat);
  tank.position.set(0, 0.72, 0);
  tank.rotation.x = -0.08;
  pose.add(tank);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.2, 0.8), darkMat);
  seat.position.set(0, 0.86, 0.62);
  pose.add(seat);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 2.0), darkMat);
  frame.position.set(0, 0.48, 0.1);
  pose.add(frame);

  // càng trước
  const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9), darkMat);
  fork.position.set(0, 0.62, -0.95);
  fork.rotation.x = 0.4;
  pose.add(fork);

  // bánh xe
  const wheels = [];
  for (const z of [-1.05, 1.0]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.22, 14), wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0, 0.36, z);
    pose.add(wheel);
    wheels.push(wheel);
  }

  // người lái cúi sát
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.4, 0.8), riderMat);
  torso.position.set(0, 1.08, 0.36);
  torso.rotation.x = 0.75;
  pose.add(torso);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), helmetMat);
  helmet.position.set(0, 1.28, -0.1);
  pose.add(helmet);

  // đèn pha + đèn hậu (bloom làm chúng rực lên)
  const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), headlightMat);
  headlight.position.set(0, 0.72, -1.28);
  pose.add(headlight);
  const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.06), taillightMat);
  taillight.position.set(0, 0.82, 1.06);
  pose.add(taillight);

  scene.add(group);
  return { group, pose, wheels };
}

const player = buildBike();
let lane = 1;          // làn hiện tại (0..2)
let px = 0;
let speed = CONFIG.speedStart;

// ── dòng xe cộ ─────────────────────────────────────────────────
const CAR_COLORS = [0xe74c3c, 0x3498db, 0xf1c40f, 0x9b59b6, 0x2ecc71, 0xd8dde6];
const glassMat = new THREE.MeshStandardMaterial({ color: 0x101820, roughness: 0.2, metalness: 0.5 });
const tireMat = new THREE.MeshStandardMaterial({ color: 0x0c0c12, roughness: 0.9 });
const carTail = new THREE.MeshStandardMaterial({
  color: 0xff2222, emissive: 0xff0f0f, emissiveIntensity: 2.6,
});

function buildVehicle() {
  const item = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.4, metalness: 0.3, flatShading: true,
  });

  // ô tô con
  const car = new THREE.Group();
  const carBody = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.6, 3.6), paint);
  carBody.position.y = 0.55;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 1.8), glassMat);
  cabin.position.set(0, 1.05, 0.2);
  car.add(carBody, cabin);

  // xe tải
  const truck = new THREE.Group();
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.3, 1.6), paint);
  cab.position.set(0, 0.95, -2.2);
  const box = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.1, 4.6), new THREE.MeshStandardMaterial({
    color: 0x8890a0, roughness: 0.8, flatShading: true,
  }));
  box.position.set(0, 1.35, 1.2);
  truck.add(cab, box);

  // bánh + đèn hậu chung cho cả hai biến thể
  for (const variant of [car, truck]) {
    for (const sx of [-0.85, 0.85]) {
      for (const sz of [-1.2, 1.2]) {
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.24, 10), tireMat);
        tire.rotation.z = Math.PI / 2;
        tire.position.set(sx, 0.32, sz * (variant === truck ? 1.8 : 1));
        variant.add(tire);
      }
    }
    for (const sx of [-0.6, 0.6]) {
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.06), carTail);
      tl.position.set(sx, 0.72, variant === truck ? 3.55 : 1.85);
      variant.add(tl);
    }
  }

  item.add(car, truck);
  item.userData.variants = { car, truck };
  item.userData.paint = paint;
  return item;
}

const traffic = new Spawner({
  scene,
  count: 9,
  spacing: 26,
  first: 65,
  behind: 16,
  passLine: 2.5,
  build: buildVehicle,
  place: (item) => {
    const { car, truck } = item.userData.variants;
    const isTruck = Math.random() < 0.25;
    car.visible = !isTruck;
    truck.visible = isTruck;
    item.userData.paint.color.set(CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]);
    item.position.x = CONFIG.lanes[Math.floor(Math.random() * 3)];
    item.userData.colliders = isTruck
      ? [{ dx: 0, dz: -2.4, r: 1.1 }, { dx: 0, dz: 0, r: 1.15 }, { dx: 0, dz: 2.4, r: 1.1 }]
      : [{ dx: 0, dz: -1.0, r: 1.0 }, { dx: 0, dz: 1.0, r: 1.0 }];
    item.userData.scorable = true;
    // xe cộ tự chạy tới trước — ta chỉ vượt bằng phần tốc độ chênh lệch
    item.userData.tick = (it, dt) => { it.position.z -= CONFIG.trafficSpeed * dt; };
  },
});
traffic.setVisible(false);

// ── điều khiển: đổi làn rời rạc ────────────────────────────────
const input = new Input({
  onAction: () => {
    if (game.state === 'menu') game.play();
    else if (game.state === 'dead' && game.overShown) game.play();
  },
  onSteerTap: (dir) => {
    if (game.state === 'menu') { game.play(); return; }
    if (game.state !== 'playing') return;
    const next = THREE.MathUtils.clamp(lane + dir, 0, 2);
    if (next !== lane) {
      lane = next;
      sfx.whoosh();
    }
  },
});

// ── móc gameplay vào vòng đời của kit ──────────────────────────
let scroll = 0;

game.hooks.reset = () => {
  lane = 1;
  px = 0;
  speed = CONFIG.speedStart;
  player.group.position.set(0, 0, 0);
  player.group.rotation.set(0, 0, 0);
  player.pose.rotation.set(0, 0, 0);
  player.pose.position.set(0, 0, 0);
  effects.clearTrail();
  traffic.reset({});
  traffic.setVisible(true);
};

game.hooks.update = (dt, elapsed) => {
  // lướt mượt sang làn mục tiêu, nghiêng xe theo hướng lách
  const targetX = CONFIG.lanes[lane];
  const dx = targetX - px;
  px += dx * Math.min(1, dt * 8);
  player.group.position.x = px;
  player.pose.rotation.z = THREE.MathUtils.clamp(-dx * 0.28, -0.5, 0.5);

  speed = Math.min(CONFIG.speedMax, speed + CONFIG.speedRamp * dt);
  scroll = speed * dt;
  engine.set(speed / CONFIG.speedMax);

  // bánh xe quay theo tốc độ
  for (const w of player.wheels) w.rotation.x -= speed * dt * 2.6;
  player.pose.position.y = Math.sin(elapsed * 40) * 0.008; // máy rung nhẹ

  const scored = traffic.update(scroll, dt, {});
  if (scored) game.addScore(scored);
  dashes.update(scroll, dt);
  scenery.update(scroll, dt);

  // vệt đèn hậu
  effects.emitTrail(new THREE.Vector3(px, 0.8, 1.1), dt);

  if (traffic.hits(px, 0, CONFIG.playerRadius)) {
    effects.crashBurst(new THREE.Vector3(px, 0.9, -0.5), 0xffc860, 0xff2d78);
    game.crash();
  }
};

game.hooks.menuTick = (dt, elapsed) => {
  // nổ máy chờ đèn xanh
  scroll = 3 * dt;
  player.pose.position.y = Math.sin(elapsed * 30) * 0.012;
  player.pose.rotation.z = Math.sin(elapsed * 1.3) * 0.04;
  dashes.update(scroll, dt);
  scenery.update(scroll, dt);
};

game.hooks.deadTick = (dt) => {
  // xe văng xoay, trượt dài
  scroll = Math.max(0, scroll - dt * 4);
  player.pose.rotation.z += dt * 9;
  player.group.rotation.y += dt * 2;
  traffic.update(scroll, dt, {});
  dashes.update(scroll, dt);
  scenery.update(scroll, dt);
  engine.set(0);
};

game.hooks.frame = (dt, rawDt, elapsed) => {
  effects.update(dt, rawDt);

  // camera đuổi: hạ thấp + lùi xa dần theo tốc độ cho cảm giác phóng
  const k = (speed - CONFIG.speedStart) / (CONFIG.speedMax - CONFIG.speedStart);
  const shakeX = (Math.random() - 0.5) * effects.shake;
  const shakeY = (Math.random() - 0.5) * effects.shake;
  const camX = px * 0.6 + Math.sin(elapsed * 0.23) * 0.2 + shakeX;
  const camY = 3.1 + k * 0.5 + shakeY;
  camera.position.x += (camX - camera.position.x) * Math.min(1, rawDt * 6);
  camera.position.y += (camY - camera.position.y) * Math.min(1, rawDt * 5);
  camera.position.z = 7.2 + k * 1.4;
  camera.lookAt(px * 0.8, 1.0, -11);
};

game.on('play', () => hud.el.menuBest && (hud.el.menuBest.textContent = hud.best));

game.start();

// tay nắm debug/E2E — kiểm thử không cần cào UI
window.__game = {
  game, sfx, music, traffic, CONFIG,
  get lane() { return lane; },
  set lane(v) { lane = v; },
};
