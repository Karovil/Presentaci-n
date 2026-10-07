/* ==========================================================================
   EXPIA · MOTOR DE AUTOMATIZACIÓN
   Nueve compuertas sobre un mismo flujo. Cada señal que atraviesa una
   compuerta cambia: se descarta, se normaliza, se asigna a un activo, se
   enriquece, se relaciona, se valida, se fusiona y termina formando
   contexto. Lo usan las escenas 10 y 11 (y vuelve en la 36).
   ========================================================================== */
EX.pipeline = (() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, ST = EX.stations, T = EX.story.engine;
  const N = T.stages.length;
  const LEN = 2600, H = 300, LANES = 7;
  let on = 0, onT = 0, gatesShown = 0, parts = [], spawnRate = 0, highlight = -1;
  const gates = T.stages.map((label, i) => ({ label, i, act: 0, k: 0 }));
  const stats = { in: 0, out: 0, dropped: 0, merged: 0 };
  const contexts = Array.from({ length: LANES }, () => ({ mass: 0 }));
  const SRC_COL = [P.orange, P.yellow, P.violet, P.cyan, P.red, P.asset];

  const X0 = () => ST.pipeline.x - LEN / 2;
  const gx = (i) => X0() + ((i + 0.5) / N) * LEN * 0.92;
  const laneY = (l) => ST.pipeline.y + (l - (LANES - 1) / 2) * (H * 2 / (LANES - 1)) * 0.8;
  const endX = () => X0() + LEN * 1.0;

  function spawn() {
    const src = (Math.random() * 6) | 0;
    parts.push({
      x: X0() - 160 - Math.random() * 60,
      y: ST.pipeline.y + (src - 2.5) * 95 + U.gauss() * 40,
      c: SRC_COL[src], c0: SRC_COL[src], s: U.rand(1.2, 2.6),
      sp: U.rand(230, 300), gate: -1, lane: (Math.random() * LANES) | 0,
      drop: Math.random() < 0.32, dup: Math.random() < 0.22, bad: Math.random() < 0.05,
      enriched: false, dead: 0, ph: Math.random() * 6.28,
    });
    stats.in++;
  }

  function cross(p, g) {
    gates[g].act = 1;
    switch (g) {
      case 1: if (p.drop) { p.dead = 0.001; stats.dropped++; } break;
      case 2: p.c = [200, 212, 236]; p.s = 1.8; break;
      case 3: p.ty = laneY(p.lane); break;
      case 4: p.enriched = true; break;
      case 6: p.c = p.bad ? P.red : P.green; if (p.bad) { p.dead = 0.001; stats.dropped++; } break;
      case 7: if (p.dup) { p.dead = 0.001; p.merge = true; stats.merged++; } p.c = [200, 222, 245]; break;
      case 8: p.toCtx = true; break;
    }
  }

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  Wd.layer('pipeline', (ctx, now) => {
    on += (onT - on) * 0.05;
    if (on < 0.01) return;
    const dt = 1 / 60, t = now / 1000;
    if (onT && Math.random() < spawnRate * dt) spawn();
    if (onT && spawnRate > 30 && Math.random() < 0.5) spawn();

    // Canal
    const a0 = Wd.project(X0() - 220, ST.pipeline.y - H), a1 = Wd.project(endX() + 160, ST.pipeline.y + H);
    ctx.strokeStyle = `rgba(150,170,215,${0.12 * on})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 6]);
    ctx.strokeRect(a0.x, a0.y, a1.x - a0.x, a1.y - a0.y);
    ctx.setLineDash([]);

    // Carriles (aparecen desde "emparejar")
    if (gatesShown > 3) {
      for (let l = 0; l < LANES; l++) {
        const A = Wd.project(gx(3), laneY(l)), B = Wd.project(gx(8), laneY(l));
        ctx.strokeStyle = `rgba(94,226,255,${0.07 * on})`;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      }
    }

    // Compuertas
    gates.forEach((g, i) => {
      g.k += ((i < gatesShown ? 1 : 0) - g.k) * 0.08;
      g.act *= 0.9;
      if (g.k < 0.01) return;
      const top = Wd.project(gx(i), ST.pipeline.y - H + 20), bot = Wd.project(gx(i), ST.pipeline.y + H - 20);
      const hl = highlight === i ? 1 : 0;
      const a = (0.25 + g.act * 0.6 + hl * 0.5) * g.k * on;
      ctx.strokeStyle = U.rgba(hl ? P.cyan : [190, 205, 235], Math.min(1, a));
      ctx.lineWidth = hl ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(top.x, U.lerp(bot.y, top.y, U.ease.out(g.k)));
      ctx.lineTo(bot.x, bot.y);
      ctx.stroke();
      // Marcas de compuerta
      for (let m = 0; m < 9; m++) {
        const y = U.lerp(top.y, bot.y, m / 8);
        ctx.fillStyle = U.rgba(P.cyan, (0.15 + g.act * 0.6) * g.k * on);
        ctx.fillRect(top.x - 3, y - 0.5, 6, 1);
      }
      // Etiquetas alternadas arriba / abajo para que no se encimen
      const up = i % 2 === 0;
      ctx.textAlign = 'center';
      ctx.textBaseline = up ? 'bottom' : 'top';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
      ctx.font = `400 9.5px ${MONO}`;
      ctx.fillStyle = U.rgba(P.cyan, (0.6 + hl * 0.4) * g.k * on);
      ctx.fillText(U.pad(i + 1), top.x, up ? top.y - 24 : bot.y + 8);
      ctx.font = `500 10.5px ${MONO}`;
      ctx.fillStyle = `rgba(226,232,244,${(0.75 + hl * 0.25) * g.k * on})`;
      ctx.fillText(g.label.toUpperCase(), top.x, up ? top.y - 8 : bot.y + 24);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    });

    // Partículas
    const links = [];
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (p.dead) {
        p.dead += dt * 1.6;
        if (p.merge) p.y += ((p.ty ?? p.y) - p.y) * 0.1; else p.y += dt * 60;
        if (p.dead > 1) { parts.splice(i, 1); continue; }
      }
      p.x += p.sp * dt;
      // ¿Cruzó la siguiente compuerta?
      const ng = p.gate + 1;
      if (ng < N && ng < gatesShown && p.x >= gx(ng)) { p.gate = ng; cross(p, ng); }
      if (ng < N && ng >= gatesShown && p.x >= gx(ng) - 4) { p.x = gx(ng) - 4 - Math.random() * 30; }   // espera a que exista la compuerta
      if (p.gate >= 2 && p.gate < 3) p.y += ((ST.pipeline.y + (p.y - ST.pipeline.y) * 0.6) - p.y) * 0.03;
      if (p.ty !== undefined && !p.toCtx) p.y += (p.ty - p.y) * 0.06;
      if (p.toCtx) {
        const tx = endX(), ty = laneY(p.lane);
        p.y += (ty - p.y) * 0.08;
        if (p.x >= tx) { parts.splice(i, 1); contexts[p.lane].mass = Math.min(1, contexts[p.lane].mass + 0.012); stats.out++; continue; }
      }
      const q = Wd.project(p.x, p.y);
      const a = (1 - (p.dead || 0)) * on;
      ctx.fillStyle = U.rgba(p.c, 0.9 * a);
      ctx.beginPath();
      ctx.arc(q.x, q.y, p.s, 0, Math.PI * 2);
      ctx.fill();
      if (p.enriched && !p.dead) {
        const ang = t * 3 + p.ph;
        ctx.fillStyle = U.rgba(P.cyan, 0.85 * a);
        ctx.fillRect(q.x + Math.cos(ang) * 5 - 1, q.y + Math.sin(ang) * 5 - 1, 2, 2);
      }
      if (p.gate >= 5 && !p.dead) links.push(q);
    }
    // Correlacionar: enlaces entre señales cercanas
    ctx.strokeStyle = U.rgba(P.cyan, 0.22 * on);
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let i = 0; i < links.length; i++) {
      for (let j = i + 1; j < Math.min(links.length, i + 6); j++) {
        const A = links[i], B = links[j];
        if (Math.abs(A.x - B.x) < 40 && Math.abs(A.y - B.y) < 28) { ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); }
      }
    }
    ctx.stroke();

    // Contexto: un pequeño grafo por carril que crece
    if (gatesShown >= N) {
      contexts.forEach((c, l) => {
        const p = Wd.project(endX() + 60, laneY(l));
        const m = 0.25 + c.mass * 0.75;
        ctx.strokeStyle = U.rgba(P.cyan, 0.6 * on * m);
        ctx.fillStyle = 'rgba(6,9,16,0.9)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 7 + c.mass * 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        for (let k = 0; k < 5; k++) {
          const ang = (k / 5) * Math.PI * 2 + t * 0.4 + l;
          const r = 16 + c.mass * 8;
          const x = p.x + Math.cos(ang) * r, y = p.y + Math.sin(ang) * r;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(x, y); ctx.stroke();
          ctx.fillStyle = U.rgba(P.cyan, 0.8 * on * m);
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
          ctx.fillStyle = 'rgba(6,9,16,0.9)';
        }
      });
    }
  });

  return {
    gx, LEN, H, stats,
    show(rate = 22) { onT = 1; spawnRate = rate; },
    hide() { onT = 0; },
    gates(n) { gatesShown = n; },
    get gatesShown() { return gatesShown; },
    rate(r) { spawnRate = r; },
    highlight(i) { highlight = i; },
    reset() { parts = []; contexts.forEach((c) => { c.mass = 0; }); Object.keys(stats).forEach((k) => { stats[k] = 0; }); gatesShown = 0; highlight = -1; },
  };
})();
