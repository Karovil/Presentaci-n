/* ==========================================================================
   EXPIA · CONTROLADOR
   Avance por pasos con scroll, teclado (compatible con presentador) y gestos.
   Interfaz de escena: { steps, init(el), enter(el), setStep(n, el), leave(el), onNext() }
   onNext() devuelve true cuando la escena consume el avance (p. ej. acelera
   una secuencia en curso).
   ========================================================================== */
EX.ctrl = (() => {
  const T = EX.text;
  const list = T.scenes;
  const secs = [], mods = [];
  let idx = -1, step = 0, started = false, lockUntil = 0;

  function init() {
    list.forEach((s, i) => {
      secs[i] = document.querySelector(`.scene[data-id="${s.id}"]`);
      mods[i] = EX.scenes[s.id] || {};
      mods[i].init && mods[i].init(secs[i]);
    });
    EX.hud.buildDepth((i) => { if (started) go(i); });
    bind();
    const h = parseInt(location.hash.slice(1), 10);
    if (h >= 2 && h <= list.length) { markStarted(); go(h - 1); } else go(0);
  }

  function markStarted() { started = true; document.body.classList.add('is-started'); }

  function applyStep(sec, n) {
    sec.dataset.step = n;
    for (let k = 1; k <= 8; k++) sec.classList.toggle('st-' + k, k <= n);
  }

  function go(i) {
    if (i === idx || i < 0 || i >= list.length) return;
    if (idx >= 0) {
      const old = secs[idx];
      old.classList.remove('is-active');
      mods[idx].leave && mods[idx].leave(old);
    }
    idx = i;
    step = 0;
    applyStep(secs[i], 0);
    secs[i].classList.add('is-active');
    document.body.dataset.scene = list[i].id;
    mods[i].enter && mods[i].enter(secs[i]);
    if (started) history.replaceState(null, '', '#' + (i + 1));
    hud();
    lock(1200);
  }

  function setStep(n) {
    step = n;
    applyStep(secs[idx], n);
    mods[idx].setStep && mods[idx].setStep(n, secs[idx]);
    hud();
    lock(800);
  }

  function next() {
    const m = mods[idx];
    if (m.onNext && m.onNext()) { lock(500); return; }
    if (!started) return;
    if (step < (m.steps || 1) - 1) setStep(step + 1);
    else if (idx < list.length - 1) go(idx + 1);
  }

  function prev() {
    if (!started) return;
    if (step > 0) setStep(step - 1);
    else if (idx > 1) go(idx - 1);
  }

  /* La escena de activación llama a esto cuando el usuario activa la plataforma */
  function start() {
    if (started) return;
    markStarted();
    go(1);
  }

  const hud = () => EX.hud.setScene(idx, step, mods[idx].steps || 1);
  const lock = (ms) => { lockUntil = performance.now() + ms; };
  const free = () => performance.now() > lockUntil;

  function bind() {
    let acc = 0, accT = 0;
    addEventListener('wheel', (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - accT > 220) acc = 0;
      accT = now;
      if (!free()) return;
      acc += e.deltaY;
      if (acc > 40) { acc = 0; next(); } else if (acc < -40) { acc = 0; prev(); }
    }, { passive: false });

    addEventListener('keydown', (e) => {
      const k = e.key;
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) {
        if (k === 'Enter' && e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        if (performance.now() > lockUntil - 700) next();
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(k)) {
        e.preventDefault();
        if (performance.now() > lockUntil - 700) prev();
      } else if (k === 'f' || k === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    });

    let ty = null;
    addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchend', (e) => {
      if (ty === null) return;
      const dy = ty - e.changedTouches[0].clientY;
      ty = null;
      if (!free()) return;
      if (dy > 50) next(); else if (dy < -50) prev();
    }, { passive: true });

    document.querySelector('.hint').addEventListener('click', next);

    addEventListener('hashchange', () => {
      const h = parseInt(location.hash.slice(1), 10);
      if (!(h >= 1 && h <= list.length) || h - 1 === idx) return;
      if (!started) markStarted();
      go(h - 1);
    });
  }

  return { init, start, next, prev, go, get index() { return idx; }, get step() { return step; } };
})();
