/* ==========================================================================
   ESCENA 23 — LA MISMA VULNERABILIDAD, DOS CONTEXTOS
   La misma CVE se duplica. A la izquierda, un entorno interno y controlado.
   A la derecha, uno expuesto y crítico. El resultado cambia.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, ST = EX.stations, D = EX.story.twin;
  let center, A = null, B = null;

  function side(ctx, d, dir) {
    const c = ST.twin;
    const root = K.node(ctx, { x: c.x, y: c.y, r: 7, ring: true, color: 'red', label: D.cve, sub: d.title, labelSide: dir, interactive: false });
    const tx = c.x + dir * 560;
    const items = d.items.map((t, i) => {
      const a = (dir > 0 ? 0 : Math.PI) + (i - (d.items.length - 1) / 2) * 0.42;
      const n = K.node(ctx, { x: tx + Math.cos(a) * 250, y: c.y + Math.sin(a) * 250, r: 4, ring: true, color: d.color, label: t, labelSide: dir, labelSize: 10 });
      n.e = K.edge(ctx, root, n, { ta: 0, td: 0, draw: 0, color: d.color, width: 0.9 });
      return n;
    });
    return { root, tx, items, d, dir };
  }

  function open(ctx, s) {
    K.show(s.root);
    Wd.moveNode(s.root, s.tx, ST.twin.y, 1200, 0, U.ease.inOut);
    s.items.forEach((n, i) => ctx.tl.at(1100 + i * 260, () => K.show(n, { e: n.e, ea: 0.5 })));
    ctx.tl.at(1300 + s.items.length * 260, () => {
      ctx.annos.push(EX.anno.create({ target: { x: s.tx, y: ST.twin.y + 300 }, dx: s.dir * 20, dy: 40, color: K.col(s.d.color),
        html: `<span class="anno__k">Resultado</span><strong class="verdict" style="color:${U.rgba(K.col(s.d.color), 1)}">${s.d.verdict}</strong>` }).show());
    });
  }

  K.scene('twin', {
    steps: 3,
    enter(ctx) {
      const c = ST.twin;
      K.base({ org: 'hide' });
      K.fly(c.x, c.y + 30, 0.68, 2000);
      center = K.node(ctx, { x: c.x, y: c.y, r: 9, ring: true, color: 'red', label: 'Vulnerabilidad', sub: D.cve, labelSide: 1, tglow: 1 });
      ctx.tl.at(900, () => { K.show(center); Wd.pulse(center, center.color, { r: 80, dur: 1400 }); });
      A = side(ctx, D.a, -1);
      B = side(ctx, D.b, 1);
      EX.hud.caption('', '');
    },
    step(ctx, n) {
      if (n === 1) { center.ta = 0; center.tla = 0; open(ctx, A); EX.say('', {}); }
      if (n === 2) { open(ctx, B); EX.say(D.lines[0], { pos: 'top', size: 'm', sub: D.lines[1] }); }
    },
  });
})();
