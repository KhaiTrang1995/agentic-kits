import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ── Game — trái tim của kit ────────────────────────────────────
// Quản lý: renderer + bloom, camera, vòng lặp, máy trạng thái
// (menu | playing | dead) với slow-motion khi chết, điểm số và
// hệ thống sự kiện để HUD / âm thanh móc vào.
//
// Game KHÔNG biết gì về gameplay — mỗi game cung cấp hooks:
//   hooks.reset()                   — chuẩn bị màn chơi mới
//   hooks.update(dt, elapsed)       — tick khi đang chơi
//   hooks.menuTick(dt, elapsed)     — animation ở menu
//   hooks.deadTick(dt, elapsed)     — animation khi chết
//   hooks.frame(dt, rawDt, elapsed) — mỗi frame (world, camera, effects)
//   hooks.resize(aspect)            — tuỳ chọn khi cửa sổ đổi kích thước
//
// Sự kiện phát ra: 'play' · 'score' · 'crash' · 'over'
//
// Học nhanh: docs/LEARN.md · scaffold: npm run new-game mygame
export class Game {
  constructor({
    canvas,
    fov = { landscape: 60, portrait: 74 },
    exposure = 1.05,
    bloom = { strength: 0.55, radius: 0.7, threshold: 0.8 },
    deathDelay = 0.9,   // giây trước khi hiện màn game-over
    slowmo = 0.14,      // timeScale khi chết
  }) {
    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = exposure;

    this.camera = new THREE.PerspectiveCamera(fov.landscape, 1, 0.1, 900);
    this.scene = new THREE.Scene();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloom.strength, bloom.radius, bloom.threshold,
    ));
    this.composer.addPass(new OutputPass());

    this.fovCfg = fov;
    this.deathDelay = deathDelay;
    this.slowmo = slowmo;

    this.state = 'menu';
    this.score = 0;
    this.elapsed = 0;
    this.timeScale = 1;
    this.deathT = 0;
    this.overShown = false;

    this.hooks = {};
    this._listeners = new Map();
    this._clock = new THREE.Clock();

    window.addEventListener('resize', () => this.onResize());
    this.onResize();
  }

  // ── sự kiện ──
  on(event, cb) {
    if (!this._listeners.has(event)) this._listeners.set(event, []);
    this._listeners.get(event).push(cb);
    return this;
  }

  emit(event, payload) {
    for (const cb of this._listeners.get(event) || []) cb(payload);
  }

  // ── vòng đời ──
  play() {
    this.state = 'playing';
    this.score = 0;
    this.hooks.reset?.();
    this.emit('play');
  }

  addScore(n = 1) {
    if (this.state !== 'playing' || n <= 0) return;
    this.score += n;
    this.emit('score', n);
  }

  crash() {
    if (this.state !== 'playing') return;
    this.state = 'dead';
    this.deathT = 0;
    this.overShown = false;
    this.emit('crash');
  }

  onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 1 ? this.fovCfg.portrait : this.fovCfg.landscape;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.hooks.resize?.(aspect);
  }

  // ── vòng lặp ──
  start() {
    const tick = () => {
      requestAnimationFrame(tick);
      const rawDt = Math.min(this._clock.getDelta(), 1 / 30);

      // slow-motion mượt khi chết, hồi tốc khi chơi lại
      if (this.state === 'dead') {
        this.deathT += rawDt;
        this.timeScale += (this.slowmo - this.timeScale) * Math.min(1, rawDt * 8);
        if (this.deathT > this.deathDelay && !this.overShown) {
          this.overShown = true;
          this.emit('over');
        }
      } else {
        this.timeScale += (1 - this.timeScale) * Math.min(1, rawDt * 4);
      }

      const dt = rawDt * this.timeScale;
      this.elapsed += dt;

      if (this.state === 'playing') this.hooks.update?.(dt, this.elapsed);
      else if (this.state === 'menu') this.hooks.menuTick?.(dt, this.elapsed);
      else this.hooks.deadTick?.(dt, this.elapsed);

      this.hooks.frame?.(dt, rawDt, this.elapsed);
      this.composer.render();
    };
    tick();
  }
}
