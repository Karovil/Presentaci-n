/* ==========================================================================
   EXPIA · AGENTES
   Especialistas con presencia propia: un hexágono que respira, satélites
   que orbitan según su dominio y un estado visible:
   idle (en espera) · on (convocado) · work (investigando) · dim (no requerido)
   Hover: qué investiga. Clic: qué está investigando ahora.
   ========================================================================== */
EX.agents = (() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, D = EX.story.agents;
  const defs = Object.fromEntries([...D.core, ...D.more].map((d) => [d.id, d]));
  const live = new Map();
  const R = 30;   // radio en unidades del mundo

  function spawn(id, x, y, { size = 1, state = 'idle', task = '' } = {}) {
    let a = live.get(id);
    const d = defs[id];
    if (!a) {
      const n = Wd.addNode({
        id: 'agent-' + id, x, y, r: 0.1, fixed: true, hidden: true, ta: 1, tags: ['agents'],
        interactive: true, hitR: 34,
        probe: () => EX.kit.probeHTML('Agente · ' + d.domain, d.name, [['Investiga', d.desc]]),
        onClick: () => peek(id),
      });
      a = { id, d, n, k: 0, tk: 1, state, size, task, color: EX.kit.col(d.color), work: 0, ph: Math.random() * 6 };
      live.set(id, a);
    }
    if (a.fading) {
      // Reaparece antes de terminar de desvanecerse: se recupera el nodo
      a.fading = false;
      if (!Wd.get(a.n.id)) { live.delete(id); return spawn(id, x, y, { size, state, task }); }
      a.n.dying = false;
    }
    a.n.ta = 1;
    a.n.x = x; a.n.y = y;
    a.size = size;
    a.tk = 1;
    a.state = state;
    if (task) a.task = task;
    return a;
  }

  function set(id, state, task) { const a = live.get(id); if (a) { a.state = state; if (task !== undefined) a.task = task; } }
  const get = (id) => live.get(id);
  function clear() {
    live.forEach((a) => { a.tk = 0; a.fading = true; a.n.ta = 0; });
  }

  /* Clic: anotación breve de lo que está investigando */
  let peekAnno = null;
  function peek(id) {
    const a = live.get(id);
    if (!a) return;
    if (peekAnno) peekAnno.remove();
    peekAnno = EX.anno.create({
      target: a.n, dx: 70, dy: -54, color: a.color,
      html: `<span class="anno__k">${a.d.name} · ${a.state === 'work' ? 'Investigando' : a.state === 'dim' ? 'No requerido en este caso' : 'En espera'}</span><span class="anno__s">${a.task || a.d.desc}</span>`,
    }).show();
    setTimeout(() => { if (peekAnno) { peekAnno.remove(); peekAnno = null; } }, 3200);
  }

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  Wd.layer('agents-draw', (ctx, now) => {
    const t = now / 1000;
    live.forEach((a, id) => {
      a.k += (a.tk - a.k) * 0.07;
      if (a.fading && a.k < 0.02) { a.n.dying = true; live.delete(id); return; }
      const lvl = { idle: 0.55, on: 1, work: 1, dim: 0.18 }[a.state] ?? 0.6;
      a.lvl = (a.lvl ?? 0) + (lvl - (a.lvl ?? 0)) * 0.08;
      a.work += ((a.state === 'work' ? 1 : 0) - a.work) * 0.08;
      const al = a.k * a.lvl;
      if (al < 0.01) return;
      const p = Wd.project(a.n.x, a.n.y);
      const r = R * a.size * Wd.cam.z;
      const hot = Wd.hovered === a.n;

      // Halo
      if (a.state !== 'dim') {
        const g = ctx.createRadialGradient(p.x, p.y, r * 0.3, p.x, p.y, r * 2.6);
        g.addColorStop(0, U.rgba(a.color, (0.12 + a.work * 0.12 + (hot ? 0.1 : 0)) * al));
        g.addColorStop(1, U.rgba(a.color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Hexágono
      const rot = t * 0.15 + a.ph;
      ctx.fillStyle = `rgba(6,9,16,${0.9 * a.k})`;
      ctx.strokeStyle = U.rgba(a.color, 0.85 * al);
      ctx.lineWidth = hot ? 1.6 : 1.1;
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const ang = rot + (i / 6) * Math.PI * 2;
        const x = p.x + Math.cos(ang) * r, y = p.y + Math.sin(ang) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.fill();
      ctx.stroke();
      // Núcleo interior que respira
      const br = 0.22 + 0.05 * Math.sin(t * 2 + a.ph);
      ctx.fillStyle = U.rgba(a.color, al);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(2, r * br), 0, Math.PI * 2);
      ctx.fill();
      // Satélites
      for (let i = 0; i < 3; i++) {
        const ang = -rot * 2 + (i / 3) * Math.PI * 2;
        ctx.fillStyle = U.rgba(a.color, 0.8 * al);
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(ang) * r * 1.45, p.y + Math.sin(ang) * r * 1.45, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Investigando: barrido y anillo de pulso
      if (a.work > 0.02) {
        const a0 = t * 3;
        ctx.strokeStyle = U.rgba(a.color, 0.8 * a.work * al);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 1.25, a0, a0 + 1.1);
        ctx.stroke();
        const pk = (t * 0.8) % 1;
        ctx.strokeStyle = U.rgba(a.color, 0.4 * (1 - pk) * a.work * al);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * (1.2 + pk * 1.4), 0, Math.PI * 2);
        ctx.stroke();
      }
      // Nombre y dominio
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
      ctx.font = `600 ${U.clamp(13 * Math.sqrt(a.size), 11, 20)}px "Space Grotesk", system-ui, sans-serif`;
      ctx.fillStyle = `rgba(236,241,250,${al})`;
      ctx.fillText(a.d.name.toUpperCase(), p.x, p.y + r * 1.7 + 4);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
      ctx.font = `400 9.5px ${MONO}`;
      ctx.fillStyle = U.rgba(a.color, 0.85 * al);
      ctx.fillText(a.d.domain.toUpperCase(), p.x, p.y + r * 1.7 + 24);
      if (a.state === 'work' || a.state === 'dim' || a.state === 'on') {
        ctx.fillStyle = a.state === 'dim' ? `rgba(110,120,140,${a.k * 0.9})` : U.rgba(a.color, al);
        ctx.fillText(a.state === 'work' ? '● ACTIVO' : a.state === 'on' ? '● CONVOCADO' : '○ INACTIVO', p.x, p.y + r * 1.7 + 40);
      }
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    });
  });

  return { spawn, set, get, clear, defs, live, R };
})();
