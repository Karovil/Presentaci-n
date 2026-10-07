/* ==========================================================================
   EXPIA · CASO
   El activo protagonista y su vulnerabilidad dentro del mapa.
   Las escenas 03 y 04 (y siguientes) los reutilizan.
   ========================================================================== */
EX.caseGraph = (() => {
  const Wd = EX.world, P = EX.palette, D = EX.org, OM = EX.orgMap;
  let heroNode = null, cveNode = null, cveEdge = null;

  /* Activo protagonista: un servidor del borde de la región, hacia el exterior */
  function hero() {
    OM.build();
    if (!heroNode) {
      const cl = OM.clusters.get(D.hero.cluster);
      const tx = cl.def.x + cl.def.sx * 0.55, ty = cl.def.y - cl.def.sy * 0.35;
      heroNode = cl.nodes.reduce((b, n) => ((n.home.x - tx) ** 2 + (n.home.y - ty) ** 2 < (b.home.x - tx) ** 2 + (b.home.y - ty) ** 2 ? n : b), cl.nodes[0]);
      heroNode.isHero = true;
    }
    return heroNode;
  }

  /* Vecinos directos del protagonista en el mapa */
  function neighbors() {
    const h = hero();
    const set = new Set([h]);
    Wd.edges.forEach((e) => { if (e.a === h) set.add(e.b); if (e.b === h) set.add(e.a); });
    return set;
  }

  function emphasizeHero(on) {
    const h = hero();
    h.ring = on;
    h.fixed = on;
    h.r = on ? 9 : 1.9;
    h.tglow = on ? 0.6 : 0;
    h.color = on ? P.server : P.server;
  }

  function cve() {
    const h = hero();
    if (!cveNode || !Wd.get('cve')) {
      cveNode = Wd.addNode({ id: 'cve', x: h.home.x + 46, y: h.home.y + 30, r: 7, fixed: true, ring: true, color: P.red, ta: 0, tags: ['cve'], interactive: false });
      cveEdge = Wd.addEdge(h, cveNode, { ta: 0, color: P.red, width: 1, tags: ['cve'], td: 0, draw: 0 });
    }
    return cveNode;
  }

  function showCve(on) {
    const c = cve();
    c.ta = on ? 1 : 0;
    c.tglow = on ? 1 : 0;
    cveEdge.ta = on ? 0.7 : 0;
    cveEdge.td = on ? 1 : 0;
  }

  return { hero, neighbors, emphasizeHero, cve, showCve };
})();
