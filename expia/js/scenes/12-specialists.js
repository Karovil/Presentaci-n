/* ==========================================================================
   ESCENA 12 — NO TODO ES IGUAL
   El contexto llega al núcleo convertido en investigaciones. Pero cada una
   pide un conocimiento distinto. Alrededor del núcleo quedan lugares vacíos:
   EXPIA necesita especialistas.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, ST = EX.stations, D = EX.story.specialists;
  let inv = [], seats = [];

  K.scene('specialists', {
    steps: 3,
    enter(ctx) {
      const c = ST.core;
      K.base({ org: 'hide', core: { x: c.x, y: c.y, sub: 'Orquestador' } });
      K.fly(c.x, c.y + 20, 0.95, 2400);
      inv = D.kinds.map((k, i) => {
        const a = -Math.PI / 2 + (i / D.kinds.length) * Math.PI * 2 + 0.2;
        const tx = c.x + Math.cos(a) * 230, ty = c.y + Math.sin(a) * 190;
        const n = K.node(ctx, {
          x: c.x - 900, y: c.y + U.rand(-300, 300), r: 5, ring: true, color: k.color,
          label: k.label, labelSide: Math.cos(a) < -0.1 ? -1 : 1, interactive: true, hitR: 24,
          probe: K.probeHTML('Investigación', k.label, [['Requiere', k.needs]]),
        });
        n.dest = { x: tx, y: ty, a };
        n.e = K.edge(ctx, EX.core.node, n, { ta: 0, color: k.color, width: 0.8, dash: [2, 5] });
        ctx.tl.at(1600 + i * 380, () => {
          n.ta = 1; n.tla = 1;
          Wd.moveNode(n, tx, ty, 1400, 0, U.ease.out);
          ctx.tl.at(1300, () => { n.e.ta = 0.4; EX.core.receive(); });
        });
        return n;
      });
      // Lugares vacíos para especialistas
      seats = D.kinds.map((k, i) => {
        const a = inv[i].dest.a;
        return K.ring(ctx, { x: c.x + Math.cos(a) * 470, y: c.y + Math.sin(a) * 360, r: 34, color: k.color, alpha: 0.45, dash: [3, 5], on: false });
      });
      ctx.tl.at(1600 + D.kinds.length * 380 + 800, () => { EX.core.think(true); EX.say(D.lines[0], { pos: 'low', size: 'm' }); });
    },
    step(ctx, n) {
      ctx.tl.clear();
      inv.forEach((x) => { x.ta = 1; x.tla = 1; x.e.ta = 0.4; Wd.moveNode(x, x.dest.x, x.dest.y, 600); x.sub = n >= 1 ? D.kinds[inv.indexOf(x)].needs : ''; });
      if (n === 1) EX.say(D.lines[0], { pos: 'low', size: 'm', sub: 'Cada una requiere un conocimiento distinto.' });
      seats.forEach((s, i) => { s.on = n >= 2; });
      if (n >= 2) { EX.say(D.lines[1], { pos: 'low', size: 'm' }); K.fly(ST.core.x, ST.core.y + 20, 0.72, 1800); }
      else K.fly(ST.core.x, ST.core.y + 20, 0.95, 1400);
    },
    leave() { EX.core.think(false); },
  });
})();
