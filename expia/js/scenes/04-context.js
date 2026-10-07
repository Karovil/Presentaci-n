/* ==========================================================================
   ESCENA 04 — LA SEÑAL Y SU CONTEXTO
   Paso 1: la vulnerabilidad sola. "Una vulnerabilidad no es el riesgo."
   Paso 2: el contexto aparece relación por relación. "Es una señal."
   Paso 3: cada relación abre otras: el nodo se convierte en grafo.
           "El riesgo aparece cuando entendemos el contexto."
   Al pasar el cursor, cada relación dice de qué fuente proviene.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, OM = EX.orgMap, CG = EX.caseGraph;
  const T = EX.text.context, D = EX.org;
  const S = { steps: 3 };
  EX.scenes.context = S;

  let el, ctxNodes = [], leaves = [], active = false, shown = 0, sourcesEl;
  const tl = new U.Timeline();
  const STATE = { neutral: P.ink, green: P.green, yellow: P.yellow, orange: P.orange, red: P.red };
  const CROSS = [['exposure', 'controls'], ['privilege', 'relations'], ['baseline', 'exception'], ['exposure', 'software'], ['critical', 'owner']];

  S.init = (section) => {
    el = section;
    sourcesEl = el.querySelector('.sources');
    const srcs = [...new Set(D.context.map((c) => c.source))];
    sourcesEl.innerHTML = `<span>${T.sourcesFooter}</span>` + srcs.map((s, i) => `<b style="--d:${(i * 0.12).toFixed(2)}s">${s}</b>`).join('');

    Wd.onHover((n) => {
      if (!active) return;
      if (!n || !n.ctx) { EX.probe.hide(); return; }
      const c = n.ctx;
      EX.probe.show(`
        <span class="probe__k">${c.title}</span>
        <strong>${c.value}</strong>
        <span class="probe__row"><em>${T.sourceLabel}</em>${c.source}</span>`);
    });
  };

  /* Disposición: elipse alrededor de la CVE, con radios alternos */
  function place(i, n) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.18;
    const r = i % 2 ? 236 : 186;
    return { x: Math.cos(a) * r * 1.18, y: Math.sin(a) * r * 0.78, a };
  }

  function build() {
    const c = CG.cve();
    const cx = c.x, cy = c.y;
    ctxNodes = D.context.map((d, i) => {
      const p = place(i, D.context.length);
      const n = Wd.addNode({
        id: 'ctx-' + d.key,
        x: cx, y: cy,
        r: 5.5, fixed: true, ring: true,
        color: STATE[d.state], ta: 0, tags: ['context'],
        label: d.title, sub: d.value, tla: 0,
        labelSide: p.x < 0 ? -1 : 1,
        interactive: true, hitR: 18, ctx: d,
      });
      n.dest = { x: cx + p.x, y: cy + p.y, a: p.a };
      n.edge = Wd.addEdge(c, n, { ta: 0, td: 0, draw: 0, color: STATE[d.state] === P.ink ? [150, 175, 225] : STATE[d.state], width: 1, tags: ['context'] });
      return n;
    });
    // Relaciones de segundo grado
    leaves = [];
    ctxNodes.forEach((n) => {
      for (let k = 0; k < n.ctx.leaves; k++) {
        // Las hojas se abren en vertical (arriba o abajo) para no tapar la etiqueta
        const vy = Math.sin(n.dest.a) < 0 ? -1 : 1;
        const spread = (k - (n.ctx.leaves - 1) / 2) * 34;
        const r = 62 + Math.random() * 22;
        const l = Wd.addNode({ x: n.dest.x, y: n.dest.y, r: 2.4, fixed: true, color: n.color, ta: 0, tags: ['context', 'leaf'] });
        l.dest = { x: n.dest.x + Math.cos(n.dest.a) * 26 + spread, y: n.dest.y + vy * r };
        l.edge = Wd.addEdge(n, l, { ta: 0, td: 0, draw: 0, color: [150, 175, 225], width: 0.7, tags: ['context'] });
        leaves.push(l);
      }
    });
    // Relaciones cruzadas entre contextos
    const byKey = Object.fromEntries(ctxNodes.map((n) => [n.ctx.key, n]));
    CROSS.forEach(([a, b]) => {
      const e = Wd.addEdge(byKey[a], byKey[b], { ta: 0, td: 0, draw: 0, color: P.orange, width: 0.8, dash: [3, 5], curve: 0.18, tags: ['context', 'cross'], dashFlow: true });
      leaves.push({ crossEdge: e });
    });
  }

  function showCtx(i) {
    const n = ctxNodes[i];
    n.ta = 1;
    n.tla = 1;
    Wd.moveNode(n, n.dest.x, n.dest.y, 1000, 0, U.ease.out);
    n.edge.ta = 0.55;
    n.edge.td = 1;
    if (n.ctx.state === 'red' || n.ctx.state === 'orange') Wd.pulse(n, n.color, { r: 40, dur: 1200 });
    shown = Math.max(shown, i + 1);
  }

  function hideCtx() {
    tl.clear();
    ctxNodes.forEach((n) => { n.ta = 0; n.tla = 0; n.edge.ta = 0; n.edge.td = 0; Wd.moveNode(n, CG.cve().x, CG.cve().y, 600); });
    shown = 0;
  }

  function expand(on) {
    leaves.forEach((l, k) => {
      if (l.crossEdge) { l.crossEdge.ta = on ? 0.5 : 0; l.crossEdge.td = on ? 1 : 0; return; }
      if (on) {
        setTimeout(() => {
          if (!active) return;
          l.ta = 0.8;
          Wd.moveNode(l, l.dest.x, l.dest.y, 900, 0, U.ease.out);
          l.edge.ta = 0.35;
          l.edge.td = 1;
        }, k * 35);
      } else {
        l.ta = 0; l.edge.ta = 0; l.edge.td = 0;
      }
    });
    el.classList.toggle('is-graph', on);
  }

  function frame() {
    const c = CG.cve();
    // La cámara deja la CVE a la derecha del centro: espacio para la leyenda
    return { x: c.x - 60, y: c.y + 10, z: 1.5 * Math.min(innerWidth / 1600, innerHeight / 900) };
  }

  S.enter = () => {
    active = true;
    OM.reveal();
    OM.setTerrain(0.35);
    OM.setLabels(0);
    CG.emphasizeHero(true);
    CG.showCve(true);
    const near = CG.neighbors();
    OM.dim((n) => near.has(n), 0.05, 0.08);
    Wd.drift(null);
    Wd.removeNow('context');
    build();
    Wd.flyTo(frame(), 2000);
    tl.at(700, () => EX.hud.caption(D.cve.id, T.lines[0]));
    tl.at(1200, () => Wd.pulse(CG.cve(), P.red, { r: 110, dur: 1600 }));
  };

  // Durante la aparición del contexto, avanzar la completa
  S.onNext = () => {
    if (el.dataset.step === '1' && shown < ctxNodes.length) {
      tl.clear();
      for (let i = shown; i < ctxNodes.length; i++) showCtx(i);
      return true;
    }
    return false;
  };

  S.setStep = (n) => {
    if (n === 0) { hideCtx(); expand(false); EX.hud.caption(D.cve.id, T.lines[0]); }
    if (n >= 1 && shown === 0) {
      ctxNodes.forEach((_, i) => tl.at(300 + i * 520, () => showCtx(i)));
    }
    if (n === 1) { expand(false); EX.hud.caption(D.cve.id, T.lines[1]); }
    if (n >= 2) {
      for (let i = shown; i < ctxNodes.length; i++) showCtx(i);
      expand(true);
      EX.hud.caption(D.cve.id, T.lines[2]);
      // Un poco más de campo para ver el grafo completo
      const f = frame();
      Wd.flyTo({ ...f, z: f.z * 0.84 }, 1800);
    } else if (n === 1) {
      Wd.flyTo(frame(), 1400);
    }
  };

  S.leave = () => {
    active = false;
    tl.clear();
    EX.probe.hide();
    Wd.remove('context');
    el.classList.remove('is-graph');
    ctxNodes = [];
    leaves = [];
    shown = 0;
  };
})();
