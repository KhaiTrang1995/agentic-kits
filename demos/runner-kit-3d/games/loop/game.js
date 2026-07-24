// ── LOOP STREET — đua xe màn ngang (side-runner) ────────────────
// Xe phóng từ trái sang phải, nhảy qua thùng, luồn dưới biển QC,
// lọt vòng neon để ghi điểm. Minh hoạ:
//   • mode: 'side' + nhảy có mặt đất
//   • scoreCheck (chỉ ghi điểm khi lọt đúng vòng)
//   • onAction (nhảy) kết hợp input.steer (lái dọc trục Z nhẹ)
//
// Khác ski-side: theme đô thị + vòng ghi điểm có điều kiện.
// Khác moto: góc nhìn ngang, không đổi làn rời rạc.
import * as THREE from 'three';
import {
  Game, Input, HUD, Effects, Spawner, Leaderboard, SFX, Music, Drone, wireAudio,
} from '../../kit/index.js';

const CONFIG = {
  gravity: -42,
  jump: 14,
  speedStart: 14,
  speedMax: 28,
  speedRamp: 0.45,
  steerZ: 2.8,         // lái nhẹ trên trục Z (chiều sâu)
  zHalf: 1.6,
  playerRadius: 0.55,
};

const game = new Game({
  canvas: document.getElementById('game'),
  fov: { landscape: 54, portrait: 70 },
  bloom: { strength: 0.9, radius: 0.7, threshold: 0.5 },
  exposure: 1.0,
});
const { scene, camera } = game;

const sfx = new SFX();
const music = new Music(sfx, { bar: 2.5 });
const engine = new Drone(sfx, { type: 'engine' });
wireAudio(game, sfx, music);
game.on('play', () => engine.start());

const lb = new Leaderboard({
  storageKey: 'loopstreet-scores',
  nameKey: 'loopstreet-name',
  title: '🏆 tay lái đường phố',
});
const hud = new HUD({ bestKey: 'loopstreet-best', lb }).attach(game).bindAudio(sfx);

const effects = new Effects(scene, {
  trailColor: 0xff6b2d,
  trailDrift: new THREE.Vector3(-10, 0.4, 0),
  trailScale: 90,
});

// ── phố đêm ────────────────────────────────────────────────────
scene.background = new THREE.Color(0x1a0c18);
scene.fog = new THREE.Fog(0x1a0c18, 35, 120);

scene.add(new THREE.HemisphereLight(0xff8866, 0x221133, 0.95));
const lamp = new THREE.DirectionalLight(0xffc090, 0.9);
lamp.position.set(20, 30, -20);
scene.add(lamp);

// mặt đường
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 14),
  new THREE.MeshStandardMaterial({ color: 0x1c1420, roughness: 0.95 })
);
road.rotation.x = -Math.PI / 2;
road.position.set(40, 0, 0);
scene.add(road);

// vỉa hè
const curbMat = new THREE.MeshStandardMaterial({ color: 0x2a2030, roughness: 0.9 });
for (const z of [-8.5, 8.5]) {
  const curb = new THREE.Mesh(new THREE.BoxGeometry(500, 0.35, 3), curbMat);
  curb.position.set(40, 0.15, z);
  scene.add(curb);
}

// dải phân cách neon
const neonLine = new THREE.Mesh(
  new THREE.BoxGeometry(500, 0.04, 0.12),
  new THREE.MeshStandardMaterial({
    color: 0xffe14a, emissive: 0xffe14a, emissiveIntensity: 2.2,
  })
);
neonLine.position.set(40, 0.03, 0);
scene.add(neonLine);

// toà nhà xa (tĩnh + parallax spawner)
const bldMat = new THREE.MeshStandardMaterial({ color: 0x140c1c, roughness: 0.9, flatShading: true });
const neonMats = [0xff6b2d, 0x33e6ff, 0xb44dff, 0xffe14a].map((c) =>
  new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 2.0 })
);

