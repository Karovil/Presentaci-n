/* ==========================================================================
   ESCENA 09 — EXPIA RECIBE TODO
   La cámara desciende bajo el mapa hasta el núcleo. Siete fuentes se
   conectan, una a una: no son integraciones, son perspectivas del mismo
   entorno, cada una responde una pregunta distinta.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, K = EX.kit, ST = EX.stations, D = EX.story.intake;
  let srcs = [], done = 0;

  function connect(ctx, i) {
    const s = srcs[i];
    if (!s || s.on) return;
    s.on = true;
    s.st.on = true;
    s.e.ta = 0.3; s.e.td = 1;
    s.n.sub = s.p.sees;
    s.n.tla = 1;
    s.n.color = P.cyan;
    EX.core.receive();
    done = i + 1;
  }

  K.scene('intake', {
    enter(ctx) {
      const c = ST.core;
      K.base({ org: 'faint', core: { x: c.x, y: c.y, sub: 'Recibiendo' }, caption: '' });
      done = 0;
      K.fly(c.x - 120, c.y + 40, 0.9, 3000, U.ease.inOut);
      srcs = D.perspectives.map((p, i) => {
        const a = -Math.PI / 2 + (i / D.perspectives.length) * Math.PI * 2;
        const x = c.x + Math.cos(a) * 470, y = c.y + Math.sin(a) * 270;
        const side = Math.cos(a) < -0.2 ? -1 : 1;
        const n = K.node(ctx, {
          x, y, r: 6, ring: true, color: P.asset, label: p.name, labelSide: side, interactive: true, hitR: 30,
          probe: K.probeHTML('Perspectiva', p.name, [['Responde', p.sees]]),
        });
        const cloud = [];
        for (let k = 0; k < 14; k++) {
          const ang = Math.random() * Math.PI * 2, rr = 16 + Math.random() * 30;
          cloud.push(K.node(ctx, { x: x + Math.cos(ang) * rr, y: y + Math.sin(ang) * rr, r: 1.4, color: P.asset }));
        }
        const e = K.edge(ctx, n, EX.core.node, { ta: 0, td: 0, draw: 0, color: P.cyan, width: 0.8, dash: [2, 6], dashFlow: true });
        const st = K.stream(ctx, { from: n, to: EX.core.node, color: P.cyan, rate: 7, speed: 0.55, jitter: 30, on: false, size: 1.5 });
        ctx.tl.at(1800 + i * 90, () => { n.ta = 1; n.tla = 1; cloud.forEach((q) => { q.ta = 0.7; }); });
        return { p, n, e, st, on: false };
      });
      srcs.forEach((_, i) => ctx.tl.at(3400 + i * 900, () => connect(ctx, i)));
      ctx.tl.at(3400 + srcs.length * 900 + 200, () => EX.hud.caption('Perspectivas', D.line));
    },
    onNext(ctx) {
      if (done >= srcs.length) return false;
      ctx.tl.clear();
      srcs.forEach((_, i) => connect(ctx, i));
      EX.hud.caption('Perspectivas', D.line);
      return true;
    },
  });
})();
