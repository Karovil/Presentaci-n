/* ==========================================================================
   EXPIA · SER EJEMPLO — ESCENAS, RELOJ Y NAVEGACIÓN
   ========================================================================== */
(() => {
  const S = SX.scenes, RD = SX.radar;
  const byId = Object.fromEntries(S.map((s) => [s.id, s]));
  const stage = document.getElementById('stage');
  const fmt = (n) => new Intl.NumberFormat('es-CO').format(n);
  const narrow = () => innerWidth < 860;

  /* ---------- Construcción de escenas ---------- */
  const html = {
    hook: (d) => `
      <div class="center">
        <p class="k">EXPIA · Exposure &amp; Intelligence Platform</p>
        <h1 class="mega"><span class="r">Tenemos</span> <span class="r">3 minutos.</span></h1>
        <p class="lead r">Un atacante necesita menos.</p>
      </div>`,
    world: (d) => `
      <div class="corner tl"><p class="k">Radar global · 2026</p><h2 class="h2">${d.title}</h2></div>
      <p class="bottom-line">${d.line}</p>`,
    stat: (d) => `
      <div class="col tone--${d.tone || 'orange'}">
        <p class="k">${d.k}</p>
        <p class="giant">${d.prefix ? `<small class="pre">${d.prefix}</small>` : ''}<span data-count="${d.value}" data-from="${d.from || 0}" data-dec="${d.dec || 0}">0</span>${d.unit ? `<small>${d.unit}</small>` : ''}</p>
        <p class="lead">${d.big}</p>
        <p class="sub">${d.sub}</p>
        <p class="src">${d.src}</p>
      </div>`,
    race: (d) => `
      <div class="col col--wide">
        <p class="k">La carrera</p>
        <div class="race">
          <div class="race__row att"><p class="race__n">${d.att.n}<small>${d.att.u}</small></p><div><p class="race__l">${d.att.l}</p><p class="src">${d.att.src}</p></div></div>
          <div class="race__bar"><i class="a"></i><i class="b"></i><span class="race__patch">${d.patch}</span></div>
          <div class="race__row def"><p class="race__n">${d.def.n}<small>${d.def.u}</small></p><div><p class="race__l">${d.def.l}</p><p class="src">${d.def.src}</p></div></div>
        </div>
        <p class="lead lead--s">${d.line}</p>
      </div>`,
    ai: (d) => `
      <div class="center center--ai">
        <p class="k">${d.k}</p>
        <h2 class="h2 h2--xl">${d.big}</h2>
        <div class="stats">${d.stats.map((s) => `<div><b data-count="${s.n}">0</b><span>${s.l}</span></div>`).join('')}</div>
        <p class="src">${d.src}</p>
        <p class="pill">${d.side} <i>${d.sideSrc}</i></p>
        <p class="lead lead--s">${d.line}</p>
      </div>`,
    noise: (d) => `
      <div class="corner tl">
        <div class="counts">${d.counts.map((c) => `<div><b data-count="${c.n}">0</b><span>${c.l}</span></div>`).join('')}</div>
      </div>
      <div class="corner br"><h2 class="h2">${d.big}</h2><p class="sub">${d.line}</p></div>`,
    hubSources: (d) => `
      <div class="corner tl side-text">
        <p class="k">${d.k}</p>
        <p class="brand brand--l">${d.title}<span>${d.sub}</span></p>
        <h2 class="h2">${d.big}</h2>
      </div>
      <p class="bottom-line bottom-line--cyan">${d.line}</p>`,
    hubAgents: (d) => `
      <div class="corner tl side-text">
        <p class="k">${d.k}</p>
        <h2 class="h2">${d.big}</h2>
        <p class="sub">${d.sub}</p>
      </div>
      <p class="tag-note">${d.note}</p>`,
    expia: (d) => `
      <div class="top-center">
        <p class="k">Lo que nos muestra</p>
        <h2 class="h2 h2--route">${d.big}</h2>
      </div>
      <div class="pillars">${d.pillars.map((p) => `<div><i>${p.k}</i><b>${p.l}</b><span>${p.s}</span></div>`).join('')}</div>
      <p class="tag-note">${d.note}</p>`,
    result: (d) => `
      <div class="col col--wide">
        <p class="k">De ruido a decisión</p>
        <div class="funnel">${d.funnel.map((f, i) => `<div class="${f.hot ? 'hot' : ''}" style="--w:${100 - i * 22}%"><b data-count="${f.n}">0</b><span>${f.l}</span></div>`).join('')}</div>
        <div class="money">${d.money.map((m) => `<div class="${m.good ? 'good' : ''}"><b>${m.n}</b><span>${m.l}</span></div>`).join('')}</div>
        <p class="src">${d.src}</p>
        <p class="lead lead--s">${d.line}</p>
      </div>`,
    close: (d) => `
      <div class="center">
        <p class="lead r">${d.a}</p>
        <p class="lead r">${d.b}</p>
        <h1 class="mega mega--s r">${d.c}</h1>
        <p class="ask r">${d.ask}</p>
        <p class="sources r">Fuentes: ${SX.sources.join(' · ')}</p>
      </div>`,
  };

  const secs = S.map((s) => {
    const el = document.createElement('section');
    el.className = `scene scene--${s.id}`;
    el.innerHTML = html[s.type](s);
    stage.appendChild(el);
    return el;
  });

  /* ---------- Qué hace el radar en cada escena ---------- */
  RD.setEvents(byId.world.events);
  RD.makeNoise(420);
  RD.setChain(byId.expia.chain);
  RD.setHub('sources', byId.what.sources);
  RD.setHub('agents', byId.agents.agents);
  const hubs = (src, ag) => { RD.showHub('sources', src); RD.showHub('agents', ag); };
  const side = (o) => (narrow() ? { ...o, cx: 0.5, dim: Math.min(o.dim, 0.18) } : o);

  const radarFor = {
    hook()   { RD.view({ cx: 0.5, cy: 0.5, r: 0.4, dim: 0.35 }); RD.showEvents(false); RD.showNoise(0); RD.showChain(false); hubs(0, 0); },
    world()  { RD.view({ cx: narrow() ? 0.5 : 0.6, cy: 0.55, r: 0.36, dim: 1 }); RD.showEvents(true); RD.showNoise(0); RD.showChain(false); hubs(0, 0); },
    money()  { RD.view(side({ cx: 0.78, cy: 0.5, r: 0.42, dim: 0.4 })); RD.showEvents(false, 'faint'); RD.showNoise(0); RD.showChain(false); hubs(0, 0); },
    third()  { RD.view(side({ cx: 0.76, cy: 0.5, r: 0.42, dim: 0.55 })); RD.showEvents(false, 'faint', (e) => e.third); RD.showNoise(0); RD.showChain(false); hubs(0, 0); },
    race()   { RD.view(side({ cx: 0.86, cy: 0.5, r: 0.46, dim: 0.22 })); RD.showEvents(false, 'faint'); RD.showNoise(0); RD.showChain(false); hubs(0, 0); },
    ai()     { RD.view({ cx: 0.5, cy: 0.5, r: 0.48, dim: 0.22 }); RD.showEvents(false); RD.showNoise(0.35); RD.showChain(false); hubs(0, 0); },
    here()   { RD.view(side({ cx: 0.74, cy: 0.52, r: 0.4, dim: 0.5 })); RD.showEvents(false); RD.showNoise(0.12); RD.showChain(false); hubs(0, 0); },
    noise()  { RD.view({ cx: 0.5, cy: 0.52, r: 0.42, dim: 0.85 }); RD.showEvents(false); RD.showNoise(1); RD.showChain(false); hubs(0, 0); },
    what()   { RD.view({ cx: narrow() ? 0.5 : 0.63, cy: 0.53, r: 0.34, dim: 0.45 }); RD.showEvents(false); RD.collapseNoise('hub'); RD.showChain(false); hubs(1, 0); },
    agents() { RD.view({ cx: narrow() ? 0.5 : 0.63, cy: 0.53, r: 0.34, dim: 0.45 }); RD.showEvents(false); RD.showNoise(0); RD.showChain(false); hubs(0.16, 1); },
    expia()  { RD.view({ cx: 0.5, cy: 0.5, r: narrow() ? 0.42 : 0.44, dim: 0.5 }); RD.showEvents(false); RD.showNoise(0); RD.showChain(true); hubs(0, 0); },
    result() { RD.view(side({ cx: 0.86, cy: 0.5, r: 0.44, dim: 0.2 })); RD.showEvents(false); RD.showNoise(0); RD.showChain(false); hubs(0, 0); },
    close()  { RD.view({ cx: 0.5, cy: 0.5, r: 0.44, dim: 0.6 }); RD.showEvents(false, 'faint'); RD.showNoise(0); RD.showChain(false); hubs(0, 0); },
  };

  /* ---------- Contadores ---------- */
  function countUp(root) {
    root.querySelectorAll('[data-count]').forEach((el, i) => {
      const to = +el.dataset.count, from = +(el.dataset.from || 0), dec = +(el.dataset.dec || 0);
      const f = (n) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
      const dur = 1400, t0 = performance.now() + 500 + i * 220;
      el.textContent = f(from);
      const tick = (now) => {
        const t = Math.max(0, Math.min(1, (now - t0) / dur));
        const e = 1 - Math.pow(1 - t, 3);
        el.textContent = f(dec ? from + (to - from) * e : Math.round(from + (to - from) * e));
        if (t < 1 && secs[idx] === root) requestAnimationFrame(tick);
        else if (secs[idx] !== root) el.textContent = f(to);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Reloj de 3 minutos y ataques en vivo ---------- */
  const elClock = document.querySelector('[data-clock]');
  const elCount = document.querySelector('[data-attacks]');
  const ring = document.querySelector('.live__ring circle.fill');
  const live = document.querySelector('.live');
  const PERIOD = (7 * 24 * 3600) / SX.weekly; // ≈ 145,7 s
  const CIRC = 2 * Math.PI * 15;
  ring.style.strokeDasharray = CIRC;
  let t0 = null, stopped = null, attacks = 0;

  function clock() {
    if (t0 !== null) {
      const el = ((stopped ?? performance.now()) - t0) / 1000;
      const m = Math.floor(el / 60), s = Math.floor(el % 60);
      elClock.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      document.body.classList.toggle('is-over', el > SX.total);
      const n = Math.floor(el / PERIOD);
      if (n > attacks) {
        attacks = n; elCount.textContent = attacks;
        RD.ping();
        live.classList.remove('is-hit'); void live.offsetWidth; live.classList.add('is-hit');
      }
      ring.style.strokeDashoffset = CIRC * (1 - (el % PERIOD) / PERIOD);
      /* barra de ritmo de la escena actual */
      const spent = (performance.now() - sceneT0) / 1000;
      const cur = pace.children[idx];
      if (cur && !stopped) cur.style.setProperty('--p', Math.min(1, spent / S[idx].t));
    }
    requestAnimationFrame(clock);
  }

  /* ---------- Barra de ritmo (presupuesto de tiempo por escena) ---------- */
  const pace = document.querySelector('.pace');
  S.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.style.flex = s.t; b.title = `${String(i + 1).padStart(2, '0')} · ${s.name} · ${s.t} s`;
    b.addEventListener('click', () => { if (t0 !== null) go(i); });
    pace.appendChild(b);
  });

  /* ---------- Navegación ---------- */
  const elName = document.querySelector('[data-name]');
  const elNum = document.querySelector('[data-num]');
  const notes = document.querySelector('.notes p');
  let idx = -1, sceneT0 = performance.now(), lock = 0, auto = null;

  function go(i) {
    if (i < 0 || i >= S.length || i === idx) return;
    if (idx >= 0) secs[idx].classList.remove('is-active');
    idx = i; sceneT0 = performance.now();
    secs[i].classList.add('is-active');
    document.body.dataset.scene = S[i].id;
    elName.textContent = S[i].name;
    elNum.textContent = `${String(i + 1).padStart(2, '0')} / ${S.length}`;
    notes.textContent = S[i].notes;
    [...pace.children].forEach((b, k) => { b.classList.toggle('done', k < i); b.classList.toggle('cur', k === i); if (k !== i) b.style.setProperty('--p', k < i ? 1 : 0); });
    radarFor[S[i].id]();
    countUp(secs[i]);
    if (S[i].id === 'close' && t0 !== null && !stopped) stopped = performance.now();
    if (S[i].id !== 'close' && stopped) stopped = null;
    history.replaceState(null, '', '#' + (i + 1));
    lock = performance.now() + 700;
    if (auto) schedule();
  }

  function start() {
    if (t0 !== null) return;
    t0 = performance.now();
    document.body.classList.add('is-started');
    go(0);
  }

  const next = () => { if (t0 === null) return start(); if (performance.now() > lock) go(idx + 1); };
  const prev = () => { if (performance.now() > lock) go(idx - 1); };

  function schedule() {
    clearTimeout(auto);
    if (idx < S.length - 1) auto = setTimeout(() => go(idx + 1), S[idx].t * 1000);
    else auto = true;
  }
  function toggleAuto() {
    if (auto) { clearTimeout(auto); auto = null; }
    else { if (t0 === null) start(); auto = true; schedule(); }
    document.body.classList.toggle('is-auto', !!auto);
  }

  addEventListener('keydown', (e) => {
    const k = e.key;
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.(); }
    else if (k === 'n' || k === 'N') document.body.classList.toggle('show-notes');
    else if (k === 'a' || k === 'A') toggleAuto();
    else if (k === 'r' || k === 'R') { t0 = performance.now(); stopped = null; attacks = 0; elCount.textContent = '0'; go(0); }
  });
  let acc = 0, accT = 0;
  addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = performance.now();
    if (now - accT > 240) acc = 0;
    accT = now; acc += e.deltaY;
    if (acc > 50) { acc = 0; next(); } else if (acc < -50) { acc = 0; prev(); }
  }, { passive: false });
  let ty = null;
  addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (ty === null) return;
    const dy = ty - e.changedTouches[0].clientY; ty = null;
    if (dy > 50) next(); else if (dy < -50) prev();
  }, { passive: true });

  document.querySelector('.start--go').addEventListener('click', start);
  document.querySelector('.start--auto').addEventListener('click', toggleAuto);
  addEventListener('resize', () => { if (idx >= 0) radarFor[S[idx].id](); });

  /* Inicio: pantalla de espera (o salto directo con #N) */
  RD.view({ cx: 0.5, cy: 0.5, r: 0.3, dim: 0.55 });
  const h = parseInt(location.hash.slice(1), 10);
  if (h >= 1 && h <= S.length) { start(); go(h - 1); }
  addEventListener('hashchange', () => {
    const n = parseInt(location.hash.slice(1), 10);
    if (n >= 1 && n <= S.length && n - 1 !== idx) { start(); go(n - 1); }
  });
  requestAnimationFrame(clock);
})();
