/* ==========================================================================
   ESCENA 24 — PRIORIZACIÓN
   Mil señales. Paso a paso, el contexto descarta lo que no importa:
   ruido → señales → exposiciones relevantes → exposiciones críticas.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.priority;
  let dots = [], lvl = 0, stageEls = [], countEl;
  const BAND = [1, 0.62, 0.32, 0.08];   // anchura relativa de cada nivel

  K.scene('priority', {
    steps: 4,
    init(ctx) {
      ctx.el.innerHTML = `
        <div class="funnel">
          <p class="funnel__k">${D.title}</p>
          <p class="funnel__n">1.000</p>
          <ol>${D.levels.map((l) => `<li><span>${l.label}</span><b>${U.fmt(l.count)}</b></li>`).join('')}</ol>
        </div>`;
      stageEls = [...ctx.el.querySelectorAll('li')];
      countEl = ctx.el.querySelector('.funnel__n');
    },
    enter(ctx) {
      const c = ST.funnel;
      K.base({ org: 'hide', caption: D.line });
      K.fly(c.x + 200, c.y, 0.55, 2000);
      dots = [];
      const keep = D.levels.map((l) => l.count);
      for (let i = 0; i < 1000; i++) {
        const tier = i < keep[3] ? 3 : i < keep[2] ? 2 : i < keep[1] ? 1 : 0;
        const n = K.node(ctx, { x: c.x + U.rand(-1100, 1100), y: c.y + U.rand(-560, 560), r: tier === 3 ? 2.6 : 1.6, color: [130, 145, 175], fixed: false });
        n.tier = tier;
        dots.push(n);
        ctx.tl.at(Math.random() * 1500, () => { n.ta = 0.6; });
      }
      lvl = 0;
      stageEls.forEach((s, i) => s.classList.toggle('is-on', i === 0));
      countEl.textContent = '1.000';
    },
    step(ctx, n) {
      const c = ST.funnel;
      lvl = n;
      stageEls.forEach((s, i) => s.classList.toggle('is-on', i <= n));
      U.countTo(countEl, D.levels[n].count, { duration: 1400, from: D.levels[Math.max(0, n - 1)].count });
      const tint = [[130, 145, 175], P.yellow, P.orange, P.red][n];
      dots.forEach((d) => {
        const alive = d.tier >= n;
        if (!alive) { d.ta = 0.04; return; }
        d.ta = n >= 3 ? 1 : 0.85;
        d.color = tint;
        const w = BAND[n];
        Wd.moveNode(d, c.x + (Math.random() - 0.5) * 2200 * w, c.y + (Math.random() - 0.5) * 1100 * w, 1500, Math.random() * 300, U.ease.inOut);
      });
      if (n === 3) {
        // Las tres exposiciones críticas se separan y se nombran
        const crit = dots.filter((d) => d.tier === 3);
        const names = ['Ruta Internet → nómina', 'Brecha de control en DMZ', 'Cuenta privilegiada expuesta'];
        crit.forEach((d, i) => {
          Wd.moveNode(d, c.x - 180 + i * 380, c.y + (i === 1 ? -60 : 40), 1600, 200, U.ease.inOut);
          d.r = 7; d.ring = true; d.label = names[i]; d.labelSide = 1; d.labelUpper = true;
          setTimeout(() => { d.tla = 1; d.tglow = 1; Wd.pulse(d, P.red, { r: 70, dur: 1600 }); }, 1700);
        });
        K.fly(c.x + 150, c.y, 0.95, 1800);
        EX.hud.caption(D.title, 'De mil señales a tres exposiciones críticas.');
      } else if (n === 0) {
        K.fly(c.x + 200, c.y, 0.55, 1400);
        EX.hud.caption('', D.line);
      }
    },
  });
})();
