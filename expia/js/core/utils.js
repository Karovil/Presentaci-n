/* ==========================================================================
   EXPIA · UTILIDADES
   Matemática, interpolación, tiempos cancelables, bucle de animación y texto.
   ========================================================================== */
window.EX = window.EX || {};
EX.scenes = EX.scenes || {};

EX.u = (() => {
  const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  const fmt = (n) => Math.round(n).toLocaleString('es-CO');

  /* Gaussiana aproximada (suma de uniformes) */
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  /* Generador pseudoaleatorio con semilla: el mapa es siempre el mismo */
  function seeded(seed = 7) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const ease = {
    out: (t) => 1 - Math.pow(1 - t, 3),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    expoOut: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    sine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  };

  /* Interpola una tabla [[x, y], ...] */
  function sampleRampSafe(table, x) {
    if (x <= table[0][0]) return table[0][1];
    for (let i = 1; i < table.length; i++) {
      if (x <= table[i][0]) {
        const [x0, y0] = table[i - 1], [x1, y1] = table[i];
        return lerp(y0, y1, (x - x0) / (x1 - x0 || 1));
      }
    }
    return table[table.length - 1][1];
  }

  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  /* Timeouts agrupados que una escena cancela al salir */
  class Timeline {
    constructor() { this.ids = []; }
    at(ms, fn) { const id = setTimeout(fn, ms); this.ids.push(id); return id; }
    clear() { this.ids.forEach(clearTimeout); this.ids = []; }
  }

  /* Bucle requestAnimationFrame con delta acotado */
  class Loop {
    constructor(fn) { this.fn = fn; this.running = false; this.raf = 0; this.last = 0; }
    start() {
      if (this.running) return;
      this.running = true;
      this.last = performance.now();
      const tick = (now) => {
        if (!this.running) return;
        const dt = Math.min(0.05, (now - this.last) / 1000);
        this.last = now;
        this.fn(dt, now);
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    stop() { this.running = false; cancelAnimationFrame(this.raf); }
  }

  /* Contador animado */
  function countTo(el, to, { duration = 1400, format = fmt, from } = {}) {
    if (el._cnt) cancelAnimationFrame(el._cnt);
    const start = performance.now();
    const v0 = from !== undefined ? from : parseFloat(el.dataset.v || '0') || 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = lerp(v0, to, ease.out(p));
      el.textContent = format(v);
      el.dataset.v = v;
      if (p < 1) el._cnt = requestAnimationFrame(tick);
    };
    el._cnt = requestAnimationFrame(tick);
  }

  /* Texto que se "resuelve" desde glifos de coordenadas */
  const GLYPHS = '0123456789ABCDEF/·:';
  function resolve(el, text, { duration = 900 } = {}) {
    if (el._res) cancelAnimationFrame(el._res);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const n = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (i < n || text[i] === ' ') out += text[i];
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) el._res = requestAnimationFrame(tick);
    };
    el._res = requestAnimationFrame(tick);
  }

  /* Puntero compartido */
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, sx: 0, sy: 0, inside: false };
  addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.nx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ny = (e.clientY / innerHeight) * 2 - 1;
    pointer.inside = true;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.inside = false; });

  const resizers = [];
  let rT = 0;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => resizers.forEach((f) => f()), 120); });
  const onResize = (f) => resizers.push(f);

  const icon = (name) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${EX.icons[name] || ''}</svg>`;

  return { sampleRampSafe, rand, pick, clamp, lerp, pad, fmt, gauss, seeded, ease, rgba, Timeline, Loop, countTo, resolve, pointer, onResize, icon };
})();

/* Iconos de trazo 24×24 */
EX.icons = {
  server: '<rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/><path d="M7.5 7h.01M7.5 17h.01"/>',
  bug:    '<path d="M12 7.5a4 4 0 0 1 4 4V15a4 4 0 0 1-8 0v-3.5a4 4 0 0 1 4-4z"/><path d="M12 7.5V5M9.5 5.5 8 4M14.5 5.5 16 4M8 12H4.5M19.5 12H16M8 16l-3 2M16 16l3 2"/>',
};
