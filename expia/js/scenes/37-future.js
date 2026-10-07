/* ==========================================================================
   ESCENA 37 — EL FUTURO
   Alrededor del núcleo, lo que EXPIA ve hoy. Más afuera, en trazo
   discontinuo, el horizonte: nuevos tipos de identidad y de entidad.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, ST = EX.stations, D = EX.story.future;
  K.scene('future', {
    steps: 2,
    init(ctx) { ctx.el.innerHTML = `<p class="future-note">${D.note}</p>`; },
    enter(ctx) {
      const c = ST.core;
      K.base({ org: 'hide', core: { x: c.x, y: c.y, sub: 'Hoy' } });
      K.fly(c.x, c.y, 0.95, 2200);
      K.ring(ctx, { x: c.x, y: c.y, r: 260, color: 'cyan', alpha: 0.3, dash: null, label: D.todayLabel, labelColor: 'cyan' });
      D.today.forEach((t, i) => {
        const a = -Math.PI / 2 + (i / D.today.length) * Math.PI * 2;
        const n = K.node(ctx, { x: c.x + Math.cos(a) * 260, y: c.y + Math.sin(a) * 260, r: 4.5, ring: true, color: 'cyan', label: t, labelSide: Math.cos(a) < -0.1 ? -1 : 1, labelSize: 10 });
        ctx.tl.at(1200 + i * 160, () => K.show(n));
      });
      ctx.tl.at(1400, () => EX.hud.caption('', 'Lo que EXPIA conecta hoy.'));
    },
    step(ctx, n) {
      if (n < 1) return;
      const c = ST.core;
      EX.core.setSub('Horizonte');
      K.fly(c.x, c.y, 0.48, 2600);
      K.ring(ctx, { x: c.x, y: c.y, r: 620, color: 'violet', alpha: 0.35, dash: [3, 8], label: D.tomorrowLabel, labelColor: 'violet' });
      D.tomorrow.forEach((t, i) => {
        const a = -Math.PI / 2 + ((i + 0.5) / D.tomorrow.length) * Math.PI * 2;
        const nd = K.node(ctx, { x: c.x + Math.cos(a) * 620, y: c.y + Math.sin(a) * 560, r: 5, ring: true, color: 'violet', label: t, labelSide: Math.cos(a) < -0.1 ? -1 : 1 });
        const e = K.edge(ctx, EX.core.node, nd, { ta: 0, color: 'violet', width: 0.6, dash: [2, 8] });
        ctx.tl.at(1400 + i * 220, () => { K.show(nd); e.ta = 0.25; Wd.pulse(nd, nd.color, { r: 40, dur: 1200 }); });
      });
      ctx.el.classList.add('is-on');
      EX.hud.caption('', D.line);
    },
    leave(ctx) { ctx.el.classList.remove('is-on'); },
  });
})();
