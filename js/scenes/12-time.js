/* ==========================================================================
   ESCENA 12 — EL TIEMPO
   DAY 01 → DAY 02 → DAY 03. Cada día deja más ventanas, más hilos y más
   validaciones alrededor del reloj. Paso 2: 03 DAYS.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.time;
  const S = { steps: 2 };
  IRI.scenes.time = S;

  let el, clutter, dayEl, noteEl, arc, segs = [], day = -1, active = false;
  const tl = new U.Timeline();
  const PER_DAY = [7, 11, 13];
  const DAY_MS = 2700;
  const TITLES = ['Búsqueda', 'Consulta', 'Notas', 'Captura', 'Correo', 'Validación', 'Historial', 'Exportación', 'Comparación', 'Pendiente'];

  S.init = (section) => {
    el = section;
    clutter = el.querySelector('.time__clutter');
    dayEl = el.querySelector('.time__day');
    noteEl = el.querySelector('.time__note');
    arc = el.querySelector('.dial-arc');
    el.querySelector('.time__big').textContent = D.total;
    el.querySelector('.time__line.l1').textContent = D.lines[0];
    el.querySelector('.time__line.l2').textContent = D.lines[1];

    const ticks = el.querySelector('.dial-ticks');
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
      const r1 = 80, r2 = i % 6 === 0 ? 72 : 76;
      ticks.appendChild(U.svgEl('line', { x1: 100 + Math.cos(a) * r1, y1: 100 + Math.sin(a) * r1, x2: 100 + Math.cos(a) * r2, y2: 100 + Math.sin(a) * r2 }));
    }
    const track = el.querySelector('.time__track');
    track.innerHTML = D.days.map((d) => `<div class="seg"><span>${d}</span><i><b></b></i></div>`).join('');
    segs = [...track.children];
  };

  // Posición libre alrededor del reloj central
  function spot() {
    for (let k = 0; k < 40; k++) {
      const x = U.rand(6, 88), y = U.rand(12, 76);
      if (Math.abs(x - 50) < 17 && Math.abs(y - 46) < 24) continue;
      return [x, y];
    }
    return [U.rand(6, 30), U.rand(12, 76)];
  }

  function addClutter(n, d) {
    const svg = clutter.querySelector('svg');
    const before = [...clutter.querySelectorAll('.cw')];
    for (let i = 0; i < n; i++) {
      const [x, y] = spot();
      const w = document.createElement('div');
      w.className = 'cw';
      w.style.cssText = `left:${x}%;top:${y}%;--d:${(i * 0.12).toFixed(2)}s;--r:${U.rand(-2, 2).toFixed(1)}deg;--w:${U.rand(110, 170).toFixed(0)}px`;
      w.innerHTML = `<span>${U.pick(TITLES)} ${d + 1}.${i + 1}</span><i></i><i></i><i></i>`;
      clutter.appendChild(w);
      // Un hilo hacia algo ya abierto
      if (before.length) {
        const o = U.pick(before);
        const ln = U.svgEl('line', { x1: parseFloat(o.style.left) + '%', y1: parseFloat(o.style.top) + '%', x2: x + '%', y2: y + '%', style: `--d:${(i * 0.12 + 0.3).toFixed(2)}s` });
        svg.appendChild(ln);
      }
      before.push(w);
    }
  }

  function showDay(d) {
    day = d;
    el.classList.remove('is-dusk');
    void el.offsetWidth;
    if (d > 0) el.classList.add('is-dusk');   // noche breve entre días
    dayEl.innerHTML = `<span>${D.days[d].split(' ')[0]}</span>${D.days[d].split(' ')[1]}`;
    dayEl.classList.remove('is-in');
    void dayEl.offsetWidth;
    dayEl.classList.add('is-in');
    noteEl.textContent = D.dayNotes[d];
    segs.forEach((s, k) => { s.classList.toggle('is-done', k < d); s.classList.toggle('is-cur', k === d); });
    arc.classList.remove('is-run');
    void arc.getBoundingClientRect();
    arc.classList.add('is-run');
    addClutter(PER_DAY[d], d);
  }

  function finish() {
    tl.clear();
    for (let d = day + 1; d < D.days.length; d++) showDay(d);
    segs.forEach((s) => { s.classList.add('is-done'); s.classList.remove('is-cur'); });
  }

  S.enter = () => {
    active = true;
    day = -1;
    clutter.innerHTML = '<svg class="cw-links"></svg>';
    segs.forEach((s) => s.classList.remove('is-done', 'is-cur'));
    el.classList.remove('is-dusk');
    D.days.forEach((_, d) => tl.at(900 + d * DAY_MS, () => showDay(d)));
    tl.at(900 + D.days.length * DAY_MS - 200, () => segs[2].classList.add('is-done'));
  };

  // Durante los días, avanzar completa el tercer día.
  S.onNext = () => {
    if (el.dataset.step !== '0' || segs[2].classList.contains('is-done')) return false;
    finish();
    return true;
  };

  S.setStep = (n) => { if (n >= 1 && !segs[2].classList.contains('is-done')) finish(); };

  S.leave = () => { active = false; tl.clear(); };
})();
