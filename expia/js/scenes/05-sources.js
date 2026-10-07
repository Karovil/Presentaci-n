/* ==========================================================================
   ESCENA 05 — DATOS FRAGMENTADOS
   La cámara se aleja del grafo de la CVE: cada relación vino de un sistema
   distinto. Aparecen doce "universos" de información alrededor de la
   organización. Cada uno emite sus señales… y ninguna cruza su frontera.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, K = EX.kit, CG = EX.caseGraph, D = EX.story.sources;
  const TINTS = ['asset', 'cyan', 'asset', 'violet', 'yellow', 'green', 'asset', 'cyan', 'violet', 'orange', 'asset', 'violet'];
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  // Las seis primeras fuentes son las que alimentaron el contexto de la escena 04
  const FIRST = ['cmdb', 'cortex', 'tenable', 'ad', 'cis', 'grc'];

  let uni = [];

  K.scene('sources', {
    steps: 2,
    enter(ctx) {
      K.base({ org: 'dim', dim: 0.1, hero: true, cve: true, terrain: 0.3 });
      const c = CG.cve();
      uni = D.list.map((s, i) => {
        const a = -Math.PI / 2 + (i / D.list.length) * Math.PI * 2;
        const x = Math.cos(a) * 2350, y = Math.sin(a) * 1420;
        const color = mix(P.asset, P[TINTS[i]], 0.45);
        const center = K.node(ctx, {
          x, y, r: 6, ring: true, color, interactive: true, hitR: 70,
          probe: K.probeHTML('Fuente de información', s.name, [['Señales', s.signals], ['Conexión', 'Ninguna con otras fuentes']]),
        });
        const parts = [];
        for (let k = 0; k < 30; k++) {
          const ang = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 130;
          parts.push(K.node(ctx, { x: x + Math.cos(ang) * rr, y: y + Math.sin(ang) * rr * 0.8, r: U.rand(1.3, 2.2), fixed: false, color }));
        }
        parts.forEach((n, k) => { if (k % 2 === 0) K.edge(ctx, n, parts[(k * 5 + 3) % parts.length], { ta: 0, color, width: 0.6 }); });
        const ring = K.ring(ctx, { x, y, r: 175, color, alpha: 0.4, label: s.name, labelColor: [220, 228, 244], on: false });
        // Señales que se mueven hacia dentro… y mueren en la frontera
        const toward = { x: x - Math.cos(a) * 175, y: y - Math.sin(a) * 175 * 0.8 };
        const st = K.stream(ctx, { from: center, to: toward, color, rate: 3, speed: 0.6, jitter: 160, on: false, size: 1.4 });
        return { s, center, parts, ring, st, link: null };
      });
      // Desde la CVE, una línea hacia cada fuente que aportó contexto
      FIRST.forEach((key, i) => {
        const u = uni.find((v) => v.s.key === key);
        u.link = K.edge(ctx, c, u.center, { ta: 0, td: 0, draw: 0, color: P.cyan, width: 1, dash: [3, 6], drawSpeed: 0.9 });
        ctx.tl.at(1200 + i * 280, () => { u.link.ta = 0.55; u.link.td = 1; K.show(u.center); });
      });
      // Primero cerca de la CVE; luego la cámara se aleja hasta ver todo
      Wd.flyTo({ x: c.x, y: c.y, z: 1.2 * K.F() }, 900);
      ctx.tl.at(900, () => K.fly(0, 0, 0.21, 4200, U.ease.inOut));
      ctx.tl.at(800, () => EX.hud.caption('CVE-2026-35273', 'Cada relación vino de un sistema distinto.'));
      ctx.tl.at(3600, () => FIRST.forEach((key) => { const u = uni.find((v) => v.s.key === key); u.ring.on = true; u.parts.forEach((n) => { n.ta = 0.9; }); }));
    },
    step(ctx, n) {
      if (n >= 1) {
        ctx.tl.clear();
        uni.forEach((u, i) => {
          ctx.tl.at(i * 110, () => {
            K.show(u.center);
            u.ring.on = true;
            u.parts.forEach((p) => { p.ta = 0.9; });
            Wd.edges.forEach((e) => { if (u.parts.includes(e.a)) e.ta = 0.25; });
            u.st.on = true;
            if (u.link) { u.link.ta = 0; }
          });
        });
        Wd.flyTo({ x: 0, y: 0, z: 0.21 * K.F() }, 1400);
        EX.hud.caption('', '');
        ctx.tl.at(900, () => EX.say(D.title, { sub: D.line, pos: 'center', size: 'm' }));
      } else {
        EX.say.clear();
        uni.forEach((u) => { u.st.on = false; if (u.link) u.link.ta = 0.55; });
        EX.hud.caption('CVE-2026-35273', 'Cada relación vino de un sistema distinto.');
      }
    },
  });
})();
