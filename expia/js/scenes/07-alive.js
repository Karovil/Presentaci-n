/* ==========================================================================
   ESCENA 07 — UNA SUPERFICIE VIVA
   La superficie nunca está quieta: aparecen activos, vulnerabilidades,
   controles que fallan, cambios de privilegio… cada evento deja su marca
   en el mapa y en el registro.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, K = EX.kit, OM = EX.orgMap, D = EX.story.alive;
  let events = [], timer = 0, feed, on = false, pool = [];

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  Wd.layer('alive-events', (ctx, now) => {
    events = events.filter((e) => now - e.t0 < 2800);
    for (const e of events) {
      const k = (now - e.t0) / 2800;
      const a = k < 0.1 ? k * 10 : 1 - Math.max(0, (k - 0.6) / 0.4);
      const p = Wd.project(e.n.x, e.n.y);
      ctx.strokeStyle = U.rgba(e.c, 0.7 * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x + 4, p.y - 4);
      ctx.lineTo(p.x + 18, p.y - 18);
      ctx.lineTo(p.x + 30, p.y - 18);
      ctx.stroke();
      ctx.font = `500 9.5px ${MONO}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = U.rgba(e.c, a);
      ctx.fillText(e.label.toUpperCase(), p.x + 34, p.y - 18);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }
  });

  function fire() {
    if (!on || !pool.length) return;
    const ev = U.pick(D.events);
    const c = K.col(ev.color);
    let n = U.pick(pool);
    if (ev.label === 'Nuevo activo') {
      // Un activo que no estaba: aparece junto a otro
      const near = n;
      n = Wd.addNode({ x: near.home.x + U.rand(-30, 30), y: near.home.y + U.rand(-30, 30), r: 2, color: P.ink, ta: 1, tags: ['s-alive'] });
      Wd.addEdge(n, near, { ta: 0.3, color: [150, 175, 225], tags: ['s-alive'] });
    } else {
      const prev = n.color;
      n.color = c; n.tglow = 1;
      setTimeout(() => { n.color = prev; n.tglow = 0; }, 2600);
    }
    Wd.pulse(n, c, { r: 46, dur: 1500 });
    events.push({ n, c, label: ev.label, t0: performance.now() });
    const d = new Date();
    const li = document.createElement('li');
    li.innerHTML = `<span>${U.pad(d.getHours())}:${U.pad(d.getMinutes())}:${U.pad(d.getSeconds())}</span><i style="background:${U.rgba(c, 1)}"></i>${ev.label}`;
    feed.prepend(li);
    while (feed.children.length > 9) feed.lastChild.remove();
  }

  K.scene('alive', {
    init(ctx) {
      ctx.el.innerHTML = '<ol class="feed"></ol>';
      feed = ctx.el.querySelector('.feed');
    },
    enter(ctx) {
      K.base({ org: 'show', ext: true, terrain: 0.8, kicker: D.kicker, caption: D.line });
      K.fly(60, 20, 0.36, 2200);
      ctx.tl.at(2200, () => Wd.drift({ z: 0.012 }));
      pool = OM.all().concat(Wd.tagged('orgx'));
      feed.innerHTML = '';
      on = true;
      clearInterval(timer);
      timer = setInterval(fire, 420);
    },
    leave() { on = false; clearInterval(timer); events = []; },
  });
})();
