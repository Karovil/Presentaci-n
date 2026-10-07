/* ==========================================================================
   ESCENA 32 — UN CASO, MUCHAS MIRADAS
   SRV-PS-014 visto por seis equipos: cada uno ve una señal distinta.
   Luego las seis miradas convergen en un solo contexto.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, CG = EX.caseGraph, P = EX.palette, D = EX.story.lenses;
  let lenses = [], one = null;

  K.scene('lenses', {
    steps: 2,
    enter(ctx) {
      K.base({ org: 'dim', dim: 0.06, hero: true, terrain: 0.3 });
      const h = CG.hero();
      K.fly(h.home.x, h.home.y, 1.15, 2400);
      lenses = D.list.map((l, i) => {
        const a = -Math.PI / 2 + (i / D.list.length) * Math.PI * 2;
        const x = h.home.x + Math.cos(a) * 420, y = h.home.y + Math.sin(a) * 270;
        const n = K.node(ctx, {
          x, y, r: 6, ring: true, color: l.color, label: l.label, sub: l.sees, labelSide: Math.cos(a) < -0.1 ? -1 : 1,
          interactive: true, hitR: 22, probe: K.probeHTML(l.team, l.sees, [['Mirada', l.label]]),
        });
        n.home2 = { x, y };
        n.e = K.edge(ctx, n, h, { ta: 0, td: 0, draw: 0, color: l.color, width: 0.8, dash: [3, 6] });
        ctx.tl.at(1600 + i * 300, () => K.show(n, { e: n.e, ea: 0.35 }));
        return n;
      });
      EX.hud.caption('SRV-PS-014', D.lines[0]);
      one = null;
    },
    step(ctx, n) {
      const h = CG.hero();
      if (n >= 1) {
        ctx.tl.clear();
        lenses.forEach((l, i) => {
          l.ta = 1;
          l.tla = 0;
          l.e.ta = 0.6; l.e.td = 1; l.e.dash = null;
          Wd.moveNode(l, h.home.x + Math.cos(i) * 40, h.home.y + Math.sin(i) * 40, 1600, i * 80, U.ease.inOut);
        });
        if (!one) one = K.node(ctx, { x: h.home.x, y: h.home.y, r: 30, ring: true, color: 'cyan', label: D.one, labelSide: 1, labelSize: 12 });
        ctx.tl.at(1500, () => { one.ta = 1; one.tla = 1; one.tglow = 1; Wd.pulse(one, P.cyan, { r: 160, dur: 1600 }); lenses.forEach((l) => { l.ta = 0.3; }); });
        EX.hud.caption('Un contexto', D.lines[1]);
      } else {
        if (one) { one.ta = 0; one.tla = 0; }
        lenses.forEach((l) => { l.ta = 1; l.tla = 1; l.e.dash = [3, 6]; Wd.moveNode(l, l.home2.x, l.home2.y, 1200); });
        EX.hud.caption('SRV-PS-014', D.lines[0]);
      }
    },
  });
})();
