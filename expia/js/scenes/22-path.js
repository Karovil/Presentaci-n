/* ==========================================================================
   ESCENA 22 — RUTA DE EXPOSICIÓN
   La cámara sigue una cadena: Internet → firewall → aplicación →
   SRV-PS-014 → vulnerabilidad → usuario privilegiado → recurso sensible.
   Es una representación conceptual de relaciones, no un ataque confirmado.
   Hover sobre cualquier eslabón: se resalta la cadena completa.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, ST = EX.stations, D = EX.story.path;
  let chain = null, hot = 0, follow = 0;

  K.scene('path', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `<div class="pathtag"><p class="pathtag__k">${D.title}</p><p class="pathtag__n">${D.note}</p></div>`;
      Wd.onHover((n) => {
        if (!chain || !n || !chain.nodes.includes(n)) { if (chain && hot) { hot = 0; glow(false); } return; }
        hot = 1; glow(true);
      });
    },
    enter(ctx) {
      const c = ST.path;
      K.base({ org: 'hide' });
      const pts = D.chain.map((d, i) => ({
        x: c.x - 900 + i * 300, y: c.y + Math.sin(i * 1.1) * 160 - i * 20,
        color: d.color, label: d.label, sub: d.sub, labelSide: 1, r: d.hero ? 8 : 6,
        interactive: true, hitR: 22,
        probe: K.probeHTML(`Eslabón ${i + 1} de ${D.chain.length}`, d.label, [['Detalle', d.sub]]),
      }));
      chain = K.chain(ctx, pts, { gap: 1100, delay: 1200, edgeColor: [255, 138, 61], ea: 0.7 });
      chain.edges.forEach((e) => { e.width = 1.4; e.drawSpeed = 1.2; });
      // La cámara acompaña la construcción
      K.fly(pts[0].x + 200, pts[0].y, 1.4, 1800);
      follow = 0;
      pts.forEach((p, i) => ctx.tl.at(1200 + i * 1100, () => { K.fly(p.x + 120, p.y, 1.4, 1100); }));
      ctx.tl.at(1200 + pts.length * 1100 + 200, () => frameAll());
      EX.hud.caption('', '');
    },
    onNext(ctx) {
      if (ctx.step > 0 || chain.nodes.every((n) => n.ta === 1)) return false;
      ctx.tl.clear();
      chain.nodes.forEach((n, i) => K.show(n, { e: chain.edges[i - 1], ea: 0.7 }));
      frameAll();
      return true;
    },
    step(ctx, n) {
      if (n >= 1) {
        ctx.tl.clear();
        chain.nodes.forEach((x, i) => K.show(x, { e: chain.edges[i - 1], ea: 0.7 }));
        frameAll();
        glow(true);
        K.stream(ctx, { path: chain.nodes, color: 'orange', rate: 3, speed: 0.22, size: 2.2 });
        ctx.el.classList.add('is-on');
      } else { glow(false); ctx.el.classList.remove('is-on'); }
    },
    leave(ctx) { chain = null; ctx.el.classList.remove('is-on'); },
  });

  function frameAll() {
    const c = ST.path;
    K.fly(c.x + 130, c.y + 10, 0.72, 1800);
  }
  function glow(on) {
    if (!chain) return;
    chain.nodes.forEach((n) => { n.tglow = on ? 0.9 : 0; });
    chain.edges.forEach((e) => { e.ta = on ? 1 : 0.7; e.width = on ? 2 : 1.4; });
  }
})();
