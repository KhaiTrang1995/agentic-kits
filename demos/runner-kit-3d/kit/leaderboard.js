// ── Leaderboard — bảng xếp hạng cục bộ (localStorage) ──────────
// Hoạt động hoàn hảo trên hosting tĩnh (GitHub Pages…). Nếu muốn
// bảng xếp hạng toàn cầu, thay fetchTop/submit bằng gọi API riêng
// (xem flappy-bird-3D/api để tham khảo mô hình token chống gian lận).
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

export class Leaderboard {
  constructor({ storageKey, nameKey, title = '🏆 tay chơi xuất sắc' }) {
    this.storageKey = storageKey;
    this.nameKey = nameKey;
    this.title = title;
  }

  get savedName() {
    try { return localStorage.getItem(this.nameKey) || ''; } catch { return ''; }
  }

  set savedName(v) {
    try { localStorage.setItem(this.nameKey, v); } catch { /* chế độ riêng tư */ }
  }

  _load() {
    try {
      const s = localStorage.getItem(this.storageKey);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }

  async fetchTop() {
    return this._load();
  }

  async submit(name, score) {
    try {
      const scores = this._load();
      scores.push({ name, score });
      scores.sort((a, b) => b.score - a.score);
      const trimmed = scores.slice(0, 10);
      localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
      const rank = trimmed.findIndex((s) => s.name === name && s.score === score) + 1;
      return { scores: trimmed, rank: rank > 0 ? rank : null };
    } catch {
      return { error: 'không lưu được điểm' };
    }
  }

  render(el, scores, highlightName = null) {
    const titleEl = el.parentElement?.querySelector('.lb-title');
    if (titleEl) titleEl.textContent = this.title;

    if (!scores || !scores.length) {
      el.innerHTML = '<li class="lb-empty">chưa có ai ghi danh — hãy là người đầu tiên</li>';
      return;
    }
    let highlighted = false;
    el.innerHTML = scores.map((s, i) => {
      const me = !highlighted && highlightName && s.name === highlightName;
      if (me) highlighted = true;
      return `<li class="${me ? 'me' : ''}">
        <span class="lb-rank">${i + 1}</span>
        <span class="lb-name">${escapeHTML(s.name)}</span>
        <span class="lb-score">${Number(s.score)}</span>
      </li>`;
    }).join('');
  }
}
