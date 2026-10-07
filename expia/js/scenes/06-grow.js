/* ==========================================================================
   ESCENA 06 — LA SUPERFICIE CRECE
   Paso 1: la cámara se aleja y aparecen regiones nuevas (identidades,
           endpoints remotos, cargas cloud, servicios expuestos).
   Paso 2: un solo activo: siete dimensiones lo rodean.
   Paso 3: esas dimensiones existen en todo el mapa: un ecosistema.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, K = EX.kit, OM = EX.orgMap, CG = EX.caseGraph, D = EX.story.grow;
  let facets = [], eco = 0, ecoT = 0, marks = [], countEl;

  /* Marcas de dimensión alrededor de muchos activos */
  Wd.layer('grow-eco', (ctx, now) => {
    eco += (ecoT - eco) * 0.04;
    if (eco < 0.01 || !marks.length) return;
    const t = now / 1000;
    for (const m of marks) {
      if (m.n.alpha < 0.2) continue;
      const p = Wd.project(m.n.x, m.n.y);
      const a = t * m.sp + m.ph;
      const r = 5 + 2 * Math.sin(t + m.ph);
      ctx.fillStyle = U.rgba(m.c, 0.85 * eco);
      ctx.fillRect(p.x + Math.cos(a) * r - 1, p.y + Math.sin(a) * r - 1, 2, 2);
    }
  });

  K.scene('grow', {
    steps: 3,
    init(ctx) {
      ctx.el.innerHTML = `<div class="tally"><p class="tally__k">Superficie de ataque</p><p class="tally__n">2.847</p><p class="tally__u">${D.countLabel}</p></div>`;
      countEl = ctx.el.querySelector('.tally__n');
    },
    enter(ctx) {
      K.base({ org: 'show', labels: true, terrain: 1, caption: D.lines[0] });
      ecoT = 0;
      K.fly(0, 0, 0.5, 1600);
      ctx.tl.at(1400, () => {
        OM.showExt(true);
        K.fly(0, 20, 0.33, 3600);
        countEl.dataset.v = 2847;
        U.countTo(countEl, D.count, { duration: 3200 });
      });
      // Siete dimensiones del activo protagonista
      const h = CG.hero();
      facets = D.facets.map((f, i) => {
        const a = -Math.PI / 2 + (i / D.facets.length) * Math.PI * 2;
        const n = K.node(ctx, {
          x: h.home.x + Math.cos(a) * 62, y: h.home.y + Math.sin(a) * 50, r: 3.5, ring: true,
          color: f.color, label: f.label, labelSide: Math.cos(a) < -0.1 ? -1 : 1, labelSize: 9,
        });
        n.e = K.edge(ctx, h, n, { ta: 0, td: 0, draw: 0, color: f.color, width: 0.8 });
        return n;
      });
      // Marcas del ecosistema (se calculan una vez)
      const pool = OM.all().concat(Wd.tagged('orgx'));
      marks = [];
      for (let i = 0; i < 900; i++) {
        const n = pool[(Math.random() * pool.length) | 0];
        marks.push({ n, c: K.col(U.pick(D.facets).color), sp: U.rand(0.3, 0.9) * (Math.random() < 0.5 ? -1 : 1), ph: Math.random() * 6.28 });
      }
    },
    step(ctx, n) {
      const h = CG.hero();
      ecoT = n >= 2 ? 1 : 0;
      CG.emphasizeHero(n === 1);
      if (n === 1) {
        ctx.el.classList.add('is-hidden-tally');
        Wd.flyTo({ x: h.home.x + 10, y: h.home.y, z: 3.4 * K.F() }, 2600);
        facets.forEach((f, i) => ctx.tl.at(1800 + i * 200, () => K.show(f, { e: f.e, ea: 0.6 })));
        EX.hud.caption('SRV-PS-014', D.lines[1]);
      } else {
        facets.forEach((f) => { f.ta = 0; f.tla = 0; f.e.ta = 0; });
        ctx.el.classList.toggle('is-hidden-tally', n === 2);
        K.fly(0, 40, n === 2 ? 0.5 : 0.33, 2400);
        EX.hud.caption('', n === 2 ? D.lines[2] : D.lines[0]);
      }
    },
    leave() { ecoT = 0; },
  });
})();
