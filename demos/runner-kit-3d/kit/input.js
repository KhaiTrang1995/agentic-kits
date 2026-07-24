// ── Input — bàn phím + chạm, thống nhất cho mọi game ───────────
// Ba kiểu điều khiển (chọn theo game — xem demo):
//   • onAction()        — chạm / Space / ↑ / W
//                         → ski-side (nhảy), wing (vỗ cánh), menu/chơi lại
//   • onSteerTap(dir)   — gõ ←/→ hoặc chạm nửa trái/phải
//                         → moto (đổi làn rời rạc)
//   • input.steer       — giá trị -1..1 khi GIỮ phím/chạm
//                         → ski (lái mượt), loop (lái + nhảy kết hợp)
//
// Lưu ý: pointerdown gọi CẢ onAction và onSteerTap — game dùng
// onSteerTap nên bỏ qua action khi đang playing (xem games/moto).
export class Input {
  constructor({ onAction = null, onSteerTap = null } = {}) {
    this._left = false;
    this._right = false;
    this._pointerSide = 0;

    window.addEventListener('pointerdown', (e) => {
      // thao tác trên HUD (nút, ô nhập, bảng xếp hạng) không phải điều khiển
      if (e.target instanceof Element && e.target.closest('input, button, .lb, a')) return;
      const el = document.activeElement;
      if (el && el.tagName === 'INPUT') el.blur();

      const side = e.clientX < window.innerWidth / 2 ? -1 : 1;
      this._pointerSide = side;
      onAction?.();
      onSteerTap?.(side);
    });
    const clearPointer = () => { this._pointerSide = 0; };
    window.addEventListener('pointerup', clearPointer);
    window.addEventListener('pointercancel', clearPointer);

    window.addEventListener('keydown', (e) => {
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return; // đang gõ tên

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!e.repeat) onAction?.();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        if (!e.repeat) onSteerTap?.(-1);
        this._left = true;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        if (!e.repeat) onSteerTap?.(1);
        this._right = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this._left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this._right = false;
    });
  }

  get steer() {
    const keys = (this._right ? 1 : 0) - (this._left ? 1 : 0);
    return keys !== 0 ? keys : this._pointerSide;
  }
}
