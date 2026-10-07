/* ==========================================================================
   ESCENA 15 — AGORA
   La investigación cambia de dominio: postura. AGORA dibuja el perfil del
   activo en seis ejes y abre sus hallazgos.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, TM = EX.team, A = EX.agents, P = EX.palette, D = EX.story.agora;
  let facets = [], radar = 0, radarT = 0, packet = null;

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  Wd.layer('agora-radar', (ctx) => {
    radar += (radarT - radar) * 0.05;
    if (radar < 0.01) return;
    const a = A.get('agora');
    if (!a) return;
    const c = Wd.project(a.n.x - 40, a.n.y + 280);
    const R = 120 * Wd.cam.z;
    const n = D.axes.length;
    ctx.lineWidth = 1;
    for (let ring = 1; ring <= 4; ring++) {
      ctx.strokeStyle = `rgba(150,170,215,${0.12 * radar})`;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const x = c.x + Math.cos(ang) * R * ring / 4, y = c.y + Math.sin(ang) * R * ring / 4;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = U.rgba(P.cyan, 0.12 * radar);
    ctx.strokeStyle = U.rgba(P.cyan, 0.85 * radar);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const v = D.values[i % n] * U.ease.out(radar);
      const x = c.x + Math.cos(ang) * R * v, y = c.y + Math.sin(ang) * R * v;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.fill(); ctx.stroke();
    ctx.font = `400 9px ${MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
    ctx.fillStyle = `rgba(190,202,225,${radar})`;
    D.axes.forEach((ax, i) => {
      const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
      ctx.textAlign = Math.abs(Math.cos(ang)) < 0.2 ? 'center' : Math.cos(ang) > 0 ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(ax.toUpperCase(), c.x + Math.cos(ang) * (R + 14), c.y + Math.sin(ang) * (R + 14));
    });
    ctx.textAlign = 'center';
    ctx.fillStyle = U.rgba(P.cyan, radar);
    ctx.fillText('POSTURA 62 / 100', c.x, c.y + R + 34);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  });

  K.scene('agora', {
    steps: 2,
    enter(ctx) {
      TM.stage(ctx, TM.CORE3);
      A.set('argus', 'on'); A.set('aegis', 'dim');
      const a = A.get('agora');
      const p = TM.pos('agora');
      K.fly(p.x + 150, p.y + 60, 1.08, 2400);
      EX.hud.caption('AGORA', 'Postura de seguridad');
      K.msg(ctx, EX.core.node, a.n, D.task, { delay: 1200, color: 'cyan', onArrive: () => { A.set('agora', 'work', 'Evaluando ' + D.task); radarT = 1; } });
      facets = TM.facets(ctx, 'agora', D.facets, { delay: 3000, gap: 420, r: 250, spread: 1.6 });
      packet = null;
    },
    step(ctx, n) {
      if (n >= 1 && !packet) {
        ctx.tl.clear();
        radarT = 0;
        facets.forEach((f) => { f.ta = 1; f.x = f.dest.x; f.y = f.dest.y; });
        packet = TM.fold(ctx, facets, 'agora', D.out);
        A.set('agora', 'on', D.out);
        K.fly(TM.pos('agora').x - 60, TM.pos('agora').y + 60, 1.1, 1800);
        EX.say(D.note, { pos: 'low', size: 's' });
      }
    },
    leave() { radarT = 0; },
  });
})();
