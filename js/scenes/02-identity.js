/* ==========================================================================
   ESCENA 02 — UNA IDENTIDAD
   Un núcleo y sus señales. Cada señal aparece, se conecta y empieza a
   enviar pulsos hacia la identidad. En el paso 2 las señales se multiplican.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.identity;
  const S = { steps: 2 };
  IRI.scenes.identity = S;

  let el, orbit, svg, pulsesG, microG, countEl, sigEls = [], lines = [], micro = [];
  let pulses = [], active = false, revealed = 0;
  const tl = new U.Timeline();
  const CORE_R = 9;      // radio del núcleo en unidades del viewBox (0–100)
  let loop;

  S.init = (section) => {
    el = section;
    orbit = el.querySelector('.orbit');
    countEl = el.querySelector('[data-count]');
    el.querySelector('.swap__a').textContent = D.lines[0];
    el.querySelector('.swap__b').textContent = D.lines[1];

    // Posiciones orgánicas alrededor del núcleo
    const pos = D.signals.map((s, i) => {
      const a = (-90 + i * 60 + U.rand(-9, 9)) * (Math.PI / 180);
      const r = U.rand(36, 41);
      return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r, a, r };
    });

    orbit.innerHTML = `
      <svg class="orbit__svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="orbit__guide" cx="50" cy="50" r="24"/>
        <circle class="orbit__guide orbit__guide--2" cx="50" cy="50" r="38.5"/>
        <g class="micro"></g>
        <g class="links"></g>
        <g class="pulses"></g>
      </svg>
      <div class="core">
        <i class="core__ring r1"></i><i class="core__ring r2"></i><i class="core__ring r3"></i>
        <div class="core__body">${U.icon('user')}</div>
        <div class="core__label">${D.core}</div>
      </div>
      ${D.signals.map((s, i) => `
        <div class="sig${s.alert ? ' sig--alert' : ''}" data-i="${i}" style="left:${pos[i].x}%;top:${pos[i].y}%">
          <div class="sig__dot">${U.icon(s.icon)}<span class="sig__sats"><i></i><i></i><i></i></span></div>
          <div class="sig__label">${s.label}</div>
          <div class="sig__desc">${s.desc}</div>
        </div>`).join('')}
    `;
    svg = orbit.querySelector('svg');
    pulsesG = svg.querySelector('.pulses');
    microG = svg.querySelector('.micro');
    sigEls = [...orbit.querySelectorAll('.sig')];

    // Líneas núcleo → señal (recortadas al borde de cada elemento)
    const linksG = svg.querySelector('.links');
    lines = pos.map((p, i) => {
      const x1 = 50 + Math.cos(p.a) * CORE_R, y1 = 50 + Math.sin(p.a) * CORE_R;
      const x2 = 50 + Math.cos(p.a) * (p.r - 4.2), y2 = 50 + Math.sin(p.a) * (p.r - 4.2);
      const ln = U.svgEl('line', { x1, y1, x2, y2, pathLength: 1, class: 'link' + (D.signals[i].alert ? ' link--alert' : '') });
      linksG.appendChild(ln);
      return { el: ln, x1, y1, x2, y2, alert: !!D.signals[i].alert, on: false };
    });

    // Micro-señales del paso 2: pequeñas huellas que cuelgan de cada señal
    for (let k = 0; k < 42; k++) {
      const parent = k % pos.length;
      const p = pos[parent];
      const a = p.a + U.rand(-0.6, 0.6);
      const r = p.r + U.rand(-9, 8);
      const x = 50 + Math.cos(a) * r, y = 50 + Math.sin(a) * r;
      const g = U.svgEl('g', { class: 'm' + (D.signals[parent].alert ? ' m--alert' : ''), style: `transition-delay:${(k * 0.045).toFixed(2)}s` });
      g.appendChild(U.svgEl('line', { x1: x, y1: y, x2: p.x, y2: p.y }));
      g.appendChild(U.svgEl('circle', { cx: x, cy: y, r: U.rand(0.25, 0.55) }));
      microG.appendChild(g);
      micro.push(g);
    }

    // Hover: resalta la línea de la señal
    sigEls.forEach((s, i) => {
      s.addEventListener('pointerenter', () => { lines[i].el.classList.add('is-hot'); orbit.classList.add('has-hot'); });
      s.addEventListener('pointerleave', () => { lines[i].el.classList.remove('is-hot'); orbit.classList.remove('has-hot'); });
    });

    loop = new U.Loop(tick);
  };

  function showSignal(i) {
    sigEls[i].classList.add('is-on');
    lines[i].el.classList.add('is-on');
    lines[i].on = true;
    revealed = Math.max(revealed, i + 1);
    countEl.textContent = U.pad2(revealed);
    countEl.dataset.value = revealed;
    // Dos pulsos por línea, desfasados
    pulses.push(makePulse(i, 0), makePulse(i, 0.5));
  }

  function makePulse(i, phase) {
    const c = U.svgEl('circle', { r: 0.55, class: 'pulse' + (lines[i].alert ? ' pulse--alert' : '') });
    pulsesG.appendChild(c);
    return { i, t: phase, speed: U.rand(0.28, 0.42), el: c };
  }

  // Los pulsos viajan de la señal hacia la identidad
  function tick(dt) {
    for (const p of pulses) {
      const L = lines[p.i];
      p.t = (p.t + dt * p.speed) % 1;
      const k = U.ease.inOutSine(p.t);
      p.el.setAttribute('cx', U.lerp(L.x2, L.x1, k));
      p.el.setAttribute('cy', U.lerp(L.y2, L.y1, k));
      p.el.style.opacity = Math.sin(p.t * Math.PI).toFixed(3);
    }
  }

  function reset() {
    tl.clear();
    pulses.forEach((p) => p.el.remove());
    pulses = [];
    revealed = 0;
    countEl.textContent = '00';
    countEl.dataset.value = 0;
    sigEls.forEach((s) => s.classList.remove('is-on'));
    lines.forEach((l) => { l.el.classList.remove('is-on'); l.on = false; });
    orbit.classList.remove('is-core', 'is-multiplied');
  }

  S.enter = () => {
    active = true;
    reset();
    loop.start();
    tl.at(700, () => orbit.classList.add('is-core'));
    D.signals.forEach((_, i) => tl.at(1700 + i * 620, () => showSignal(i)));
  };

  // Durante la aparición, avanzar completa la escena en lugar de saltarla.
  S.onNext = () => {
    if (revealed < D.signals.length) {
      tl.clear();
      orbit.classList.add('is-core');
      D.signals.forEach((_, i) => { if (!lines[i].on) showSignal(i); });
      return true;
    }
    return false;
  };

  S.setStep = (n) => {
    if (n >= 1) {
      S.onNext();
      orbit.classList.add('is-multiplied');
      U.countTo(countEl, D.countAfter, { duration: 2200, pad: 2 });
    } else {
      orbit.classList.remove('is-multiplied');
      U.countTo(countEl, D.signals.length, { duration: 600, pad: 2 });
    }
  };

  S.leave = () => {
    active = false;
    tl.clear();
    setTimeout(() => { if (!active) loop.stop(); }, 1600);
  };
})();
