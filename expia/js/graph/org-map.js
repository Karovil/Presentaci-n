/* ==========================================================================
   EXPIA · MAPA DE LA ORGANIZACIÓN
   Genera (siempre igual, con semilla) los activos de la organización como
   regiones de un mapa, sus dependencias y el "terreno" que los rodea.
   ========================================================================== */
EX.orgMap = (() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, D = EX.org;
  let built = false;
  const clusters = new Map();   // key → { def, nodes, hub }
  let terrain = 0, terrainTarget = 0, labelsTarget = 0, labels = 0;
  let focusCluster = null;
  let extOn = 0, extTarget = 0;   // regiones ampliadas (escena 06 en adelante)

  function build() {
    if (built) return;
    built = true;
    const rnd = U.seeded(2047);
    const g = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;

    D.clusters.concat(D.extClusters || []).forEach((c) => {
      const tag = c.ext ? 'orgx' : 'org';
      const list = [];
      // Sub-agrupaciones: una región tiene barrios
      const subs = Array.from({ length: 3 + ((rnd() * 3) | 0) }, () => ({ x: c.x + g() * c.sx * 0.6, y: c.y + g() * c.sy * 0.6 }));
      for (let i = 0; i < c.count; i++) {
        const s = subs[i % subs.length];
        const n = Wd.addNode({
          id: `${c.key}-${i}`,
          x: s.x + g() * c.sx * 0.55,
          y: s.y + g() * c.sy * 0.55,
          r: c.key === 'servers' ? 1.9 : 1.5 + rnd() * 0.5,
          color: P[c.color || 'asset'],
          tags: [tag, tag + '-' + c.key],
          ta: 0,
          interactive: true,
          info: { cluster: c, idx: i },
        });
        n.home = { x: n.x, y: n.y };
        list.push(n);
      }
      // Dependencias locales: cada activo con sus vecinos más cercanos
      list.forEach((n) => {
        const near = list
          .map((m) => ({ m, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
          .sort((a, b) => a.d - b.d)
          .slice(1, rnd() < 0.3 ? 3 : 2);
        near.forEach(({ m }) => Wd.addEdge(n, m, { ta: 0, tags: [tag], base: 0.24, color: [140, 165, 215] }));
      });
      // El "centro" de la región: el nodo más cercano al centroide
      const hub = list.reduce((b, n) => ((n.x - c.x) ** 2 + (n.y - c.y) ** 2 < (b.x - c.x) ** 2 + (b.y - c.y) ** 2 ? n : b), list[0]);
      clusters.set(c.key, { def: c, nodes: list, hub, rings: makeRings(c, rnd) });
    });

    // Puentes entre regiones: pocas líneas largas, curvas, discontinuas
    D.bridges.forEach(([a, b]) => {
      const A = clusters.get(a), B = clusters.get(b);
      for (let k = 0; k < 3; k++) {
        const na = A.nodes[(rnd() * A.nodes.length) | 0], nb = B.nodes[(rnd() * B.nodes.length) | 0];
        Wd.addEdge(na, nb, { ta: 0, tags: ['org', 'bridge'], base: 0.16, color: [150, 140, 235], dash: [2, 6], curve: 0.12 * (k - 1) });
      }
    });

    Wd.layer('terrain', drawTerrain, false);
    Wd.layer('cluster-labels', drawClusterLabels, true);
  }

  /* Curvas de nivel alrededor de cada región (densidad = relieve) */
  function makeRings(c, rnd) {
    return [0.55, 0.85, 1.15, 1.5].map((k, i) => ({
      k,
      ph: rnd() * 6.28,
      amp: 0.06 + rnd() * 0.06,
      fr: 3 + ((rnd() * 3) | 0),
      i,
    }));
  }

  function drawTerrain(ctx, now) {
    terrain += (terrainTarget - terrain) * 0.04;
    extOn += (extTarget - extOn) * 0.04;
    if (terrain < 0.01) return;
    const z = Wd.cam.z;
    // Retícula geográfica del mundo (se mueve y escala con la cámara)
    const step = z > 1.6 ? 100 : 250;
    const { W, H } = Wd.size;
    const tl = Wd.unproject(0, 0), br = Wd.unproject(W, H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(120,140,190,${0.05 * terrain})`;
    ctx.beginPath();
    for (let x = Math.floor(tl.x / step) * step; x < br.x; x += step) { const p = Wd.project(x, 0); ctx.moveTo(p.x, 0); ctx.lineTo(p.x, H); }
    for (let y = Math.floor(tl.y / step) * step; y < br.y; y += step) { const p = Wd.project(0, y); ctx.moveTo(0, p.y); ctx.lineTo(W, p.y); }
    ctx.stroke();
    // Marcas de cruce en la retícula
    ctx.fillStyle = `rgba(150,170,215,${0.18 * terrain})`;
    for (let x = Math.floor(tl.x / step) * step; x < br.x; x += step) {
      for (let y = Math.floor(tl.y / step) * step; y < br.y; y += step) {
        const p = Wd.project(x, y);
        ctx.fillRect(p.x - 2, p.y - 0.5, 4, 1);
        ctx.fillRect(p.x - 0.5, p.y - 2, 1, 4);
      }
    }
    // Curvas de nivel
    clusters.forEach((cl) => {
      const c = cl.def;
      const dim = (focusCluster && focusCluster !== c.key ? 0.4 : 1) * (c.ext ? extOn : 1);
      if (dim < 0.01) return;
      cl.rings.forEach((rg) => {
        ctx.strokeStyle = `rgba(130,150,210,${(0.11 - rg.i * 0.02) * terrain * dim})`;
        ctx.setLineDash(rg.i === 3 ? [1, 5] : []);
        ctx.beginPath();
        for (let s = 0; s <= 72; s++) {
          const a = (s / 72) * Math.PI * 2;
          const w = 1 + rg.amp * Math.sin(a * rg.fr + rg.ph + now / 9000) + rg.amp * 0.5 * Math.cos(a * (rg.fr + 2) - rg.ph);
          const p = Wd.project(c.x + Math.cos(a) * c.sx * rg.k * w, c.y + Math.sin(a) * c.sy * rg.k * w);
          s ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
        }
        ctx.stroke();
      });
    });
    ctx.setLineDash([]);
  }

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  function drawClusterLabels(ctx) {
    labels += (labelsTarget - labels) * 0.06;
    if (labels < 0.01) return;
    clusters.forEach((cl) => {
      const c = cl.def;
      const p = Wd.project(c.x, c.y - c.sy * 1.22);
      const on = focusCluster === c.key;
      const a = labels * (focusCluster && !on ? 0.35 : 1) * (c.ext ? extOn : 1);
      if (a < 0.01) return;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
      ctx.font = `500 10px ${MONO}`;
      ctx.fillStyle = on ? `rgba(94,226,255,${a})` : `rgba(200,210,232,${0.85 * a})`;
      ctx.fillText(c.label.toUpperCase(), p.x, p.y);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
      ctx.font = `300 10px ${MONO}`;
      ctx.fillStyle = `rgba(130,145,175,${a})`;
      ctx.fillText(U.fmt(c.real), p.x, p.y + 15);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      // Marca de región
      ctx.strokeStyle = on ? `rgba(94,226,255,${0.7 * a})` : `rgba(200,210,232,${0.3 * a})`;
      ctx.beginPath();
      ctx.moveTo(p.x - 16, p.y + 23);
      ctx.lineTo(p.x + 16, p.y + 23);
      ctx.stroke();
    });
  }

  /* ---------- API para las escenas ---------- */
  function reveal({ from = null, stagger = 1400, alpha = 1, edges = 1 } = {}) {
    build();
    Wd.tagged('org').forEach((n) => {
      n.ta = alpha;
      n.tla = 0;
      n.color = P[n.info.cluster.color || 'asset'];
      if (from) {
        // Los activos "brotan" desde un punto hacia su lugar en el mapa
        n.x = from.x + U.gauss() * 20;
        n.y = from.y + U.gauss() * 20;
        Wd.moveNode(n, n.home.x, n.home.y, 2200 + Math.random() * 900, Math.random() * stagger, U.ease.expoOut);
      } else if (!n.move) {
        n.x = n.home.x; n.y = n.home.y;
      }
    });
    Wd.edges.forEach((e) => { if (e.tags.includes('org')) { e.ta = e.base * edges; } });
  }

  function hide() {
    if (!built) return;
    showExt(false);
    Wd.tagged('org').forEach((n) => { n.ta = 0; });
    Wd.edges.forEach((e) => { if (e.tags.includes('org')) e.ta = 0; });
  }

  /* Atenúa todo salvo una selección */
  function dim(keep = () => false, level = 0.1, edgeLevel = 0.15) {
    Wd.tagged('org').forEach((n) => { n.ta = keep(n) ? 1 : level; });
    Wd.edges.forEach((e) => { if (e.tags.includes('org')) e.ta = e.base * (keep(e.a) && keep(e.b) ? 1.6 : edgeLevel); });
  }

  /* Regiones ampliadas: identidades, endpoints remotos, cargas cloud */
  function showExt(on) {
    build();
    extTarget = on ? 1 : 0;
    Wd.tagged('orgx').forEach((n) => { n.ta = on ? 1 : 0; if (on && !n.move) { n.x = n.home.x; n.y = n.home.y; } });
    Wd.edges.forEach((e) => { if (e.tags.includes('orgx')) e.ta = on ? e.base : 0; });
  }

  /* Todos los activos visibles (incluye regiones ampliadas si están activas) */
  const all = () => Wd.nodes.filter((n) => n.home && (n.tags.includes('org') || (extTarget && n.tags.includes('orgx'))));

  return {
    build, reveal, hide, dim, showExt, all,
    clusters,
    setTerrain: (v) => { terrainTarget = v; },
    setLabels: (v) => { labelsTarget = v; },
    focus: (k) => { focusCluster = k; },
    get focused() { return focusCluster; },
  };
})();