const scenery = new Spawner({
  scene,
  mode: 'side',
  count: 14,
  spacing: 16,
  first: -20,
  behind: 40,
  passLine: 999,
  build: () => {
    const g = new THREE.Group();
    for (const side of [-1, 1]) {
      const h = 5 + Math.random() * 14;
      const w = 3 + Math.random() * 4;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 3.5), bldMat);
      b.position.set((Math.random() - 0.5) * 4, h / 2, side * (10 + Math.random() * 6));
      const neon = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.7, 0.15, 0.15),
        neonMats[Math.floor(Math.random() * neonMats.length)]
      );
      neon.position.set(b.position.x, h + 0.1, b.position.z);
      g.add(b, neon);
    }
    return g;
  },
  place: () => {},
});
scenery.reset();

// ── xe thể thao ────────────────────────────────────────────────
function buildCar() {
  const group = new THREE.Group();
  const pose = new THREE.Group();
  group.add(pose);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff6b2d, roughness: 0.35, metalness: 0.45, flatShading: true,
    emissive: 0x661800, emissiveIntensity: 0.45,
  });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1218, roughness: 0.7, flatShading: true });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x88c8ff, roughness: 0.2, metalness: 0.5 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0c0c12, roughness: 0.9 });
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffe8c0, emissiveIntensity: 3.5,
  });
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xff2222, emissive: 0xff1111, emissiveIntensity: 3,
  });

  // thân hướng +x (bay sang phải) — local: dài theo Z rồi xoay
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 1.0), bodyMat);
  body.position.set(0, 0.48, 0);
  pose.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.38, 0.85), glassMat);
  cabin.position.set(-0.15, 0.82, 0);
  pose.add(cabin);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.2, 0.9), bodyMat);
  hood.position.set(0.7, 0.55, 0);
  pose.add(hood);

  const wheels = [];
  for (const sx of [-0.55, 0.55]) {
    for (const sz of [-0.45, 0.45]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 12), wheelMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(sx, 0.28, sz);
      pose.add(w);
      wheels.push(w);
    }
  }

  const hl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), lightMat);
  hl.position.set(1.05, 0.48, 0.28);
  pose.add(hl);
  const hl2 = hl.clone();
  hl2.position.z = -0.28;
  pose.add(hl2);

  const tl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.7), tailMat);
  tl.position.set(-1.02, 0.5, 0);
  pose.add(tl);

  scene.add(group);
  return { group, pose, wheels };
}

const player = buildCar();
let py = 0;
let vy = 0;
let pz = 0; // lái nhẹ trên chiều sâu
let grounded = true;
let speed = CONFIG.speedStart;

// ── chướng ngại: thùng / biển QC / vòng neon ───────────────────
const crateMat = new THREE.MeshStandardMaterial({ color: 0xc4783a, roughness: 0.85, flatShading: true });
const steelMat = new THREE.MeshStandardMaterial({ color: 0x555566, roughness: 0.5 });
const boardMat = new THREE.MeshStandardMaterial({
  color: 0xff6b2d, roughness: 0.4, flatShading: true,
  emissive: 0xff6b2d, emissiveIntensity: 0.9,
});
const ringMat = new THREE.MeshStandardMaterial({
  color: 0x33e6ff, roughness: 0.25,
  emissive: 0x33e6ff, emissiveIntensity: 2.4,
});

