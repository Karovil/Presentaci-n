/* ==========================================================================
   EXPIA · ANOTACIONES Y SONDA
   Anotaciones: texto anclado a un punto del mundo, con línea guía en codo.
   Sonda: lectura contextual que sigue al cursor sobre el mapa.
   ========================================================================== */
EX.anno = (() => {
  const U = EX.u, Wd = EX.world;
  const root = document.querySelector('.annos');
  const all = new Set();

  function create({ target, html = '', dx = 60, dy = -40, cls = '', color = [200, 212, 236] }) {
    const el = document.createElement('div');
    el.className = 'anno ' + cls + (dx < 0 ? ' anno--left' : '');
    el.innerHTML = html;
    root.appendChild(el);
    const a = { el, target, dx, dy, color, on: false, k: 0 };
    a.show = () => { a.on = true; el.classList.add('is-on'); return a; };
    a.hide = () => { a.on = false; el.classList.remove('is-on'); return a; };
    a.set = (h) => { el.innerHTML = h; return a; };
    a.remove = () => { a.hide(); setTimeout(() => { el.remove(); all.delete(a); }, 700); };
    all.add(a);
    return a;
  }

  const clear = () => all.forEach((a) => a.remove());

  Wd.layer('annos', (ctx) => {
    all.forEach((a) => {
      a.k += ((a.on ? 1 : 0) - a.k) * 0.12;
      const t = typeof a.target === 'function' ? a.target() : a.target;
      if (!t) return;
      const p = Wd.project(t.x, t.y);
      const ex = p.x + a.dx, ey = p.y + a.dy;
      a.el.style.transform = `translate(${ex.toFixed(1)}px, ${ey.toFixed(1)}px)`;
      if (a.k < 0.02) return;
      // Línea guía: diagonal corta + tramo horizontal
      const kx = p.x + Math.sign(a.dx) * Math.min(Math.abs(a.dy), Math.abs(a.dx) * 0.5);
      const len = U.ease.out(a.k);
      ctx.strokeStyle = U.rgba(a.color, 0.55 * a.k);
      ctx.lineWidth = 1;
      ctx.beginPath();
      const sx = p.x + Math.sign(a.dx) * 8 * Math.SQRT1_2, sy = p.y + Math.sign(a.dy) * 8 * Math.SQRT1_2;
      ctx.moveTo(sx, sy);
      const mx = U.lerp(sx, kx, Math.min(1, len * 2)), my = U.lerp(sy, ey, Math.min(1, len * 2));
      ctx.lineTo(mx, my);
      if (len > 0.5) ctx.lineTo(U.lerp(kx, ex, (len - 0.5) * 2), ey);
      ctx.stroke();
      ctx.fillStyle = U.rgba(a.color, 0.9 * a.k);
      ctx.fillRect(ex - 1.5, ey - 1.5, 3, 3);
    });
  });

  return { create, clear };
})();

EX.probe = (() => {
  const el = document.querySelector('.probe');
  let on = false;
  function show(html) { el.innerHTML = html; el.classList.add('is-on'); on = true; place(); }
  function hide() { el.classList.remove('is-on'); on = false; }
  function place() {
    const { x, y } = EX.u.pointer;
    const w = el.offsetWidth, h = el.offsetHeight;
    const left = x + 22 + w > innerWidth - 20 ? x - 22 - w : x + 22;
    const top = Math.min(innerHeight - h - 20, Math.max(20, y - h / 2));
    el.style.transform = `translate(${left}px, ${top}px)`;
  }
  addEventListener('pointermove', () => { if (on) place(); }, { passive: true });
  return { show, hide };
})();
