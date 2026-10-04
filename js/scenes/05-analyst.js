/* ==========================================================================
   ESCENA 05 — EL ANALISTA
   El protagonista humano frente a seis ventanas. Su atención salta de una a
   otra mientras tiende hilos a mano: buscar → comparar → revisar →
   relacionar → interpretar → decidir. Los medidores muestran el costo.
   Paso 2: la sobrecarga — más ventanas, más hilos, menos certeza.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.analyst;
  const S = { steps: 2 };
  IRI.scenes.analyst = S;

  let el, svg, winWrap, analyst, trail, meters = {}, wins = [], extras = [];
  let threads = [], gaze = null, done = 0, active = false;
  let total = { minutes: 0, queries: 0, certainty: 0 };
  const tl = new U.Timeline();
  const STEP_MS = 1350;

  /* ---------- Construcción ---------- */
  function rowsHTML(n, alert) {
    let h = '';
    for (let i = 0; i < n; i++) {
      const hh = U.pad2((2 + i * 3 + ((Math.random() * 3) | 0)) % 24);
      const mm = U.pad2((Math.random() * 60) | 0);
      const red = alert && i === 2 ? ' is-alert' : '';
      h += `<div class="row${red}"><span>${hh}:${mm}</span><i style="width:${U.rand(30, 70).toFixed(0)}%"></i><i style="width:${U.rand(8, 22).toFixed(0)}%"></i></div>`;
    }
    return h;
  }
  function timelineHTML() {
    let dots = '';
    for (let i = 0; i < 14; i++) dots += `<i style="left:${U.rand(4, 96).toFixed(1)}%;--h:${U.rand(4, 18).toFixed(0)}px"></i>`;
    return `<div class="tline"><span class="tline__axis"></span>${dots}<b class="tline__hit" style="left:63%"></b></div>
            <div class="tline__scale"><span>-72h</span><span>-48h</span><span>-24h</span><span>ahora</span></div>`;
  }
  function windowHTML(w, i) {
    const body = w.kind === 'timeline' ? timelineHTML() : rowsHTML(5, w.alert);
    return `<div class="win${w.alert ? ' win--alert' : ''}" data-i="${i}" style="left:${w.x}%;top:${w.y}%;--delay:${(0.5 + i * 0.1).toFixed(2)}s">
      <div class="win__bar"><span>${w.title}</span><em>${w.meta}</em></div>
      <div class="win__body">${body}</div>
      <span class="win__verb"></span>
      <i class="win__c tl"></i><i class="win__c tr"></i><i class="win__c bl"></i><i class="win__c br"></i>
    </div>`;
  }

  S.init = (section) => {
    el = section;
    svg = el.querySelector('.threads');
    winWrap = el.querySelector('.windows');
    analyst = el.querySelector('.analyst');
    trail = el.querySelector('.trail');
    el.querySelector('.swap__a').textContent = D.lines[0];
    el.querySelector('.swap__b').textContent = D.lines[1];

    winWrap.innerHTML = D.windows.map(windowHTML).join('');
    wins = [...winWrap.children];
    wins.forEach((w) => {
      w.addEventListener('pointerenter', () => w.classList.add('is-hover'));
      w.addEventListener('pointerleave', () => w.classList.remove('is-hover'));
    });

    trail.innerHTML = D.verbs.map((v, i) => `${i ? '<span class="trail__arrow">→</span>' : ''}<span class="trail__v">${v.verb}</span>`).join('');

    const M = D.meters;
    el.querySelector('.meters').innerHTML = `
      <div class="meter"><span>${M.time}</span><strong data-m="time">0h 00m</strong></div>
      <div class="meter"><span>${M.queries}</span><strong data-m="queries">00</strong></div>
      <div class="meter"><span>${M.windows}</span><strong data-m="windows">00</strong></div>
      <div class="meter meter--cert"><span>${M.certainty}</span><strong data-m="certainty">0%</strong><i class="meter__bar"><b></b></i></div>`;
    el.querySelectorAll('[data-m]').forEach((n) => { meters[n.dataset.m] = n; });
    meters.bar = el.querySelector('.meter__bar b');

    U.onResize(() => { if (active) layout(); });
  };

  /* ---------- Geometría de hilos ---------- */
  function centerOf(node) {
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function headOf() {
    const r = analyst.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height * 0.34 };
  }
  function pathD(a, b, bend) {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const cx = mx + (-dy / len) * bend, cy = my + (dx / len) * bend;
    return `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
  }
  function layout() {
    svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
    threads.forEach((t) => t.el.setAttribute('d', pathD(centerOf(t.from), centerOf(t.to), t.bend)));
    if (gaze) gaze.el.setAttribute('d', pathD(headOf(), centerOf(gaze.to), 0));
  }

  function thread(fromNode, toNode, cls = '') {
    const bend = U.rand(-90, 90);
    const p = U.svgEl('path', { d: pathD(centerOf(fromNode), centerOf(toNode), bend), pathLength: 1, class: 'thread ' + cls });
    svg.appendChild(p);
    const t = { el: p, from: fromNode, to: toNode, bend };
    threads.push(t);
    requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('is-drawn')));
    return t;
  }
  function removeThread(t) {
    t.el.classList.remove('is-drawn');
    t.el.classList.add('is-cut');
    setTimeout(() => t.el.remove(), 900);
    threads = threads.filter((x) => x !== t);
  }
  function lookAt(node) {
    if (!gaze) {
      const p = U.svgEl('path', { class: 'gaze' });
      svg.appendChild(p);
      gaze = { el: p };
    }
    gaze.to = node;
    gaze.el.setAttribute('d', pathD(headOf(), centerOf(node), 0));
    gaze.el.classList.add('is-on');
  }

  /* ---------- Medidores ---------- */
  const fmtTime = (v) => `${Math.floor(v / 60)}h ${U.pad2(Math.round(v) % 60)}m`;
  function setMeters({ minutes, queries, windows, certainty }, ms = 900) {
    U.countTo(meters.time, minutes, { duration: ms, format: fmtTime });
    U.countTo(meters.queries, queries, { duration: ms, pad: 2 });
    U.countTo(meters.windows, windows, { duration: ms, pad: 2 });
    U.countTo(meters.certainty, certainty, { duration: ms, format: (v) => Math.round(v) + '%' });
    meters.bar.style.transform = `scaleX(${certainty / 100})`;
  }

  /* ---------- Secuencia ---------- */
  function doVerb(k, instant = false) {
    const v = D.verbs[k];
    const w = wins[v.win];
    wins.forEach((n) => n.classList.remove('is-focus'));
    if (k > 0) wins[D.verbs[k - 1].win].classList.add('is-done');
    w.classList.add('is-focus', 'is-hit');
    w.querySelector('.win__verb').textContent = `${U.pad2(k + 1)} · ${v.verb}`;
    [...trail.children].filter((n) => n.classList.contains('trail__v')).forEach((n, i) => {
      n.classList.toggle('is-on', i <= k);
      n.classList.toggle('is-cur', i === k);
    });
    [...trail.querySelectorAll('.trail__arrow')].forEach((n, i) => n.classList.toggle('is-on', i < k));

    const from = k === 0 ? analyst : wins[D.verbs[k - 1].win];
    if (v.misstep !== undefined && !instant) {
      // Un primer intento equivocado: el hilo se tiende, no encaja y se corta
      const wrong = thread(from, wins[v.misstep], 'thread--wrong');
      tl.at(700, () => { removeThread(wrong); thread(from, w); });
    } else {
      thread(from, w);
    }
    lookAt(w);

    total.minutes += v.minutes;
    total.queries += v.queries;
    total.certainty = v.certainty;
    setMeters({ ...total, windows: D.windows.length }, instant ? 10 : 900);
    done = k + 1;
  }

  function decide() {
    wins.forEach((n) => n.classList.remove('is-focus'));
    wins[D.verbs[D.verbs.length - 1].win].classList.add('is-done');
    if (gaze) gaze.el.classList.remove('is-on');
    analyst.classList.add('is-deciding');
    trail.classList.add('is-deciding');
    done = D.verbs.length + 1;
  }

  function reset() {
    tl.clear();
    threads.forEach((t) => t.el.remove());
    threads = [];
    if (gaze) { gaze.el.remove(); gaze = null; }
    extras.forEach((x) => x.remove());
    extras = [];
    wins.forEach((n) => n.classList.remove('is-focus', 'is-done', 'is-hit'));
    trail.classList.remove('is-deciding');
    trail.querySelectorAll('.is-on, .is-cur').forEach((n) => n.classList.remove('is-on', 'is-cur'));
    analyst.classList.remove('is-deciding');
    el.classList.remove('is-overloaded');
    total = { minutes: 0, queries: 0, certainty: 0 };
    Object.values(meters).forEach((m) => { if (m.dataset) m.dataset.value = 0; });
    setMeters({ minutes: 0, queries: 0, windows: 0, certainty: 0 }, 10);
    done = 0;
  }

  S.enter = () => {
    active = true;
    reset();
    tl.at(60, layout);
    tl.at(1300, () => setMeters({ minutes: 0, queries: 0, windows: D.windows.length, certainty: 0 }, 600));
    D.verbs.forEach((_, k) => tl.at(2100 + k * STEP_MS, () => doVerb(k)));
    tl.at(2100 + D.verbs.length * STEP_MS + 300, decide);
  };

  // Avanzar durante la secuencia la completa al instante.
  S.onNext = () => {
    if (done > D.verbs.length) return false;
    tl.clear();
    for (let k = done; k < D.verbs.length; k++) doVerb(k, true);
    decide();
    return true;
  };

  /* ---------- Paso 2: sobrecarga ---------- */
  function overload() {
    const O = D.overload;
    // Zonas libres para las ventanas extra (evitan al analista y a los textos)
    const spots = [[30, 46], [70, 47], [12, 64], [88, 64], [52, 30], [34, 82], [66, 84], [92, 26]];
    O.titles.forEach((title, i) => {
      const [x, y] = spots[i % spots.length];
      const n = document.createElement('div');
      n.className = 'win win--extra';
      n.style.cssText = `left:${x + U.rand(-2, 2)}%;top:${y + U.rand(-2, 2)}%;--delay:${(i * 0.12).toFixed(2)}s;--rot:${U.rand(-2.5, 2.5).toFixed(1)}deg`;
      n.innerHTML = `<div class="win__bar"><span>${title}</span><em>·</em></div><div class="win__body">${rowsHTML(3, false)}</div>`;
      winWrap.appendChild(n);
      extras.push(n);
    });
    el.classList.add('is-overloaded');
    // Hilos enredados entre ventanas al azar
    const all = [...wins, ...extras];
    for (let i = 0; i < 14; i++) {
      tl.at(300 + i * 110, () => {
        const a = U.pick(all), b = U.pick(all);
        if (a !== b) thread(a, b, 'thread--tangle');
      });
    }
    setMeters({ minutes: O.minutes, queries: O.queries, windows: D.windows.length + O.titles.length, certainty: O.certainty }, 2200);
  }

  S.setStep = (n) => {
    if (n >= 1) {
      S.onNext();
      overload();
    } else {
      tl.clear();
      extras.forEach((x) => x.remove());
      extras = [];
      threads.filter((t) => t.el.classList.contains('thread--tangle')).forEach(removeThread);
      el.classList.remove('is-overloaded');
      setMeters({ ...total, windows: D.windows.length }, 800);
    }
  };

  S.leave = () => {
    active = false;
    tl.clear();
  };
})();