const obstacles = new Spawner({
  scene,
  mode: 'side',
  count: 8,
  spacing: 15,
  first: 38,
  behind: 24,
  passLine: 2,
  build: () => {
    const item = new THREE.Group();

    // thùng trên đường — phải nhảy
    const crate = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 1.1), crateMat);
    box.position.y = 0.5;
    crate.add(box);
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.12, 1.15),
      new THREE.MeshStandardMaterial({ color: 0x222, roughness: 0.8 })
    );
    stripe.position.y = 0.5;
    crate.add(stripe);

    // biển quảng cáo cao — luồn DƯỚI
    const banner = new THREE.Group();
    const poleL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.2), steelMat);
    poleL.position.set(0, 2.1, -2.2);
    const poleR = poleL.clone();
    poleR.position.z = 2.2;
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 4.6), boardMat);
    sign.position.y = 3.5;
    banner.add(poleL, poleR, sign);

    // vòng neon — lọt giữa để ghi điểm (scoreCheck)
    const hoop = new THREE.Group();
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.12, 8, 28), ringMat);
    torus.rotation.y = Math.PI / 2;
    torus.position.y = 1.5;
    hoop.add(torus);
    // giá đỡ
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 2.8), steelMat);
    stand.position.y = 0.15;
    hoop.add(stand);

    item.add(crate, banner, hoop);
    item.userData.variants = { crate, banner, hoop };
    return item;
  },
  place: (item) => {
    const { crate, banner, hoop } = item.userData.variants;
    crate.visible = banner.visible = hoop.visible = false;
    item.userData.scoreCheck = null;
    item.userData.scorable = true;

    const roll = Math.random();
    // đặt nhẹ lệch Z để lái còn ý nghĩa
    item.position.z = (Math.random() - 0.5) * 1.2;

    if (roll < 0.38) {
      crate.visible = true;
      item.userData.colliders = [{ dx: 0, dy: 0.5, r: 0.7 }];
    } else if (roll < 0.68) {
      banner.visible = true;
      item.userData.colliders = [
        { dx: 0, dy: 3.5, r: 0.85 },
        { dx: 0, dy: 3.0, r: 0.7 },
      ];
    } else {
      hoop.visible = true;
      // vòng không "đụng chết" khung ngoài — chỉ khung dày + yêu cầu lọt giữa
      item.userData.colliders = [
        { dx: 0, dy: 2.75, r: 0.35 }, // đỉnh vòng
        { dx: 0, dy: 0.35, r: 0.35 }, // đáy vòng
      ];
      // chỉ ghi điểm khi xe lọt gần tâm vòng (độ cao ~1.5)
      item.userData.scoreCheck = (ctx) => {
        const dy = Math.abs((ctx.playerY || 0) + 0.5 - 1.5);
        const dz = Math.abs((ctx.playerZ || 0) - item.position.z);
        return dy < 1.0 && dz < 1.4;
      };
    }
  },
});
obstacles.setVisible(false);

// vạch đường đứt quãng
const dashMat = new THREE.MeshStandardMaterial({
  color: 0xf6f2ff, emissive: 0xaaaacc, emissiveIntensity: 0.4,
});
const dashes = new Spawner({
  scene,
  mode: 'side',
  count: 20,
  spacing: 5,
  first: -8,
  behind: 20,
  passLine: 999,
  build: () => {
    const g = new THREE.Group();
    const d = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.03, 0.18), dashMat);
    d.position.y = 0.02;
    g.add(d);
    return g;
  },
  place: () => {},
});
dashes.reset();

function jump() {
  if (!grounded || game.state !== 'playing') return;
  grounded = false;
  vy = CONFIG.jump;
  sfx.whoosh();
  effects.puff(new THREE.Vector3(-0.5, 0.2, pz), 0xffe14a);
}

const input = new Input({
  onAction: () => {
    if (game.state === 'menu') game.play();
    else if (game.state === 'playing') jump();
    else if (game.state === 'dead' && game.overShown) game.play();
  },
});

let scroll = 0;

game.hooks.reset = () => {
  py = 0;
  vy = 0;
  pz = 0;
  grounded = true;
  speed = CONFIG.speedStart;
  player.group.position.set(0, 0, 0);
  player.pose.rotation.set(0, 0, 0);
  effects.clearTrail();
  obstacles.reset({});
  obstacles.setVisible(true);
};

