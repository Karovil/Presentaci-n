/* ==========================================================================
   ESCENA 21 — DE VULNERABILIDAD A EXPOSICIÓN
   Una señal recorre cinco estados: CVE → vulnerabilidad → contexto →
   exposición → señal de riesgo. En "contexto" la rodean los factores que
   cambian su relevancia.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.transform;
  const COLORS = ['red', 'orange', 'cyan', 'orange', 'red'];
  let stages = [], token = null, facs = [];

  K.scene('transform', {
    steps: 2,
    enter(ctx) {
      const c = ST.transform;
      K.base({ org: 'hide' });
      K.fly(c.x, c.y + 40, 0.78, 2200);
      stages = D.stages.map((label, i) => K.node(ctx, {
        x: c.x - 820 + i * 410, y: c.y, r: 6, ring: true, color: COLORS[i], label, labelSide: 1, labelSize: 10,
      }));
      stages.forEach((n, i) => { if (i) n.e = K.edge(ctx, stages[i - 1], n, { ta: 0, td: 0, draw: 0, color: [150, 175, 225], width: 1 }); });
      token = K.node(ctx, { x: stages[0].x, y: stages[0].y, r: 3, color: 'red', tglow: 1 });
      stages.forEach((n, i) => ctx.tl.at(900 + i * 900, () => {
        K.show(n, { e: n.e, ea: 0.5 });
        token.ta = 1;
        Wd.moveNode(token, n.x, n.y, 800, 0, U.ease.inOut);
        token.color = n.color;
        token.r = 3 + i * 1.6;
        Wd.pulse(n, n.color, { r: 40 + i * 12, dur: 1200 });
        if (i === 2) facs.forEach((f, k) => ctx.tl.at(300 + k * 120, () => K.show(f, { e: f.e, ea: 0.35 })));
      }));
      // Factores alrededor de "contexto"
      const ctxNode = stages[2];
      facs = D.factors.map((f, k) => {
        const a = -Math.PI / 2 + ((k + 0.5) / D.factors.length) * Math.PI * 2;
        const n = K.node(ctx, { x: ctxNode.x + Math.cos(a) * 230, y: ctxNode.y + Math.sin(a) * 210, r: 2.6, color: 'cyan', label: f, labelSide: Math.cos(a) < -0.1 ? -1 : 1, labelSize: 9 });
        n.e = K.edge(ctx, ctxNode, n, { ta: 0, color: 'cyan', width: 0.6, dash: [2, 4] });
        return n;
      });
      EX.hud.caption('', '');
      ctx.tl.at(900 + 5 * 900, () => EX.say(D.lines[0], { pos: 'top', size: 'm' }));
    },
    step(ctx, n) {
      if (n >= 1) {
        ctx.tl.clear();
        stages.forEach((s) => K.show(s, { e: s.e, ea: 0.5 }));
        facs.forEach((f) => K.show(f, { e: f.e, ea: 0.35 }));
        token.ta = 1;
        Wd.moveNode(token, stages[4].x, stages[4].y, 600);
        EX.say(D.lines[1], { pos: 'top', size: 'm', sub: 'No todas las vulnerabilidades tienen el mismo impacto.' });
        K.fly(ST.transform.x - 380, ST.transform.y + 30, 1.05, 1800);
      } else EX.say(D.lines[0], { pos: 'top', size: 'm' });
    },
  });
})();
