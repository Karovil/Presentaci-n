/* ==========================================================================
   ESCENA 01 — ACTIVACIÓN
   Un punto. EXPIA despierta y detecta cinco tipos de señales, cada una en su
   propia región, sin relación entre sí. Se activa manteniendo presionado.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, T = EX.text.boot;
  const S = { steps: 1 };
  EX.scenes.boot = S;

  const CLOUDS = [
    { key: 'assets',   color: 'asset',  x: -560, y: -150, n: 46 },
    { key: 'vulns',    color: 'orange', x:  560, y: -170, n: 40 },
    { key: 'controls', color: 'green',  x: -500, y:  215, n: 30 },
    { key: 'exposure', color: 'yellow', x:  540, y:  210, n: 32 },
    { key: 'intel',    color: 'violet', x:  -10, y: -300, n: 26 },
  ];

  let el, wm, sub, status, reticle, ring, core, annos = [], clouds = [], bounds = [];
  let ready = false, launched = false, hold = 0, holding = false, auto = false, t0 = 0;
  const tl = new U.Timeline();
  const CIRC = 2 * Math.PI * 46;

  S.init = (section) => {
    el = section;
    wm = el.querySelector('.wordmark__name');
    sub = el.querySelector('.wordmark__sub');
    status = el.querySelector('.boot-status');
    reticle = el.querySelector('.activate');
    ring = el.querySelector('.activate__fill');
    ring.style.strokeDasharray = CIRC;
    el.querySelector('.activate__label').textContent = T.activate;
    el.querySelector('.activate__hint').textContent = T.holdHint;
    sub.textContent = EX.text.brandSub;
    wm.innerHTML = [...EX.text.brand].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('');

    // Mantener presionado para activar
    reticle.addEventListener('pointerdown', (e) => { e.preventDefault(); if (ready) holding = true; });
    addEventListener('pointerup', () => { holding = false; });
    reticle.addEventListener('pointerleave', () => { holding = false; });
    reticle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); auto = true; } });

    Wd.layer('boot', drawBounds);
    new U.Loop(holdTick).start();
  };

  const fitZ = () => Math.min(innerWidth / 1600, innerHeight / 900);

  function holdTick(dt) {
    if (!ready || launched) return;
    const target = holding || auto ? 1 : 0;
    hold += (target ? dt / (auto ? 0.7 : 1.1) : -dt * 2.5);
    hold = U.clamp(hold, 0, 1);
    ring.style.strokeDashoffset = CIRC * (1 - hold);
    reticle.classList.toggle('is-holding', hold > 0.01);
    if (hold >= 1) launch();
  }

  /* Límite punteado de cada región: están aisladas */
  function drawBounds(ctx, now) {
    bounds.forEach((b) => {
      b.k += ((b.on ? 1 : 0) - b.k) * 0.06;
      if (b.k < 0.01) return;
      const p = Wd.project(b.x, b.y);
      const r = b.r * Wd.cam.z;
      ctx.strokeStyle = U.rgba(P[b.color], 0.28 * b.k);
      ctx.setLineDash([2, 7]);
      ctx.lineDashOffset = now / 80;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2 * U.ease.out(b.k));
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  function detect(i) {
    const c = CLOUDS[i], d = T.detections[i];
    const col = P[c.color];
    for (let k = 0; k < c.n; k++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * (c.key === 'intel' ? 62 : 82);
      const n = Wd.addNode({
        x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r * 0.8,
        r: U.rand(1.2, 2.2), color: col, ta: 0, tags: ['boot', 'boot-' + c.key],
      });
      setTimeout(() => { n.ta = U.rand(0.55, 1); }, k * 18);
      clouds.push(n);
    }
    // Enlaces internos: cada fuente sí está conectada consigo misma
    const own = clouds.filter((n) => n.tags.includes('boot-' + c.key));
    own.forEach((n, k) => { if (k % 2 === 0) Wd.addEdge(n, own[(k * 7 + 3) % own.length], { ta: 0.14, color: col, tags: ['boot'] }); });
    bounds.push({ x: c.x, y: c.y, r: c.key === 'intel' ? 88 : 112, color: c.color, on: true, k: 0 });
    // La lectura se ancla hacia el centro (nunca contra el borde)
    const side = c.x > 0 ? -1 : 1;
    const an = EX.anno.create({
      target: { x: c.x + side * 92, y: c.y - 62 },
      dx: side * 40, dy: -26,
      color: col,
      cls: 'anno--detect',
      html: `<span class="anno__k">${d.label}</span><span class="anno__v" data-n>0</span>`,
    }).show();
    U.countTo(an.el.querySelector('[data-n]'), d.value, { duration: 1300, format: (v) => U.fmt(v) + (d.suffix || '') });
    annos.push(an);
    Wd.pulse({ x: c.x, y: c.y }, col, { r: 140, dur: 1400 });
  }

  function finish() {
    if (ready) return;
    tl.clear();
    for (let i = annos.length; i < CLOUDS.length; i++) detect(i);
    el.classList.add('is-mark', 'is-sub', 'is-sep');
    status.textContent = T.ready;
    ready = true;
    tl.at(300, () => el.classList.add('is-ready'));
  }

  function launch() {
    if (launched) return;
    launched = true;
    el.classList.add('is-launch');
    // Todo colapsa hacia el núcleo: la plataforma toma el control
    clouds.forEach((n) => { Wd.moveNode(n, U.gauss() * 6, U.gauss() * 6, 1100, Math.random() * 250, U.ease.inOut); n.ta = 0.9; });
    bounds.forEach((b) => { b.on = false; });
    annos.forEach((a) => a.hide());
    const c0 = Wd.get('boot-core');
    if (c0) { c0.ta = 1; c0.tglow = 1; }
    Wd.pulse({ x: 0, y: 0 }, P.cyan, { r: 900, dur: 2200, width: 1.2 });
    setTimeout(() => EX.ctrl.start(), 1050);
  }

  S.enter = () => {
    ready = launched = holding = auto = false;
    hold = 0;
    el.classList.remove('is-mark', 'is-sub', 'is-scan', 'is-sep', 'is-ready', 'is-launch');
    status.textContent = '';
    EX.orgMap.hide();
    EX.orgMap.setTerrain(0);
    EX.orgMap.setLabels(0);
    Wd.setCam({ x: 0, y: 0, z: fitZ() });
    core = Wd.addNode({ id: 'boot-core', x: 0, y: 0, r: 3, fixed: true, color: P.ink, ta: 1, tags: ['boot'], tglow: 1 });
    t0 = performance.now();

    tl.at(600, () => Wd.pulse(core, P.ink, { r: 60, dur: 1800 }));
    tl.at(1100, () => { el.classList.add('is-mark'); document.body.classList.add('is-awake'); core.ta = 0; core.tglow = 0; });
    tl.at(2000, () => el.classList.add('is-sub'));
    tl.at(2600, () => { status.textContent = 'Detectando'; el.classList.add('is-scan'); });
    CLOUDS.forEach((_, i) => tl.at(3000 + i * 850, () => detect(i)));
    tl.at(3000 + CLOUDS.length * 850 + 300, () => { el.classList.add('is-sep'); status.textContent = T.separated; });
    tl.at(3000 + CLOUDS.length * 850 + 2000, finish);
  };

  // Avanzar con el teclado: completa la detección y luego activa
  S.onNext = () => {
    if (launched) return false;
    if (!ready) finish(); else auto = true;
    return true;
  };

  S.leave = () => {
    tl.clear();
    annos.forEach((a) => a.remove());
    annos = [];
    bounds = [];
    clouds = [];
    Wd.remove('boot');
  };
})();
