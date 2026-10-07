/* ==========================================================================
   ESCENA 33 — LA SUPERFICIE COMPLETA
   Vuelven los 2.847 activos (y las regiones ampliadas). Ya no son puntos:
   cada uno lleva un nivel de exposición y las zonas calientes se marcan.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, OM = EX.orgMap, P = EX.palette, D = EX.story.surface;
  let heat = 0, heatT = 0, colored = [];
  const LEVEL = (cl) => ({ servers: 0.75, apps: 0.6, users: 0.5, cloud: 0.35, devices: 0.25, db: 0.3, networks: 0.2, identities: 0.45, remote: 0.3, workloads: 0.4, external: 0.7 }[cl] || 0.2);

  /* Halo de calor bajo cada región */
  Wd.layer('surface-heat', (ctx) => {
    heat += (heatT - heat) * 0.04;
    if (heat < 0.01) return;
    OM.clusters.forEach((cl, key) => {
      const lv = LEVEL(key);
      if (cl.def.ext && heatT === 0) return;
      const c = Wd.project(cl.def.x, cl.def.y);
      const r = Math.max(cl.def.sx, cl.def.sy) * 1.1 * Wd.cam.z;
      const col = lv > 0.6 ? P.red : lv > 0.45 ? P.orange : lv > 0.3 ? P.yellow : P.green;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
      g.addColorStop(0, U.rgba(col, 0.16 * heat * lv * 1.4));
      g.addColorStop(1, U.rgba(col, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI * 2); ctx.fill();
    }, true);
  }, false);

  K.scene('surface', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `<ul class="legend">${D.legend.map((l) => `<li><i style="background:${U.rgba(K.col(l.color), 1)}"></i>${l.label}</li>`).join('')}</ul>`;
    },
    enter(ctx) {
      K.base({ org: 'show', ext: true, labels: true, terrain: 0.8, caption: D.line });
      K.fly(0, 40, 0.3, 2600);
      heatT = 0;
      // Cada activo recibe un nivel según su contexto
      colored = OM.all().concat(Wd.tagged('orgx')).map((n) => {
        const lv = LEVEL(n.info.cluster.key) * Math.random() * 1.6;
        const col = lv > 0.8 ? P.red : lv > 0.55 ? P.orange : lv > 0.35 ? P.yellow : P.green;
        return { n, col, base: n.color };
      });
      ctx.tl.at(1600, () => { heatT = 1; colored.forEach((c, i) => setTimeout(() => { if (ctx.active) c.n.color = c.col; }, Math.random() * 1600)); });
    },
    step(ctx, n) {
      if (n >= 1) {
        D.hotspots.forEach((h, i) => {
          const cl = OM.clusters.get(h.cluster).def;
          ctx.annos.push(EX.anno.create({ target: { x: cl.x, y: cl.y }, dx: h.dx, dy: h.dy, color: K.col(h.level === 'Crítica' ? 'red' : 'orange'),
            html: `<span class="anno__k">Exposición ${h.level.toLowerCase()}</span><span class="anno__q">${h.label}</span>` }).show());
        });
        EX.hud.caption('Prioridad', 'Las zonas de mayor exposición, a la vista.');
      } else { ctx.annos.forEach((a) => a.remove()); ctx.annos = []; EX.hud.caption('', D.line); }
    },
    leave() { heatT = 0; colored.forEach((c) => { c.n.color = c.base; }); colored = []; },
  });
})();
