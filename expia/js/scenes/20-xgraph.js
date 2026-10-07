/* ==========================================================================
   ESCENA 20 — EL GRAFO DE EXPOSICIÓN
   De vuelta en el mapa, sobre SRV-PS-014. El contexto que entregaron los
   agentes se vuelve grafo: CVE, software, usuario, privilegios, red,
   firewall, aplicación, control, exposición, amenaza. Luego la cámara se
   aleja y cada dimensión se conecta con el resto de la organización.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, OM = EX.orgMap, CG = EX.caseGraph, D = EX.story.xgraph;
  let nodes = {}, shown = 0, links = [];
  const CLUSTER = { software: 'apps', user: 'users', priv: 'users', net: 'networks', fw: 'networks', app: 'apps', control: 'servers', exposure: 'cloud', threat: 'devices', cve: 'servers' };

  function reveal(i) {
    const d = D.xg[i];
    const n = nodes[d.key];
    K.show(n, { e: n.e, ea: 0.6 });
    Wd.moveNode(n, n.dest.x, n.dest.y, 900, 0, U.ease.out);
    if (d.color === 'red') Wd.pulse(n, n.color, { r: 40, dur: 1100 });
    shown = i + 1;
  }

  K.scene('xgraph', {
    steps: 2,
    enter(ctx) {
      K.base({ org: 'dim', dim: 0.08, hero: true, terrain: 0.35 });
      const h = CG.hero();
      nodes = {};
      shown = 0;
      D.xg = D.nodes;
      D.nodes.forEach((d) => {
        const parent = d.from === 'hero' ? h : nodes[d.from];
        const n = K.node(ctx, {
          x: parent.home ? parent.home.x : parent.dest.x, y: parent.home ? parent.home.y : parent.dest.y,
          r: d.key === 'cve' ? 6 : 4.5, ring: true, color: d.color, label: d.label, sub: d.sub,
          labelSide: d.at[0] < -20 ? -1 : 1, interactive: true, hitR: 18,
          probe: K.probeHTML(d.kind, d.sub, [['Relación', d.from === 'hero' ? 'SRV-PS-014' : D.nodes.find((x) => x.key === d.from).label]]),
        });
        n.dest = { x: h.home.x + d.at[0], y: h.home.y + d.at[1] };
        n.e = K.edge(ctx, parent, n, { ta: 0, td: 0, draw: 0, color: d.color, width: 1 });
        nodes[d.key] = n;
      });
      K.fly(h.home.x + 40, h.home.y - 10, 2.0, 2400);
      EX.hud.caption('SRV-PS-014', D.lines[0]);
      D.nodes.forEach((_, i) => ctx.tl.at(1800 + i * 520, () => reveal(i)));
    },
    onNext(ctx) {
      if (ctx.step > 0 || shown >= D.nodes.length) return false;
      ctx.tl.clear();
      for (let i = shown; i < D.nodes.length; i++) reveal(i);
      return true;
    },
    step(ctx, n) {
      if (n >= 1) {
        ctx.tl.clear();
        for (let i = shown; i < D.nodes.length; i++) reveal(i);
        OM.reveal();
        OM.dim(() => true, 0.5, 0.5);
        OM.setLabels(1);
        Object.values(nodes).forEach((x) => { x.tla = 0; });
        // Cada dimensión se conecta con activos de su región
        Object.entries(nodes).forEach(([key, nd], i) => {
          const cl = OM.clusters.get(CLUSTER[key]);
          for (let k = 0; k < 5; k++) {
            const t = cl.nodes[(i * 13 + k * 29) % cl.nodes.length];
            const e = K.edge(ctx, nd, t, { ta: 0, td: 0, draw: 0, color: nd.color, width: 0.6, drawSpeed: 0.7 });
            ctx.tl.at(400 + i * 120 + k * 60, () => { e.ta = 0.35; e.td = 1; t.tglow = 0.6; links.push(t); });
          }
        });
        K.fly(0, 0, 0.34, 3400);
        EX.hud.caption('Grafo de exposición', D.lines[1]);
      } else {
        links.forEach((t) => { t.tglow = 0; });
        links = [];
      }
    },
    leave() { links.forEach((t) => { t.tglow = 0; }); links = []; },
  });
})();