game.hooks.update = (dt) => {
  // lái nhẹ trên Z
  const steer = input.steer;
  pz += steer * CONFIG.steerZ * dt;
  pz = THREE.MathUtils.clamp(pz, -CONFIG.zHalf, CONFIG.zHalf);

  if (!grounded) {
    vy += CONFIG.gravity * dt;
    py += vy * dt;
    if (py <= 0) {
      py = 0;
      vy = 0;
      grounded = true;
      effects.puff(new THREE.Vector3(0, 0.15, pz), 0xffe14a);
    }
  }

  player.group.position.y = py;
  player.group.position.z = pz;
  // nghiêng khi lái / nhảy
  player.pose.rotation.x = THREE.MathUtils.clamp(-pz * 0.12, -0.2, 0.2);
  const pitch = grounded ? 0 : THREE.MathUtils.clamp(-vy * 0.02, -0.25, 0.2);
  player.pose.rotation.z = pitch;

  speed = Math.min(CONFIG.speedMax, speed + CONFIG.speedRamp * dt);
  scroll = speed * dt;
  engine.set(speed / CONFIG.speedMax);

  for (const w of player.wheels) w.rotation.y -= speed * dt * 3.2;

  const ctx = { playerY: py, playerZ: pz, score: game.score };
  const scored = obstacles.update(scroll, dt, ctx);
  if (scored) {
    game.addScore(scored);
    effects.ring(new THREE.Vector3(-1.2, py + 1.2, pz), 0x33e6ff);
  }
  scenery.update(scroll * 0.45, dt);
  dashes.update(scroll, dt);

  if (grounded) effects.emitTrail(new THREE.Vector3(-1.0, 0.15, pz), dt);

  // hits(side): px=0 (người chơi cố định X), py = độ cao
  // colliders trên XY; lái Z chỉ ảnh hưởng scoreCheck / thẩm mỹ
  if (obstacles.hits(0, py + 0.45, CONFIG.playerRadius)) {
    effects.crashBurst(new THREE.Vector3(0, py + 0.6, pz), 0xffe14a, 0xff6b2d);
    game.crash();
  }
};

game.hooks.menuTick = (dt, elapsed) => {
  scroll = 2.5 * dt;
  player.pose.position.y = Math.sin(elapsed * 22) * 0.01;
  player.pose.rotation.z = Math.sin(elapsed * 1.4) * 0.04;
  scenery.update(scroll * 0.45, dt);
  dashes.update(scroll, dt);
  engine.set(0.12);
};

game.hooks.deadTick = (dt) => {
  vy += CONFIG.gravity * dt;
  py = Math.max(0, py + vy * dt);
  player.group.position.y = py;
  player.pose.rotation.z += dt * 8;
  player.pose.rotation.y += dt * 2;
  scroll = Math.max(0, scroll - dt * 3);
  obstacles.update(scroll, dt, { playerY: py, playerZ: pz });
  scenery.update(scroll * 0.45, dt);
  dashes.update(scroll, dt);
  engine.set(0);
};

game.hooks.frame = (dt, rawDt, elapsed) => {
  effects.update(dt, rawDt);

  const shakeX = (Math.random() - 0.5) * effects.shake * 0.7;
  const shakeY = (Math.random() - 0.5) * effects.shake * 0.7;
  const camX = 2.6 + Math.sin(elapsed * 0.2) * 0.3 + shakeX;
  const camY = 3.2 + py * 0.35 + shakeY;
  camera.position.x += (camX - camera.position.x) * Math.min(1, rawDt * 6);
  camera.position.y += (camY - camera.position.y) * Math.min(1, rawDt * 5);
  camera.position.z = 13.5 + pz * 0.3;
  camera.lookAt(3.5, 1.4 + py * 0.35, pz * 0.4);
  camera.rotateZ(0.04);
};

game.start();

window.__game = {
  game, sfx, music, obstacles, jump, input,
  get py() { return py; },
  get grounded() { return grounded; },
  get speed() { return speed; },
};
