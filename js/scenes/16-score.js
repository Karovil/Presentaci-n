/* ==========================================================================
   ESCENA 16 — IDENTITY RISK SCORE
   El puntaje no aparece de la nada: se construye factor a factor.
   Cada evidencia suma o resta, y el indicador se mueve con ella.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.score;
  const S = { steps: 1 };
  IRI.scenes.score = S;

  let el, valueArc, numEl, levelEl, rows = [], k = 0, score = 0, active = false;
  const tl = new U.Timeline();
  const SWEEP = 75;   // el arco ocupa 270° (75 % del círculo)

  S.init = (section) => {
    el = section;
    valueArc = el.querySelector('.gauge__value');
    numEl = el.querySelector('.gauge__num');
    levelEl = el.querySelector('.gauge__level');
    el.querySelector('.gauge__title').textContent = D.title;
    el.querySelector('.score__note').textContent = D.note;

    // Marcas: cada 10 puntos y umbrales de nivel
    const ticks = el.querySelector('.gauge__ticks');
    for (let v = 0; v <= D.max; v += 5) {
      const a = ((135 + (v / D.max) * 270) * Math.PI) / 180;
      const major = v % 10 === 0;
      const lvl = D.levels.some(([th]) => th === v && v > 0);
      const r1 = 96, r2 = lvl ? 106 : major ? 101 : 99;
      ticks.appendChild(U.svgEl('line', { x1: 100 + Math.cos(a) * r1, y1: 100 + Math.sin(a) * r1, x2: 100 + Math.cos(a) * r2, y2: 100 + Math.sin(a) * r2, class: lvl ? 'is-level' : '' }));
    }

    el.querySelector('.factors').innerHTML =
      `<li class="factor factor--base"><span class="factor__d">${D.base}</span><span class="factor__l">Línea base de la identidad</span><i style="--w:${D.base}%"></i></li>` +
      D.factors.map((f) => `
        <li class="factor${f.delta < 0 ? ' is-neg' : ''}${f.alert ? ' is-alert' : ''}">
          <span class="factor__d">${f.delta > 0 ? '+' : '−'}${Math.abs(f.delta)}</span>
          <span class="factor__l">${f.label}</span>
          <i style="--w:${Math.abs(f.delta) * 2}%"></i>
        </li>`).join('');
    rows = [...el.querySelectorAll('.factor')];
  };

  const levelOf = (v) => D.levels.reduce((acc, [th, name]) => (v >= th ? name : acc), D.levels[0][1]);

  function setScore(v, ms = 900) {
    score = v;
    valueArc.style.strokeDasharray = `${(v / D.max) * SWEEP} 100`;
    U.countTo(numEl, v, { duration: ms, pad: 2 });
    levelEl.innerHTML = `${D.levelLabel} <b>${levelOf(v)}</b>`;
    el.dataset.level = levelOf(v);
  }

  function reveal(i) {
    k = i + 1;
    rows[i].classList.add('is-in');
    if (i === 0) setScore(D.base);
    else setScore(score + D.factors[i - 1].delta);
    if (k === rows.length) el.classList.add('is-final');
  }

  S.enter = () => {
    active = true;
    k = 0;
    score = 0;
    numEl.dataset.value = 0;
    numEl.textContent = '00';
    valueArc.style.strokeDasharray = `0 100`;
    levelEl.textContent = '';
    rows.forEach((r) => r.classList.remove('is-in'));
    el.classList.remove('is-final');
    rows.forEach((_, i) => tl.at(1700 + i * 950, () => reveal(i)));
  };

  S.onNext = () => {
    if (k >= rows.length) return false;
    tl.clear();
    let v = score;
    for (let i = k; i < rows.length; i++) {
      rows[i].classList.add('is-in');
      v = i === 0 ? D.base : v + D.factors[i - 1].delta;
    }
    k = rows.length;
    setScore(v, 600);
    el.classList.add('is-final');
    return true;
  };

  S.leave = () => { active = false; tl.clear(); };
})();
