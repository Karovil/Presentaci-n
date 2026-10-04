/* ==========================================================================
   ESCENA 01 — ACTIVACIÓN
   La interfaz "despierta": nodos que aparecen y se enlazan, título que se
   decodifica, registro de arranque y botón de inicio.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.boot;
  const S = { steps: 1 };
  IRI.scenes.activation = S;

  let el, boot, canvas, ctx, W = 0, H = 0;
  let nodes = [], progress = 0, ready = false, launched = false, active = false;
  let t0 = 0, wave = null, lastPct = -1;
  let ringEl, pctEl, statusEl, l1, l2, logItems = [], loop;
  const tl = new U.Timeline();
  const CIRC = 2 * Math.PI * 46;
  const BOOT_START = 1.2, BOOT_LEN = 5.2;   // segundos del "despertar"

  S.init = (section) => {
    el = section;
    boot = el.querySelector('.boot');
    canvas = el.querySelector('canvas');
    ringEl = el.querySelector('.ring-progress');
    pctEl = el.querySelector('.boot__pct');
    statusEl = el.querySelector('.boot__status-text');
    [l1, l2] = el.querySelectorAll('.boot__title span');
    el.querySelector('.cta__label').textContent = D.cta;

    // Marcas del anillo
    const ticks = el.querySelector('.ring-ticks');
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const r1 = 52, r2 = i % 5 === 0 ? 56 : 54;
      ticks.appendChild(U.svgEl('line', {
        x1: 60 + Math.cos(a) * r1, y1: 60 + Math.sin(a) * r1,
        x2: 60 + Math.cos(a) * r2, y2: 60 + Math.sin(a) * r2,
      }));
    }
    ringEl.style.strokeDasharray = CIRC;

    const log = el.querySelector('.boot__log');
    log.innerHTML = D.log.map((l) =>
      `<li class="${l.pending ? 'is-pending' : ''}"><span>${l.label}</span><i></i><span>${l.state}</span></li>`).join('');
    logItems = [...log.children];

    el.querySelector('.cta').addEventListener('click', launch);
    loop = new U.Loop(draw);
    U.onResize(() => { if (active) resize(); });
  };


  function resize() {
    ({ ctx, w: W, h: H } = U.fitCanvas(canvas));
    const n = U.clamp(Math.round((W * H) / 14000), 40, 150);
    nodes = [];
    for (let i = 0; i < n; i++) {
      let x, y, tries = 0;
      // Mantener despejado el centro donde vive la interfaz
      do { x = Math.random() * W; y = Math.random() * H; tries++; }
      while (tries < 8 && Math.hypot((x - W / 2) / (W * 0.26), (y - H / 2) / (H * 0.36)) < 1);
      nodes.push({
        ox: x, oy: y, x, y,
        born: Math.pow(Math.random(), 0.9),
        a: 0,
        r: U.rand(0.6, 1.6),
        ph: Math.random() * Math.PI * 2,
        sp: U.rand(0.12, 0.4),
        z: U.rand(0.25, 1),
      });
    }
  }

  function draw(dt, now) {
    const t = (now - t0) / 1000;
    if (!ready) {
      progress = U.clamp((t - BOOT_START) / BOOT_LEN, 0, 1);
      progress = U.ease.inOutSine(progress);
      const pct = Math.round(progress * 100);
      if (pct !== lastPct) { pctEl.textContent = U.pad2(Math.min(pct, 99)); lastPct = pct; }
      ringEl.style.strokeDashoffset = CIRC * (1 - progress);
    }

    ctx.clearRect(0, 0, W, H);
    const mx = U.mouse.x, my = U.mouse.y;

    for (const n of nodes) {
      const on = progress >= n.born ? 1 : 0;
      n.a += (on - n.a) * Math.min(1, dt * 1.8);
      n.x = n.ox + Math.sin(t * n.sp + n.ph) * 8 - U.mouse.sx * n.z * 16;
      n.y = n.oy + Math.cos(t * n.sp * 0.8 + n.ph) * 8 - U.mouse.sy * n.z * 12;
      n.glow = U.mouse.active ? Math.max(0, 1 - Math.hypot(n.x - mx, n.y - my) / 180) : 0;
    }

    // Enlaces entre vecinos
    const L = 150;
    ctx.lineWidth = 0.6;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (a.a < 0.02) continue;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        if (b.a < 0.02) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > L || Math.abs(dy) > L) continue;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > L) continue;
        const g = Math.max(a.glow, b.glow);
        const alpha = (1 - d / L) * Math.min(a.a, b.a) * (0.16 + g * 0.45);
        ctx.strokeStyle = g > 0.05 ? `rgba(120,205,255,${alpha})` : `rgba(140,170,230,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nodos
    for (const n of nodes) {
      if (n.a < 0.01) continue;
      const alpha = n.a * (0.25 + 0.55 * n.z) + n.glow * 0.5;
      ctx.fillStyle = `rgba(205,222,255,${Math.min(1, alpha)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + n.glow * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Onda de "sistema listo"
    if (wave !== null) {
      const k = Math.max(0, (now - wave) / 1000);
      if (k > 2.4) wave = null;
      else {
        const r = U.ease.outCubic(k / 2.4) * Math.hypot(W, H) * 0.55;
        ctx.strokeStyle = `rgba(98,230,255,${0.32 * (1 - k / 2.4)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  S.enter = () => {
    active = true;
    ready = false;
    launched = false;
    progress = 0;
    lastPct = -1;
    boot.className = 'boot';
    l1.textContent = '';
    l2.textContent = '';
    statusEl.textContent = D.initializing;
    logItems.forEach((li) => li.classList.remove('in'));
    resize();
    t0 = performance.now();
    loop.start();

    tl.at(500, () => boot.classList.add('is-core'));
    tl.at(1100, () => U.scramble(l1, D.title[0], { duration: 1200 }));
    tl.at(1650, () => U.scramble(l2, D.title[1], { duration: 1200 }));
    tl.at(2300, () => boot.classList.add('is-status'));
    logItems.forEach((li, i) => tl.at(2700 + i * 650, () => li.classList.add('in')));
    tl.at((BOOT_START + BOOT_LEN) * 1000 + 300, finish);
  };

  function finish() {
    if (ready) return;
    tl.clear();
    ready = true;
    progress = 1;
    ringEl.style.strokeDashoffset = 0;
    pctEl.textContent = '100';
    if (l1.textContent !== D.title[0]) U.scramble(l1, D.title[0], { duration: 300 });
    if (l2.textContent !== D.title[1]) U.scramble(l2, D.title[1], { duration: 300 });
    logItems.forEach((li) => li.classList.add('in'));
    boot.classList.add('is-core', 'is-status');
    statusEl.textContent = D.ready;
    // Breve pausa: el registro se retira y aparece el botón
    tl.at(250, () => {
      boot.classList.add('is-ready');
      wave = performance.now();
    });
  }

  function launch() {
    if (!ready || launched) return;
    launched = true;
    boot.classList.add('is-launch');
    wave = performance.now();
    IRI.controller.start();
  }

  // Avanzar durante el arranque lo completa; si ya está listo, inicia.
  S.onNext = () => {
    if (launched) return false;
    if (!ready) finish();
    else if (boot.classList.contains('is-ready')) launch();
    return true;
  };

  S.leave = () => {
    active = false;
    tl.clear();
    setTimeout(() => { if (!active) loop.stop(); }, 1600);
  };
})();
