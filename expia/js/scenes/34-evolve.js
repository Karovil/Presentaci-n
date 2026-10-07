/* ==========================================================================
   ESCENA 34 — DEL INVENTARIO A LA INTELIGENCIA
   El mismo mapa atraviesa cinco estados. En cada uno cambia lo que se ve
   y la pregunta que se puede responder.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, OM = EX.orgMap, P = EX.palette, CG = EX.caseGraph, D = EX.story.evolve;
  let saved = [], stageEls = [], qEl;

  function look(i) {
    const nodes = OM.all();
    nodes.forEach((n) => { n.color = P[n.info.cluster.color || 'asset']; n.tglow = 0; n.ta = 1; });
    Wd.edges.forEach((e) => { if (e.tags.includes('org')) e.ta = e.base * (i === 0 ? 0.3 : 1); });
    if (i >= 1) nodes.forEach((n) => { if (['servers', 'apps', 'cloud'].includes(n.info.cluster.key) && n.info.idx % 4 === 0) n.color = P.yellow; });
    if (i >= 2) nodes.forEach((n) => { if (n.info.cluster.key === 'servers' && n.info.idx % 6 === 0) n.color = P.orange; });
    if (i >= 3) {
      nodes.forEach((n) => { if (n.color === P[n.info.cluster.color || 'asset']) n.ta = 0.25; });
      Wd.edges.forEach((e) => { if (e.tags.includes('bridge')) e.ta = 0.4; });
    }
    if (i >= 4) {
      const h = CG.hero();
      nodes.forEach((n) => { n.ta = n === h ? 1 : 0.12; });
      CG.emphasizeHero(true);
      h.color = P.red;
      Wd.pulse(h, P.red, { r: 160, dur: 1600 });
    } else CG.emphasizeHero(false);
    stageEls.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-past', k < i); });
    qEl.textContent = D.stages[i].q;
    qEl.classList.remove('is-in'); void qEl.offsetWidth; qEl.classList.add('is-in');
  }

  K.scene('evolve', {
    steps: 5,
    init(ctx) {
      ctx.el.innerHTML = `<ol class="stages">${D.stages.map((s, i) => `<li><b>${U.pad(i + 1)}</b>${s.label}</li>`).join('')}</ol><p class="stage-q"></p>`;
      stageEls = [...ctx.el.querySelectorAll('li')];
      qEl = ctx.el.querySelector('.stage-q');
    },
    enter(ctx) {
      K.base({ org: 'show', labels: false, terrain: 0.5 });
      K.fly(-80, 20, 0.36, 2200);
      look(0);
    },
    step(ctx, n) {
      look(n);
      if (n >= 4) { const h = CG.hero(); Wd.flyTo({ x: h.home.x, y: h.home.y, z: 0.9 * K.F() }, 2200); }
      else K.fly(-80, 20, 0.36, 1600);
    },
    leave() { CG.hero().color = P.server; },
  });
})();
