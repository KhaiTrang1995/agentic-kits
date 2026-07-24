// ── HUD — nối giao diện chuẩn (menu / điểm / game-over) với Game ──
// Yêu cầu markup có các id: score, menu, gameover, final-score,
// final-best, menu-best, flash, newbest, menu-lb-list, over-lb-list,
// submit-row, pilot-name, submit-btn, submit-status, mute-btn.
// (copy từ games/ski/index.html, hoặc: npm run new-game mygame)
// Mọi thao tác DOM đều null-safe — thiếu id sẽ bỏ qua, không crash.
export class HUD {
  constructor({ bestKey, muteKey = bestKey + '-muted', lb = null }) {
    const $ = (id) => document.getElementById(id);
    this.el = {
      score: $('score'), menu: $('menu'), over: $('gameover'),
      finalScore: $('final-score'), finalBest: $('final-best'),
      menuBest: $('menu-best'), flash: $('flash'), newbest: $('newbest'),
      menuLbList: $('menu-lb-list'), overLbList: $('over-lb-list'),
      submitRow: $('submit-row'), pilotName: $('pilot-name'),
      submitBtn: $('submit-btn'), submitStatus: $('submit-status'),
      muteBtn: $('mute-btn'),
    };
    this.bestKey = bestKey;
    this.muteKey = muteKey;
    this.lb = lb;
    this.best = Number(localStorage.getItem(bestKey) || 0);
    this.submitted = false;
    if (this.el.menuBest) this.el.menuBest.textContent = this.best;
  }

  _show(el, on) {
    if (!el) return;
    el.classList.toggle('hidden', !on);
  }

  _text(el, v) {
    if (el) el.textContent = v;
  }

  attach(game) {
    this.game = game;

    game.on('play', () => {
      this.submitted = false;
      this._show(this.el.menu, false);
      this._show(this.el.over, false);
      this._show(this.el.score, true);
      this._text(this.el.score, '0');
    });

    game.on('score', () => {
      if (!this.el.score) return;
      this.el.score.textContent = game.score;
      this.el.score.classList.remove('pop');
      void this.el.score.offsetWidth;
      this.el.score.classList.add('pop');
    });

    game.on('crash', () => {
      if (this.el.flash) {
        this.el.flash.classList.remove('boom');
        void this.el.flash.offsetWidth;
        this.el.flash.classList.add('boom');
      }
      if (game.score > this.best) {
        this.best = game.score;
        localStorage.setItem(this.bestKey, String(this.best));
        this._show(this.el.newbest, true);
      } else {
        this._show(this.el.newbest, false);
      }
    });

    game.on('over', () => {
      this._text(this.el.finalScore, game.score);
      this._text(this.el.finalBest, this.best);
      this._text(this.el.menuBest, this.best);
      this._show(this.el.score, false);
      this._show(this.el.over, true);
      this._text(this.el.submitStatus, '');
      const canSubmit = !!this.lb && game.score >= 1 && !this.submitted;
      this._show(this.el.submitRow, canSubmit);
      if (canSubmit && this.el.pilotName && this.el.submitBtn) {
        this.el.pilotName.value = this.lb.savedName;
        this.el.submitBtn.disabled = false;
      }
      this.refreshBoard(this.el.overLbList);
    });

    if (this.lb) {
      this.refreshBoard(this.el.menuLbList);
      this.el.submitBtn?.addEventListener('click', () => this.submitScore());
      this.el.pilotName?.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') this.submitScore();
        e.stopPropagation(); // gõ tên, không phải điều khiển
      });
    }
    return this;
  }

  // gắn nút loa với SFX (và tự nhớ trạng thái tắt tiếng)
  bindAudio(sfx) {
    if (!this.el.muteBtn) return this;
    let muted = localStorage.getItem(this.muteKey) === '1';
    sfx.setMuted(muted);
    this.el.muteBtn.textContent = muted ? '🔇' : '🔊';
    this.el.muteBtn.addEventListener('click', () => {
      muted = !muted;
      localStorage.setItem(this.muteKey, muted ? '1' : '0');
      sfx.setMuted(muted);
      this.el.muteBtn.textContent = muted ? '🔇' : '🔊';
      this.el.muteBtn.blur(); // Space phải điều khiển game, không bấm lại nút
    });
    return this;
  }

  async refreshBoard(el, highlight = null) {
    if (!this.lb || !el) return;
    const scores = await this.lb.fetchTop();
    this.lb.render(el, scores, highlight);
  }

  async submitScore() {
    if (!this.lb || !this.el.pilotName) return;
    const name = this.el.pilotName.value.trim();
    if (name.length < 2) {
      this._text(this.el.submitStatus, 'tên cần ít nhất 2 ký tự');
      return;
    }
    if (this.el.submitBtn) this.el.submitBtn.disabled = true;
    this._text(this.el.submitStatus, 'đang lưu…');
    const res = await this.lb.submit(name, this.game.score);
    if (res.error) {
      this._text(this.el.submitStatus, res.error);
      if (this.el.submitBtn) this.el.submitBtn.disabled = false;
      return;
    }
    this.submitted = true;
    this.lb.savedName = name;
    this._show(this.el.submitRow, false);
    this._text(this.el.submitStatus, res.rank ? `★ xếp hạng #${res.rank} ★` : 'đã ghi nhận điểm số');
    this.lb.render(this.el.overLbList, res.scores, name);
  }
}
