/* ==========================================================================
   ESCENA 26 — LA IA COMO CAPA DE INTELIGENCIA
   Cuatro capas apiladas en profundidad: automatización → agentes →
   contexto → IA. La IA aparece al final, encima del contexto construido,
   y sus verbos se encienden uno a uno.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.ai;
  let layers = [], lk = [0, 0, 0, 0], lt = [0, 0, 0, 0], t0 = 0;
  const COLORS = [P.asset, P.orange, P.cyan, P.violet];

  /* Capas isométricas (planos inclinados) dibujadas en el mundo */
  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  Wd.layer('ai-stack', (ctx, now) => {
    const c = ST.ai;
    let any = false;
    for (let i = 0; i < 4; i++) { lk[i] += (lt[i] - lk[i]) * 0.05; if (lk[i] > 0.01) any = true; }
    if (!any) return;
    const t = now / 1000;
    for (let i = 0; i < 4; i++) {
      const k = lk[i];
      if (k < 0.01) continue;
      const y = c.y + 330 - i * 220;
      const w = 620, d = 150;
      const pts = [[-w, 0], [0, -d], [w, 0], [0, d]].map(([x, yy]) => Wd.project(c.x + x * U.ease.out(k), y + yy * U.ease.out(k)));
      ctx.fillStyle = U.rgba(COLORS[i], 0.05 * k);
      ctx.strokeStyle = U.rgba(COLORS[i], (i === 3 ? 0.8 : 0.45) * k);
      ctx.lineWidth = i === 3 ? 1.4 : 1;
      ctx.beginPath();
      pts.forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Contenido de cada capa
      for (let j = 0; j < 40; j++) {
        const u = ((j * 37) % 40) / 40 - 0.5, v = ((j * 17) % 40) / 40 - 0.5;
        const px = c.x + (u - v) * w * 0.9 * k, py = y + (u + v) * d * 0.9 * k;
        const p = Wd.project(px, py);
        const fl = i === 0 ? Math.sin(t * 2 + j) * 0.5 + 0.5 : 1;
        ctx.fillStyle = U.rgba(COLORS[i], 0.7 * k * fl);
        if (i === 3) { ctx.fillRect(p.x - 1, p.y - 1, 2, 2); }
        else if (i === 1 && j % 8 === 0) { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); }
        else if (i === 2 && j % 3 === 0) {
          const q = Wd.project(px + 60, py + 14);
          ctx.strokeStyle = U.rgba(COLORS[i], 0.35 * k); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          ctx.fillRect(p.x - 1.2, p.y - 1.2, 2.4, 2.4);
        } else if (i === 0) ctx.fillRect(p.x - 0.8, p.y - 0.8, 1.6, 1.6);
      }
      // Flujo vertical entre capas
      if (i > 0 && k > 0.5) {
        for (let s = 0; s < 3; s++) {
          const f = ((t * 0.6 + s / 3) % 1);
          const p = Wd.project(c.x + (s - 1) * 120, y + 220 - f * 220);
          ctx.fillStyle = U.rgba(COLORS[i], 0.8 * Math.sin(f * Math.PI) * k);
          ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        }
      }
      const lp = Wd.project(c.x + w * k + 30, y);
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
      ctx.font = `500 ${i === 3 ? 13 : 11}px ${MONO}`;
      ctx.fillStyle = U.rgba(i === 3 ? P.violet : [215, 225, 242], k);
      ctx.fillText(`${U.pad(i + 1)} · ${D.layers[i].toUpperCase()}`, lp.x, lp.y);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }
  });

  K.scene('ai', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `<ul class="verbs">${D.verbs.map((v, i) => `<li style="--d:${(i * 0.18).toFixed(2)}s">${v}</li>`).join('')}</ul>`;
    },
    enter(ctx) {
      K.base({ org: 'hide' });
      lt = [0, 0, 0, 0];
      K.fly(ST.ai.x + 150, ST.ai.y + 20, 0.62, 2200);
      [0, 1, 2].forEach((i) => ctx.tl.at(900 + i * 700, () => { lt[i] = 1; }));
      ctx.tl.at(900, () => EX.hud.caption('', D.lines[0]));
    },
    step(ctx, n) {
      if (n >= 1) {
        lt = [1, 1, 1, 1];
        ctx.el.classList.add('is-ai');
        EX.hud.caption('IA', D.lines[1]);
      } else { lt[3] = 0; ctx.el.classList.remove('is-ai'); EX.hud.caption('', D.lines[0]); }
    },
    leave(ctx) { lt = [0, 0, 0, 0]; ctx.el.classList.remove('is-ai'); },
  });
})();
