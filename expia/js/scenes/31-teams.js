/* ==========================================================================
   ESCENA 31 — ¿Y TODO LO DEMÁS?
   La inteligencia sale del núcleo hacia ocho capacidades de seguridad.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, ST = EX.stations, D = EX.story.teams;
  K.scene('teams', {
    enter(ctx) {
      const c = ST.core;
      K.base({ org: 'hide', core: { x: c.x, y: c.y, sub: 'Inteligencia' } });
      K.fly(c.x, c.y + 20, 0.62, 2200);
      D.list.forEach((t, i) => {
        const a = -Math.PI / 2 + (i / D.list.length) * Math.PI * 2;
        const x = c.x + Math.cos(a) * 640, y = c.y + Math.sin(a) * 420;
        const n = K.node(ctx, {
          x, y, r: 8, ring: true, color: 'ink', label: t.name, sub: t.use, labelSide: Math.cos(a) < -0.1 ? -1 : 1, subSize: 12,
          interactive: true, hitR: 26, probe: K.probeHTML('Capacidad de seguridad', t.name, [['Usa EXPIA para', t.use]]),
        });
        const e = K.edge(ctx, EX.core.node, n, { ta: 0, td: 0, draw: 0, color: 'cyan', width: 0.8 });
        ctx.tl.at(1400 + i * 260, () => {
          K.show(n, { e, ea: 0.3 });
          K.stream(ctx, { from: EX.core.node, to: n, color: 'cyan', rate: 2.5, speed: 0.45, size: 1.5 });
        });
      });
      ctx.tl.at(1400 + D.list.length * 260 + 400, () => EX.hud.caption('Capacidades', D.line));
    },
  });
})();
