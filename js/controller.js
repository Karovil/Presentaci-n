/* ==========================================================================
   CONTROLADOR DE NARRATIVA
   Cada escena tiene "pasos" internos. Scroll, teclado, gestos y el rail
   avanzan paso a paso; al agotar los pasos se pasa a la escena siguiente.

   Interfaz de una escena (IRI.scenes[id]):
     steps        número de pasos (por defecto 1)
     init(el)     una vez, al cargar
     enter(el)    al entrar
     setStep(n)   al cambiar de paso dentro de la escena
     leave(el)    al salir
     onNext()     opcional: devuelve true si consume el avance (p. ej. saltar una intro)
   ========================================================================== */
IRI.controller = (() => {
  const D = IRI.data;
  const list = D.scenes;
  const sections = [];
  const mods = [];
  let idx = -1;
  let step = 0;
  let started = false;
  let lockUntil = 0;

  const $ = (s) => document.querySelector(s);
  const hud = {
    code: $('[data-hud-code]'),
    name: $('[data-hud-name]'),
    hint: $('[data-hint]'),
    hintBtn: $('.hint'),
    bar: $('.progress i'),
    rail: $('.rail'),
  };

  function init() {
    list.forEach((s, i) => {
      sections[i] = document.querySelector(`.scene[data-id="${s.id}"]`);
      mods[i] = IRI.scenes[s.id] || {};
      mods[i].init && mods[i].init(sections[i]);
    });
    document.querySelector('[data-hud-total]').textContent = '/ ' + String(list.length).padStart(2, '0');
    buildRail();
    bindInput();

    // #3 abre directamente la escena 3 (útil para ensayar).
    const h = parseInt(location.hash.slice(1), 10);
    if (h >= 2 && h <= list.length) {
      started = true;
      document.body.classList.add('is-started');
      go(h - 1);
    } else {
      go(0);
    }
  }

  function buildRail() {
    hud.rail.innerHTML = list.map((s, i) =>
      `<button type="button" data-i="${i}" class="${s.part ? 'is-part-start' : ''}" aria-label="${s.code} ${s.name}">
         <span class="lbl">${s.name}</span><span class="num">${s.code}</span><span class="tick"></span>
       </button>`).join('');
    hud.rail.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || !started) return;
      go(+b.dataset.i);
    });
  }

  function applyStep(sec, n) {
    sec.dataset.step = n;
    for (let k = 1; k <= 8; k++) sec.classList.toggle('st-' + k, k <= n);
  }

  function go(i) {
    if (i === idx || i < 0 || i >= list.length) return;
    const forward = i > idx;
    if (idx >= 0) {
      const old = sections[idx];
      const oldMod = mods[idx];
      old.classList.remove('is-active');
      old.classList.add(forward ? 'is-leaving' : 'is-leaving-back');
      setTimeout(() => old.classList.remove('is-leaving', 'is-leaving-back'), 1500);
      oldMod.leave && oldMod.leave(old);
    }
    idx = i;
    step = 0;
    const sec = sections[i];
    applyStep(sec, 0);
    sec.classList.toggle('from-back', !forward);
    sec.classList.add('is-active');
    mods[i].enter && mods[i].enter(sec);
    IRI.background.setMood(list[i].mood);
    document.body.dataset.scene = list[i].id;
    if (started) history.replaceState(null, '', '#' + (i + 1));
    updateHud();
    lock(1200);
  }

  function setStep(n) {
    step = n;
    applyStep(sections[idx], n);
    mods[idx].setStep && mods[idx].setStep(n, sections[idx]);
    updateHud();
    lock(850);
  }

  function next() {
    const m = mods[idx];
    if (m.onNext && m.onNext()) { lock(600); return; }
    if (!started) return;
    if (step < (m.steps || 1) - 1) setStep(step + 1);
    else if (idx < list.length - 1) go(idx + 1);
  }

  function prev() {
    if (!started) return;
    if (step > 0) setStep(step - 1);
    else if (idx > 1) go(idx - 1);
  }

  /* Llamado por la escena de activación al pulsar "Iniciar experiencia". */
  function start() {
    if (started) return;
    started = true;
    document.body.classList.add('is-started');
    setTimeout(() => go(1), 700);
  }

  function updateHud() {
    const s = list[idx];
    hud.code.textContent = s.code;
    hud.name.textContent = s.name;
    hud.hint.textContent = s.hint || D.defaultHint;
    const steps = mods[idx].steps || 1;
    const p = (idx + (step + 1) / steps) / list.length;
    hud.bar.style.transform = `scaleX(${p})`;
    hud.rail.querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('is-active', i === idx);
      b.classList.toggle('is-past', i < idx);
    });
    document.body.classList.toggle('is-last', idx === list.length - 1 && step === steps - 1);
  }

  const lock = (ms) => { lockUntil = performance.now() + ms; };
  const free = () => performance.now() > lockUntil;

  function bindInput() {
    // Rueda / trackpad: acumula intención y respeta el bloqueo de transición.
    let acc = 0, accT = 0;
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - accT > 220) acc = 0;
      accT = now;
      if (!free()) return;
      acc += e.deltaY;
      if (acc > 42) { acc = 0; next(); }
      else if (acc < -42) { acc = 0; prev(); }
    }, { passive: false });

    // Teclado: compatible con presentadores inalámbricos (PageUp/PageDown).
    window.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      const k = e.key;
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) {
        if (k === 'Enter' && e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        if (performance.now() > lockUntil - 650) next();
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(k)) {
        e.preventDefault();
        if (performance.now() > lockUntil - 650) prev();
      } else if (k === 'Home' && started) {
        go(1);
      } else if (k === 'f' || k === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    });

    // Gestos táctiles.
    let ty = null;
    window.addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', (e) => {
      if (ty === null) return;
      const dy = ty - e.changedTouches[0].clientY;
      ty = null;
      if (!free()) return;
      if (dy > 50) next(); else if (dy < -50) prev();
    }, { passive: true });

    hud.hintBtn.addEventListener('click', () => next());

    // Cambiar el #número en la URL salta a esa escena (útil para ensayar).
    window.addEventListener('hashchange', () => {
      const h = parseInt(location.hash.slice(1), 10);
      if (!(h >= 1 && h <= list.length) || h - 1 === idx) return;
      if (!started) { started = true; document.body.classList.add('is-started'); }
      go(h - 1);
    });
  }

  return { init, start, next, prev, go, get index() { return idx; }, get step() { return step; } };
})();
