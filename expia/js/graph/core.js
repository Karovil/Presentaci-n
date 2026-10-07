/* ==========================================================================
   EXPIA · NÚCLEO
   El orquestador como presencia física en el mundo: anillos que giran a
   distintas velocidades, marca EXPIA y un estado (recibiendo, pensando…).
   Expone `node` para conectar flujos y aristas.
   ========================================================================== */
EX.core = (() => {
  const U = EX.u, Wd = EX.world, P = EX.palette;
  const node = Wd.addNode({ id: 'core', x: 0, y: 0, r: 0.1, fixed: true, hidden: true, ta: 0, tags: ['core'] });
  let k = 0, target = 0, sub = '', scale = 1, busy = 0, busyT = 0, flash = 0;
  const R = 62;   // radio en unidades del mundo

  function show(x, y, s = 'Orquestador', sc = 1) {
    if (target === 0 || Math.hypot(node.x - x, node.y - y) > 1) { node.x = x; node.y = y; }
    node.ta = 1;
    target = 1;
    sub = s || '';
    scale = sc;
  }
  function hide() { target = 0; node.ta = 0; }
  function setSub(s) { sub = s; }
  function think(on) { busyT = on ? 1 : 0; }
  function receive() { flash = 1; }

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  Wd.layer('core-draw', (ctx, now) => {
    k += (target - k) * 0.06;
    busy += (busyT - busy) * 0.05;
    flash *= 0.94;
    node.alpha = Math.max(node.alpha, k);
    if (k < 0.01) return;
    const p = Wd.project(node.x, node.y);
    const r = R * scale * Wd.cam.z;
    if (r < 1) return;
    const t = now / 1000;

    // Halo
    const g = ctx.createRadialGradient(p.x, p.y, r * 0.2, p.x, p.y, r * 3);
    g.addColorStop(0, U.rgba(P.cyan, (0.16 + flash * 0.25) * k));
    g.addColorStop(1, U.rgba(P.cyan, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
    ctx.fill();

    // Disco
    ctx.fillStyle = `rgba(6,9,16,${0.92 * k})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = U.rgba(P.cyan, 0.65 * k);
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Anillos en rotación (más rápidos cuando piensa)
    const sp = 1 + busy * 3;
    [[1.28, 0.35, 1.6, 0.5], [1.5, -0.22, 0.9, 0.3], [1.78, 0.12, 2.6, 0.18]].forEach(([rr, w, len, a], i) => {
      const a0 = t * w * sp + i;
      ctx.strokeStyle = U.rgba(i === 1 ? P.violet : P.cyan, a * k);
      ctx.lineWidth = i === 0 ? 1.4 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * rr, a0, a0 + len);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * rr, a0 + Math.PI, a0 + Math.PI + len * 0.4);
      ctx.stroke();
    });
    // Marcas
    ctx.strokeStyle = U.rgba([200, 212, 236], 0.35 * k);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2 + t * 0.05;
      const r1 = r * 2.02, r2 = r * (i % 6 === 0 ? 2.14 : 2.07);
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1);
      ctx.lineTo(p.x + Math.cos(a) * r2, p.y + Math.sin(a) * r2);
      ctx.stroke();
    }

    // Marca
    const fs = U.clamp(r * 0.36, 10, 34);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${Math.round(fs * 0.18)}px`;
    ctx.font = `600 ${fs}px "Space Grotesk", system-ui, sans-serif`;
    ctx.fillStyle = `rgba(236,241,250,${k})`;
    ctx.fillText('EXP', p.x - fs * 0.62, p.y - (sub ? fs * 0.18 : 0));
    ctx.fillStyle = U.rgba(P.cyan, k);
    ctx.fillText('IA', p.x + fs * 1.08, p.y - (sub ? fs * 0.18 : 0));
    if (sub) {
      if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
      ctx.font = `400 ${U.clamp(fs * 0.3, 8, 11)}px ${MONO}`;
      ctx.fillStyle = `rgba(150,165,195,${k})`;
      ctx.fillText(sub.toUpperCase(), p.x, p.y + fs * 0.75);
    }
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  });

  return { node, show, hide, setSub, think, receive, get visible() { return target > 0; }, R };
})();
