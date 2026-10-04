/* ==========================================================================
   ESCENA 11 — LA INVESTIGACIÓN MANUAL
   Diez acciones, cada una con su propia viñeta visual en el banco de trabajo.
   La evidencia encontrada cae sobre la línea de tiempo del caso y los
   medidores acumulan horas, consultas y fuentes.
   Avanzar durante la secuencia salta a la siguiente acción.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.manual;
  const S = { steps: 1 };
  IRI.scenes.manual = S;

  let el, frame, verbEl, textEl, ticks = [], track, meters = {}, cur = -1, active = false;
  let totals = { hours: 0, queries: 0, sources: 0 };
  const tl = new U.Timeline();   // secuencia de acciones
  const vt = new U.Timeline();   // animación interna de la viñeta actual

  const QUERIES = [4, 2, 3, 5, 3, 4, 2, 1, 3, 1];
  const SOURCES = [1, 2, 3, 4, 4, 5, 6, 6, 6, 6];

  S.init = (section) => {
    el = section;
    frame = el.querySelector('.bench__frame');
    verbEl = el.querySelector('.action__verb');
    textEl = el.querySelector('.action__text');
    track = el.querySelector('.caseline__track');
    el.querySelector('.statement').textContent = D.statement;
    el.querySelector('.caseline__label').textContent = D.timelineLabel;

    const tk = el.querySelector('.action__ticks');
    tk.innerHTML = D.actions.map(() => '<i></i>').join('');
    ticks = [...tk.children];

    const R = D.readout;
    el.querySelector('.manual__readout').innerHTML = `
      <div><span>${R.elapsed}</span><strong data-m="hours">0h</strong></div>
      <div><span>${R.queries}</span><strong data-m="queries">00</strong></div>
      <div><span>${R.sources}</span><strong data-m="sources">0</strong></div>`;
    el.querySelectorAll('[data-m]').forEach((n) => { meters[n.dataset.m] = n; });

    // Escala de la línea de tiempo
    track.insertAdjacentHTML('beforeend', ['-72h', '-48h', '-24h', 'ahora']
      .map((l, i) => `<span class="caseline__mark" style="left:${(i / 3) * 100}%">${l}</span>`).join(''));
  };

  /* ---------- Viñetas ---------- */
  const rows = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');
  const later = (ms, fn) => vt.at(ms, fn);
  const on = (sel, cls = 'is-on') => { const n = frame.querySelector(sel); if (n) n.classList.add(cls); };

  const VIG = {
    search() {
      frame.innerHTML = `
        <div class="v-search">
          <div class="v-search__bar">${U.icon('search')}<span class="typed"></span><i class="caret"></i></div>
          <div class="v-list">${rows(7, (i) => `
            <div class="v-row" style="--d:${0.7 + i * 0.09}s">
              <span>${U.pad2(1 + i * 2)}:${U.pad2((i * 17 + 5) % 60)}</span>
              <span>Inicio de sesión</span>
              <span class="${i === 3 ? '' : 'mute'}">${i === 2 ? 'fallido' : 'exitoso'}</span>
              <i style="width:${30 + ((i * 37) % 50)}%"></i>
            </div>`)}</div>
        </div>`;
      const q = 'inicios de sesión · esta identidad · últimas 72 h';
      const typed = frame.querySelector('.typed');
      for (let i = 1; i <= q.length; i++) later(i * 14, () => { typed.textContent = q.slice(0, i); });
      later(150, () => on('.v-search', 'is-run'));
      later(1250, () => on('.v-row:nth-child(4)', 'is-hit'));
    },

    device() {
      const attrs = [['Equipo', 'Nunca visto'], ['Primera vez', 'Hoy, 02:14'], ['Sistema', 'Sin registro'], ['Propietario', '—']];
      frame.innerHTML = `
        <div class="v-device">
          <div class="v-device__glyph">${U.icon('device')}<i class="scanline"></i></div>
          <dl>${attrs.map(([k, v], i) => `<div style="--d:${0.4 + i * 0.22}s"${i === 0 ? ' class="is-key"' : ''}><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        </div>`;
      later(60, () => on('.v-device', 'is-run'));
    },

    apps() {
      frame.innerHTML = `
        <div class="v-apps">${rows(24, (i) => `<span class="tile${i === 17 ? ' is-odd' : ''}" style="--d:${(i % 6) * 0.06 + Math.floor(i / 6) * 0.12}s">${U.icon('app')}</span>`)}
          <p class="v-apps__tag">Poco habitual para esta persona</p>
        </div>`;
      later(60, () => on('.v-apps', 'is-run'));
      later(1100, () => on('.v-apps', 'is-found'));
    },

    history() {
      frame.innerHTML = `
        <div class="v-history">
          <div class="bars">${rows(30, (i) => `<i style="--h:${i === 29 ? 92 : 14 + ((i * 53) % 34)}%;--d:${i * 0.025}s"${i === 29 ? ' class="is-odd"' : ''}></i>`)}</div>
          <div class="v-history__axis"><span>Hace 30 días</span><span>Hoy</span></div>
          <p class="v-history__tag">Fuera de su patrón habitual</p>
        </div>`;
      later(60, () => on('.v-history', 'is-run'));
      later(1150, () => on('.v-history', 'is-found'));
    },

    compare() {
      const a = [8, 22, 37, 51, 66, 84], b = [10, 23, 39, 55, 70, 86];
      frame.innerHTML = `
        <div class="v-compare">
          <div class="lane"><span>Autenticación</span><div class="lane__track">${a.map((x) => `<i style="left:${x}%"></i>`).join('')}</div></div>
          <svg class="v-compare__links" viewBox="0 0 100 40" preserveAspectRatio="none">${a.map((x, i) =>
            `<line x1="${x}" y1="0" x2="${b[i]}" y2="40" pathLength="1" style="--d:${0.3 + i * 0.13}s"${i === 3 ? ' class="is-odd"' : ''}/>`).join('')}</svg>
          <div class="lane"><span>Dispositivo</span><div class="lane__track">${b.map((x) => `<i style="left:${x}%"></i>`).join('')}</div></div>
          <p class="v-compare__tag">6 min de diferencia</p>
        </div>`;
      later(60, () => on('.v-compare', 'is-run'));
      later(1200, () => on('.v-compare', 'is-found'));
    },

    alerts() {
      const list = ['Correo sospechoso bloqueado', 'Inicio desde nueva ubicación', 'Ejecución inusual en el equipo', 'Cambio de contraseña', 'Descarga masiva', 'Acceso a recurso compartido'];
      frame.innerHTML = `
        <div class="v-alerts">${list.map((l, i) => `
          <div class="v-alert${i === 2 ? ' is-match' : ''}" style="--d:${0.15 + i * 0.08}s;--x:${0.8 + i * 0.12}s">
            <span class="sev"></span><span class="txt">${l}</span><span class="res">${i === 2 ? 'mismo equipo' : 'no relacionada'}</span>
          </div>`).join('')}</div>`;
      later(60, () => on('.v-alerts', 'is-run'));
    },

    relate() {
      const pts = [[14, 30], [40, 18], [70, 26], [86, 62], [52, 74], [22, 70]];
      const pairs = [[0, 1], [1, 2], [0, 5], [5, 4], [4, 3], [2, 3], [1, 4]];
      frame.innerHTML = `
        <div class="v-relate">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">${pairs.map(([p, q], i) =>
            `<line x1="${pts[p][0]}" y1="${pts[p][1]}" x2="${pts[q][0]}" y2="${pts[q][1]}" pathLength="1" style="--d:${0.2 + i * 0.16}s"${i === 6 ? ' class="is-cut"' : ''}/>`).join('')}</svg>
          ${pts.map(([x, y], i) => `<i class="pt" style="left:${x}%;top:${y}%;--d:${i * 0.06}s"></i>`).join('')}
        </div>`;
      later(60, () => on('.v-relate', 'is-run'));
    },

    order() {
      const labels = ['Intento fallido', '02:14 · inicio', 'Equipo nuevo', 'App inusual', 'Alerta'];
      const from = [[62, 70], [12, 20], [78, 22], [30, 76], [48, 34]];
      frame.innerHTML = `
        <div class="v-order"><i class="v-order__axis"></i>${labels.map((l, i) =>
          `<span class="chipx${i === 4 ? ' is-alert' : ''}" style="--fx:${from[i][0]}%;--fy:${from[i][1]}%;--tx:${8 + i * 19}%;--d:${0.2 + i * 0.12}s">${l}</span>`).join('')}</div>`;
      later(120, () => on('.v-order', 'is-run'));
    },

    validate() {
      const items = ['Inicio de sesión a las 02:14', 'Equipo nunca visto', 'Aplicación poco habitual', 'Alerta en el mismo equipo', '¿Quién usaba el equipo?'];
      frame.innerHTML = `
        <div class="v-validate">${items.map((t, i) => `
          <div class="v-check${i === 4 ? ' is-open' : ''}" style="--d:${0.2 + i * 0.22}s"><span class="mark">${i === 4 ? '?' : '✓'}</span><span>${t}</span><em>${i === 4 ? 'sin confirmar' : 'confirmado'}</em></div>`).join('')}</div>`;
      later(60, () => on('.v-validate', 'is-run'));
    },

    interpret() {
      const chips = ['02:14', 'Equipo nuevo', 'App inusual', 'Alerta', 'Intento fallido', '6 min'];
      frame.innerHTML = `
        <div class="v-interpret">
          <div class="orbitx">${chips.map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</div>
          <p class="v-interpret__q">?</p>
          <p class="v-interpret__t">¿Compromiso o actividad legítima?</p>
        </div>`;
      later(60, () => on('.v-interpret', 'is-run'));
    },
  };

  /* ---------- Secuencia ---------- */
  function show(i) {
    cur = i;
    vt.clear();
    const a = D.actions[i];
    el.querySelector('.bench').classList.remove('is-swap');
    void frame.offsetWidth;
    el.querySelector('.bench').classList.add('is-swap');
    VIG[a.kind]();

    verbEl.innerHTML = `${a.verb} <em>${U.pad2(i + 1)} / ${U.pad2(D.actions.length)}</em>`;
    textEl.textContent = a.text;
    textEl.classList.remove('is-in');
    void textEl.offsetWidth;
    textEl.classList.add('is-in');
    ticks.forEach((t, k) => { t.classList.toggle('is-done', k < i); t.classList.toggle('is-cur', k === i); });

    totals.hours += a.hours;
    totals.queries += QUERIES[i];
    totals.sources = SOURCES[i];
    U.countTo(meters.hours, totals.hours, { duration: 900, format: (v) => `${Math.round(v)}h` });
    U.countTo(meters.queries, totals.queries, { duration: 900, pad: 2 });
    meters.sources.textContent = totals.sources;

    if (a.chip) vt.at(1300, () => dropChip(a));
    if (i === D.actions.length - 1) el.classList.add('is-done');
  }

  function dropChip(a) {
    if (track.querySelector(`[data-chip="${a.chip}"]`)) return;
    const c = document.createElement('span');
    c.className = 'casechip' + (a.alert ? ' is-alert' : '');
    c.dataset.chip = a.chip;
    c.style.cssText = `left:${a.at * 100}%;--lane:${a.lane || 0}`;
    c.innerHTML = `<i></i><span>${a.chip}</span>`;
    track.appendChild(c);
  }

  function schedule(from) {
    tl.clear();
    for (let i = from; i < D.actions.length; i++) {
      tl.at((i - from) * D.stepMs, () => show(i));
    }
  }

  S.enter = () => {
    active = true;
    cur = -1;
    totals = { hours: 0, queries: 0, sources: 0 };
    meters.hours.dataset.value = 0;
    meters.queries.dataset.value = 0;
    meters.hours.textContent = '0h';
    meters.queries.textContent = '00';
    meters.sources.textContent = '0';
    track.querySelectorAll('.casechip').forEach((c) => c.remove());
    frame.innerHTML = '';
    el.classList.remove('is-done');
    ticks.forEach((t) => t.classList.remove('is-done', 'is-cur'));
    verbEl.textContent = '';
    textEl.textContent = '';
    tl.at(1300, () => schedule(0));
  };

  // Cada avance salta a la siguiente acción; al terminar, pasa de escena.
  S.onNext = () => {
    if (cur >= D.actions.length - 1) return false;
    const a = cur >= 0 ? D.actions[cur] : null;
    if (a && a.chip) dropChip(a);
    schedule(cur + 1);
    return true;
  };

  S.leave = () => {
    active = false;
    tl.clear();
    vt.clear();
  };
})();
