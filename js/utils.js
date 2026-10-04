/* ==========================================================================
   UTILIDADES COMPARTIDAS
   Matemática, temporizadores cancelables, bucles de animación, canvas y texto.
   ========================================================================== */
window.IRI = window.IRI || {};
IRI.scenes = IRI.scenes || {};

IRI.utils = (() => {
  const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const ease = {
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  };

  /* Interpola una tabla de puntos [[x, y], ...] de forma lineal. */
  function sampleRamp(table, x) {
    if (x <= table[0][0]) return table[0][1];
    for (let i = 1; i < table.length; i++) {
      const [x1, y1] = table[i];
      if (x <= x1) {
        const [x0, y0] = table[i - 1];
        return lerp(y0, y1, (x - x0) / (x1 - x0 || 1));
      }
    }
    return table[table.length - 1][1];
  }

  /* Ajusta un canvas a su tamaño CSS respetando la densidad de píxeles. */
  function fitCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  /* Secuencia de timeouts que se cancela en bloque al salir de una escena. */
  class Timeline {
    constructor() { this.ids = []; }
    at(ms, fn) { const id = setTimeout(fn, ms); this.ids.push(id); return id; }
    clear() { this.ids.forEach(clearTimeout); this.ids = []; }
  }

  /* Bucle requestAnimationFrame con delta de tiempo acotado. */
  class Loop {
    constructor(fn) { this.fn = fn; this.raf = 0; this.running = false; this.last = 0; }
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

  /* Texto que se "decodifica" de izquierda a derecha. */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  function scramble(el, text, { duration = 1000 } = {}) {
    if (el._scr) cancelAnimationFrame(el._scr);
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const shown = Math.floor(p * text.length);
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          if (i < shown || c === ' ') out += c;
          else if (i < shown + 3) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) el._scr = requestAnimationFrame(tick);
        else { el.textContent = text; el._scr = 0; resolve(); }
      };
      el._scr = requestAnimationFrame(tick);
    });
  }

  /* Divide un texto (con <em> opcional) en spans por letra para animaciones escalonadas. */
  function splitLetters(el, html, { step = 0.03, delay = 0 } = {}) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    el.innerHTML = '';
    let i = 0;
    const walk = (node, parent) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((word) => {
            if (!word) return;
            if (/^\s+$/.test(word)) { parent.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            [...word].forEach((ch) => {
              const s = document.createElement('span');
              s.className = 'ch';
              s.textContent = ch;
              s.style.setProperty('--i', (delay + i++ * step).toFixed(3) + 's');
              w.appendChild(s);
            });
            parent.appendChild(w);
          });
        } else {
          const clone = n.cloneNode(false);
          parent.appendChild(clone);
          walk(n, clone);
        }
      });
    };
    walk(tmp, el);
    return i;
  }

  /* Anima un número dentro de un elemento. */
  function countTo(el, to, { duration = 1200, pad = 0, format } = {}) {
    if (el._cnt) cancelAnimationFrame(el._cnt);
    const from = parseFloat(el.dataset.value || '0') || 0;
    const start = performance.now();
    const fmt = format || ((v) => String(Math.round(v)).padStart(pad, '0'));
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = lerp(from, to, ease.outCubic(p));
      el.textContent = fmt(v);
      el.dataset.value = v;
      if (p < 1) el._cnt = requestAnimationFrame(tick);
    };
    el._cnt = requestAnimationFrame(tick);
  }

  const icon = (name, cls = '') =>
    `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IRI.data.icons[name] || ''}</svg>`;

  const svgEl = (tag, attrs = {}) => {
    const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  /* Posición del puntero compartida: px absolutos y normalizados (-1..1). */
  const mouse = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, sx: 0, sy: 0, active: false };
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    mouse.nx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ny = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.active = false; });

  /* Resize con debounce para todas las escenas. */
  const resizeFns = [];
  let rT = 0;
  window.addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => resizeFns.forEach((f) => f()), 120);
  });
  const onResize = (fn) => resizeFns.push(fn);

  const pad2 = (n) => String(n).padStart(2, '0');

  return { rand, pick, clamp, lerp, ease, sampleRamp, fitCanvas, Timeline, Loop, scramble, splitLetters, countTo, icon, svgEl, mouse, onResize, pad2 };
})();
