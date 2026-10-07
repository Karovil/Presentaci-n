/* ==========================================================================
   ESCENA 35 — EL CICLO MULTI-AGENTE
   Un anillo vivo alrededor del núcleo: orquestar, investigar, delegar,
   correlacionar, construir contexto, explicar, priorizar, decidir… y otra vez.
   Nuevas señales entran al ciclo desde fuera.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.loop;
  let on = 0, onT = 0, head = 0, inputs = [];
  const R = 360;

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  Wd.layer('loop-ring', (ctx, now) => {
    on += (onT - on) * 0.05;
    if (on < 0.01) return;
    const c = Wd.project(ST.core.x, ST.core.y);
    const r = R * Wd.cam.z;
    const n = D.steps.length;
    head = (head + 0.0028) % 1;
    // Anillo
    ctx.strokeStyle = U.rgba(P.cyan, 0.18 * on);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(c.x, c.y, r * 1.35, r, 0, 0, Math.PI * 2); ctx.stroke();
    // Cometa que recorre el ciclo
    for (let k = 0; k < 40; k++) {
      const t = head - k * 0.004;
      const a = -Math.PI / 2 + t * Math.PI * 2;
      ctx.fillStyle = U.rgba(P.cyan, (1 - k / 40) * 0.9 * on);
      ctx.beginPath(); ctx.arc(c.x + Math.cos(a) * r * 1.35, c.y + Math.sin(a) * r, 2.6 * (1 - k / 50), 0, Math.PI * 2); ctx.fill();
    }
    // Pasos
    D.steps.forEach((s, i) => {
      const f = i / n;
      const a = -Math.PI / 2 + f * Math.PI * 2;
      const x = c.x + Math.cos(a) * r * 1.35, y = c.y + Math.sin(a) * r;
      const d = Math.min(Math.abs(head - f), 1 - Math.abs(head - f));
      const lit = Math.max(0, 1 - d * 14);
      const col = s === 'IA' || s === 'Explicar' ? P.violet : s === 'Analista' || s === 'Decidir' ? [235, 240, 250] : P.cyan;
      ctx.fillStyle = 'rgba(6,9,16,0.95)';
      ctx.strokeStyle = U.rgba(col, (0.5 + lit * 0.5) * on);
      ctx.beginPath(); ctx.arc(x, y, 6 + lit * 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = U.rgba(col, (0.6 + lit * 0.4) * on);
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = Math.cos(a) > 0.2 ? 'left' : Math.cos(a) < -0.2 ? 'right' : 'center';
      ctx.textBaseline = 'middle';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
      ctx.font = `500 ${10 + lit * 2}px ${MONO}`;
      ctx.fillStyle = U.rgba([220, 228, 244], (0.6 + lit * 0.4) * on);
      const ox = Math.cos(a) * 22, oy = Math.sin(a) * 22;
      ctx.fillText(s.toUpperCase(), x + ox, y + oy);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    });
    // Entradas externas que se suman al ciclo
    inputs = inputs.filter((p) => now - p.t0 < 2600);
    inputs.forEach((p) => {
      const k = (now - p.t0) / 2600;
      const a = p.a;
      const x0 = c.x + Math.cos(a) * r * 2.4, y0 = c.y + Math.sin(a) * r * 1.8;
      const x1 = c.x + Math.cos(a) * r * 1.35, y1 = c.y + Math.sin(a) * r;
      const e = U.ease.inOut(Math.min(1, k * 1.3));
      const x = U.lerp(x0, x1, e), y = U.lerp(y0, y1, e);
      const al = Math.sin(Math.min(1, k) * Math.PI) * on;
      ctx.fillStyle = U.rgba(p.c, al);
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.font = `400 10px ${MONO}`;
      ctx.textAlign = 'center';
      ctx.fillStyle = U.rgba(p.c, al * 0.9);
      ctx.fillText(p.label.toUpperCase(), x, y - 14);
    });
    if (onT && Math.random() < 0.012) inputs.push({ a: Math.random() * Math.PI * 2, t0: now, label: U.pick(D.inputs), c: U.pick([P.orange, P.yellow, P.red, P.violet]) });
  });

  K.scene('loop', {
    enter(ctx) {
      K.base({ org: 'hide', core: { x: ST.core.x, y: ST.core.y, sub: 'Orquestar' } });
      K.fly(ST.core.x, ST.core.y + 20, 0.82, 2200);
      onT = 0;
      ctx.tl.at(900, () => { onT = 1; });
      EX.core.think(true);
      ctx.tl.at(1500, () => EX.hud.caption('Ciclo de inteligencia', D.line));
    },
    leave() { onT = 0; EX.core.think(false); },
  });
})();
