import * as THREE from 'three';

const TRAIL_N = 42;

const TRAIL_VERT = /* glsl */ `
  attribute float aAge;
  varying float vAge;
  uniform float uScale;
  void main() {
    vAge = aAge;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = ((1.0 - aAge) * 9.0 + 2.0) * (uScale / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const TRAIL_FRAG = /* glsl */ `
  varying float vAge;
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.12, d) * (1.0 - vAge) * 0.5;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ── Effects — bụi hạt, vòng điểm, vệt đuôi và rung camera ──────
// trailColor: màu vệt đuôi · trailDrift: hướng vệt trôi theo world
// (flappy trôi -x; game chase-camera trôi +z về phía sau người chơi)
export class Effects {
  constructor(scene, {
    trailColor = 0xffffff,
    trailDrift = new THREE.Vector3(0, 0, 8),
    trailScale = 140, // camera càng gần người chơi thì để càng nhỏ
  } = {}) {
    this.scene = scene;
    this.bursts = [];
    this.rings = [];
    this.shake = 0;
    this.trailDrift = trailDrift;
    this.buildTrail(trailColor, trailScale);
  }

  buildTrail(color, scale) {
    const positions = new Float32Array(TRAIL_N * 3);
    const ages = new Float32Array(TRAIL_N).fill(1);
    positions.fill(-500); // giấu sẵn ngoài khung hình
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aAge', new THREE.BufferAttribute(ages, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uScale: { value: scale } },
      vertexShader: TRAIL_VERT,
      fragmentShader: TRAIL_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.trail = new THREE.Points(geo, mat);
    this.trail.frustumCulled = false;
    this.trailHead = 0;
    this.trailTimer = 0;
    this.scene.add(this.trail);
  }

  emitTrail(pos, dt) {
    this.trailTimer -= dt;
    if (this.trailTimer > 0) return;
    this.trailTimer = 0.028;
    const i = this.trailHead = (this.trailHead + 1) % TRAIL_N;
    const p = this.trail.geometry.attributes.position;
    p.setXYZ(i, pos.x, pos.y, pos.z);
    p.needsUpdate = true;
    this.trail.geometry.attributes.aAge.array[i] = 0;
  }

  clearTrail() {
    this.trail.geometry.attributes.aAge.array.fill(1);
    this.trail.geometry.attributes.aAge.needsUpdate = true;
  }

  burst(pos, { count = 50, color = 0xffffff, speed = 7, life = 1.3, size = 0.26, gravity = -9 } = {}) {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
      const v = new THREE.Vector3(
        Math.random() - 0.5, Math.random() - 0.35, Math.random() - 0.5
      ).normalize().multiplyScalar(speed * (0.35 + Math.random() * 0.65));
      velocities[i * 3] = v.x;
      velocities[i * 3 + 1] = v.y;
      velocities[i * 3 + 2] = v.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color, size, transparent: true, opacity: 1, depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    this.scene.add(points);
    this.bursts.push({ points, velocities, life, maxLife: life, gravity });
  }

  // vụ nổ khi va chạm — hai lớp hạt + rung camera
  crashBurst(pos, primary = 0xffffff, secondary = 0xff8e5e) {
    this.burst(pos, { count: 60, color: primary, speed: 9, life: 1.5 });
    this.burst(pos, { count: 25, color: secondary, speed: 6, life: 1.2, size: 0.2 });
    this.shake = 1;
  }

  puff(pos, color = 0xffffff) {
    this.burst(pos, { count: 8, color, speed: 2.2, life: 0.45, size: 0.14, gravity: -2 });
  }

  ring(pos, color = 0x9ff3e8) {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.07, 8, 36),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false })
    );
    mesh.position.copy(pos);
    this.scene.add(mesh);
    this.rings.push({ mesh, life: 0.55, maxLife: 0.55 });
  }

  update(dt, rawDt) {
    this.shake *= Math.exp(-rawDt * 4.5);

    const ages = this.trail.geometry.attributes.aAge;
    const tpos = this.trail.geometry.attributes.position;
    const d = this.trailDrift;
    for (let i = 0; i < TRAIL_N; i++) {
      if (ages.array[i] < 1) {
        ages.array[i] = Math.min(1, ages.array[i] + dt * 1.4);
        tpos.array[i * 3] += d.x * dt;
        tpos.array[i * 3 + 1] += d.y * dt;
        tpos.array[i * 3 + 2] += d.z * dt;
      }
    }
    ages.needsUpdate = true;
    tpos.needsUpdate = true;

    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.life -= dt;
      if (b.life <= 0) {
        this.scene.remove(b.points);
        b.points.geometry.dispose();
        b.points.material.dispose();
        this.bursts.splice(i, 1);
        continue;
      }
      const pos = b.points.geometry.attributes.position.array;
      for (let p = 0; p < pos.length; p += 3) {
        b.velocities[p + 1] += b.gravity * dt;
        pos[p] += b.velocities[p] * dt;
        pos[p + 1] += b.velocities[p + 1] * dt;
        pos[p + 2] += b.velocities[p + 2] * dt;
      }
      b.points.geometry.attributes.position.needsUpdate = true;
      b.points.material.opacity = b.life / b.maxLife;
    }

    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.life -= dt;
      if (r.life <= 0) {
        this.scene.remove(r.mesh);
        r.mesh.geometry.dispose();
        r.mesh.material.dispose();
        this.rings.splice(i, 1);
        continue;
      }
      const t = 1 - r.life / r.maxLife;
      const s = 1 + t * 3.2;
      r.mesh.scale.set(s, s, s);
      r.mesh.material.opacity = 0.9 * (1 - t);
    }
  }
}
