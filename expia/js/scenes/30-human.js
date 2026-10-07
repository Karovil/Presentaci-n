/* ==========================================================================
   ESCENA 30 — EL HUMANO DECIDE
   La inteligencia llega a una persona. El analista recibe contexto,
   evidencia, exposición, relaciones, explicación y prioridad, y decide.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.human;
  let gives = [], analyst, opts;

  /* Silueta del analista (trazo), dibujada en el mundo */
  Wd.layer('human', (ctx) => {
    if (!analyst || analyst.alpha < 0.02) return;
    const p = Wd.project(analyst.x, analyst.y);
    const s = 60 * Wd.cam.z, a = analyst.alpha;
    ctx.strokeStyle = U.rgba([230, 236, 248], 0.9 * a);
    ctx.fillStyle = `rgba(6,9,16,${0.95 * a})`;
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(p.x, p.y - s * 0.55, s * 0.32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x - s * 0.9, p.y + s * 0.95);
    ctx.bezierCurveTo(p.x - s * 0.8, p.y + s * 0.15, p.x - s * 0.4, p.y - s * 0.08, p.x, p.y - s * 0.08);
    ctx.bezierCurveTo(p.x + s * 0.4, p.y - s * 0.08, p.x + s * 0.8, p.y + s * 0.15, p.x + s * 0.9, p.y + s * 0.95);
    ctx.stroke();
    ctx.strokeStyle = U.rgba(P.cyan, 0.3 * a);
    ctx.setLineDash([2, 5]);
    ctx.beginPath(); ctx.arc(p.x, p.y - s * 0.55, s * 0.62, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  });

  K.scene('human', {
    steps: 3,
    init(ctx) {
      ctx.el.innerHTML = `
        <ol class="flowline">${D.chain.map((c) => `<li>${c}</li>`).join('')}</ol>
        <div class="options is-interactive">${D.options.map((o) => `<button type="button">${o}</button>`).join('')}</div>
        <p class="equation">${D.equation.slice(0, 3).map((e) => `<span>${e}</span>`).join('<i>+</i>')}<i>=</i><b>${D.equation[3]}</b></p>`;
      opts = [...ctx.el.querySelectorAll('.options button')];
      opts.forEach((b) => b.addEventListener('click', () => {
        opts.forEach((x) => x.classList.toggle('is-picked', x === b && !b.classList.contains('is-picked')));
        if (b.classList.contains('is-picked')) Wd.pulse(analyst, P.cyan, { r: 160, dur: 1400 });
      }));
    },
    enter(ctx) {
      const c = ST.human;
      K.base({ org: 'hide', core: { x: c.x - 700, y: c.y - 40, sub: 'Inteligencia', scale: 0.8 } });
      K.fly(c.x - 120, c.y + 20, 0.82, 2000);
      analyst = K.node(ctx, { x: c.x + 280, y: c.y, r: 0.1, hidden: true, ta: 0 });
      ctx.tl.at(900, () => { analyst.ta = 1; });
      const steps = [...ctx.el.querySelectorAll('.flowline li')];
      steps.forEach((s, i) => { s.classList.remove('is-on'); ctx.tl.at(700 + i * 500, () => s.classList.add('is-on')); });
      gives = D.gives.map((g, i) => {
        const y = c.y - 250 + i * 100;
        const n = K.node(ctx, { x: c.x - 700, y: c.y - 40, r: 4, ring: true, color: 'cyan', label: g, labelSide: 1, labelSize: 10 });
        n.dest = { x: c.x - 160, y };
        n.e = K.edge(ctx, n, analyst, { ta: 0, td: 0, draw: 0, color: 'cyan', width: 0.7, dash: [2, 5] });
        ctx.tl.at(2200 + i * 260, () => { K.show(n); Wd.moveNode(n, n.dest.x, n.dest.y, 1100, 0, U.ease.out); ctx.tl.at(900, () => { n.e.ta = 0.45; n.e.td = 1; }); });
        return n;
      });
      opts.forEach((x) => x.classList.remove('is-picked'));
      EX.hud.caption('', '');
    },
    step(ctx, n) {
      ctx.el.classList.toggle('is-options', n >= 1);
      ctx.el.classList.toggle('is-eq', n >= 2);
      if (n === 1) EX.say(D.lines[0], { pos: 'top', size: 's', sub: D.lines[1] });
      if (n === 2) EX.say.clear();
      if (n === 0) EX.say.clear();
    },
    leave() { analyst = null; },
  });
})();
