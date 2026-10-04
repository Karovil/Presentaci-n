/* ==========================================================================
   ESCENA 03 — EL CAOS
   Las señales se multiplican desde la identidad hasta saturar la pantalla.
   Paso 2: "El problema no es la falta de información."
   Paso 3: "Es la falta de contexto."
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.chaos;
  const S = { steps: 3 };
  IRI.scenes.chaos = S;

  let el, canvas, ctx, W, H, cx, cy, loop, ticker, countEl;
  let parts = [], t = 0, timeScale = 1, targetScale = 1, active = false, tickAcc = 0, shownCount = 0;
  const FONT = '400 9px "JetBrains Mono", ui-monospace, monospace';

  // Contador "humano": crece mucho más rápido que lo que se dibuja.
  const COUNT_RAMP = [[0, 0], [0.6, 5], [2.4, 5], [3.2, 20], [4.8, 20], [5.6, 50], [7, 50], [8.5, 1400], [10.5, 14820]];

  S.init = (section) => {
    el = section;
    canvas = el.querySelector('canvas');
    ticker = el.querySelector('.ticker');
    countEl = el.querySelector('[data-count]');
    U.splitLetters(el.querySelector('.phrase--1'), D.phrases[0], { step: 0.022 });
    U.splitLetters(el.querySelector('.phrase--2'), D.phrases[1], { step: 0.035, delay: 0.2 });
    loop = new U.Loop(frame);
    U.onResize(() => { if (active) resize(); });
  };

  function resize() {
    ({ ctx, w: W, h: H } = U.fitCanvas(canvas));
    cx = W / 2;
    cy = H / 2;
  }

  function spawn() {
    const a = Math.random() * Math.PI * 2;
    const alert = Math.random() < D.alertRatio;
    // El hogar de cada señal: repartido por toda la pantalla
    const hx = U.rand(0.04, 0.96) * W;
    const hy = U.rand(0.08, 0.94) * H;
    const sp = U.rand(60, 220);
    parts.push({
      x: cx, y: cy,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      hx, hy, ph: Math.random() * 6.28,
      born: t,
      label: alert ? D.alertLabel : U.pick(D.labels),
      alert,
      r: U.rand(0.8, 1.8),
      partner: (Math.random() * 1e6) | 0,
      early: parts.length < 60,
    });
  }

  function frame(dt) {
    timeScale += (targetScale - timeScale) * Math.min(1, dt * 2);
    const sdt = dt * timeScale;
    t += sdt;

    // Población objetivo
    const target = Math.round(U.sampleRamp(D.ramp, t));
    let budget = 14;
    while (parts.length < target && budget-- > 0) spawn();

    // Contador
    const c = Math.round(U.sampleRamp(COUNT_RAMP, t) + Math.max(0, t - 10.5) * 37);
    if (c !== shownCount) { shownCount = c; countEl.textContent = c.toLocaleString('es-CO'); }

    // Flujo de eventos en la columna izquierda
    tickAcc += sdt * Math.min(22, 1 + target / 18);
    while (tickAcc > 1) { tickAcc -= 1; pushTicker(); }

    ctx.clearRect(0, 0, W, H);
    const n = parts.length;
    const mx = U.mouse.x, my = U.mouse.y;

    // Física
    for (const p of parts) {
      const hx = p.hx + Math.sin(t * 0.6 + p.ph) * 14;
      const hy = p.hy + Math.cos(t * 0.5 + p.ph) * 12;
      p.vx += (hx - p.x) * 1.4 * sdt;
      p.vy += (hy - p.y) * 1.4 * sdt;
      const damp = Math.pow(0.18, sdt);
      p.vx *= damp;
      p.vy *= damp;
      if (U.mouse.active) {
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140 && d2 > 1) {
          const f = (1 - Math.sqrt(d2) / 140) * 900 * sdt;
          p.vx += (dx / Math.sqrt(d2)) * f;
          p.vy += (dy / Math.sqrt(d2)) * f;
        }
      }
      p.x += p.vx * sdt;
      p.y += p.vy * sdt;
    }

    // Enredo: cada señal se cruza con otra sin relación aparente
    if (n > 24) {
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(150,180,235,${U.clamp(0.02 + n / 9000, 0.02, 0.07)})`;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = parts[i], b = parts[a.partner % n];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
    }

    // Trazo de nacimiento: cada señal sale de la identidad
    ctx.lineWidth = 0.7;
    for (const p of parts) {
      const age = t - p.born;
      if (age > 1.4) continue;
      const a = (1 - age / 1.4) * 0.35;
      ctx.strokeStyle = p.alert ? `rgba(255,74,92,${a})` : `rgba(170,205,255,${a})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    // Señales y etiquetas
    ctx.font = FONT;
    ctx.textBaseline = 'middle';
    const crowd = U.clamp((n - 50) / 400, 0, 1);
    for (const p of parts) {
      const age = t - p.born;
      const fade = U.clamp(age * 2, 0, 1);
      const blink = p.alert ? 0.55 + 0.45 * Math.sin(t * 5 + p.ph) : 1;
      const base = p.early ? 0.9 - crowd * 0.45 : 0.55 - crowd * 0.15;
      const a = base * fade * blink;
      ctx.fillStyle = p.alert ? `rgba(255,74,92,${a})` : `rgba(215,228,255,${a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.alert ? `rgba(255,90,105,${a * 0.85})` : `rgba(170,190,225,${a * 0.6})`;
      ctx.fillText(p.label, p.x + 6, p.y);
    }

    // Núcleo de identidad, cada vez más tapado
    const coreA = 0.9 - crowd * 0.55;
    ctx.strokeStyle = `rgba(200,220,255,${coreA * 0.6})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(235,242,255,${coreA})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  let stamp = 0;
  function pushTicker() {
    const d = new Date(Date.now() + stamp++ * 37);
    const li = document.createElement('li');
    const alert = Math.random() < D.alertRatio;
    const label = alert ? D.alertLabel : U.pick(D.labels);
    li.innerHTML = `<span>${U.pad2(d.getHours())}:${U.pad2(d.getMinutes())}:${U.pad2(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}</span><b${alert ? ' class="is-alert"' : ''}>${label}</b>`;
    ticker.prepend(li);
    while (ticker.children.length > 34) ticker.lastChild.remove();
  }

  S.enter = () => {
    active = true;
    resize();
    parts = [];
    t = 0;
    timeScale = targetScale = 1;
    shownCount = -1;
    ticker.innerHTML = '';
    loop.start();
  };

  S.setStep = (n) => {
    // El caos no se detiene: solo se ralentiza y se desenfoca detrás de la frase
    targetScale = n === 0 ? 1 : n === 1 ? 0.35 : 0.12;
    if (n >= 1 && t < 8) t = 8;   // si se avanza pronto, la saturación ya debe estar presente
  };

  S.leave = () => {
    active = false;
    setTimeout(() => { if (!active) loop.stop(); }, 1600);
  };
})();
