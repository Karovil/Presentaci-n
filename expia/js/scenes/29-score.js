/* ==========================================================================
   ESCENA 29 — PUNTAJE DE EXPOSICIÓN
   El puntaje se construye por segmentos: cada factor de contexto aporta un
   arco al anillo. Al lado, el porqué. Abajo, la cadena que lo produce.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.score;
  let shown = 0, target = 0, numEl, rows = [], hover = -1, scoreEl = null;
  const COLORS = [P.orange, P.red, P.red, P.yellow, P.violet, P.violet];
  const C = () => ({ x: ST.insight.x + 2400, y: ST.insight.y });

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  Wd.layer('score-ring', (ctx, now) => {
    shown += (target - shown) * 0.06;
    if (shown < 0.05 && target === 0) return;
    const c = Wd.project(C().x, C().y);
    const R = 210 * Wd.cam.z;
    if (scoreEl) { scoreEl.style.left = c.x + 'px'; scoreEl.style.top = c.y + 'px'; }
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(150,170,215,0.15)';
    ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i <= 100; i += 5) {
      const a = -Math.PI / 2 + (i / 100) * Math.PI * 2;
      const r2 = R + (i % 25 === 0 ? 14 : 7);
      ctx.beginPath(); ctx.moveTo(c.x + Math.cos(a) * (R + 3), c.y + Math.sin(a) * (R + 3)); ctx.lineTo(c.x + Math.cos(a) * r2, c.y + Math.sin(a) * r2); ctx.stroke();
    }
    let acc = 0;
    D.factors.forEach((f, i) => {
      const from = acc, to = Math.min(shown, acc + f.w);
      acc += f.w;
      if (to <= from) return;
      const a0 = -Math.PI / 2 + (from / 100) * Math.PI * 2 + 0.01, a1 = -Math.PI / 2 + (to / 100) * Math.PI * 2 - 0.01;
      ctx.strokeStyle = U.rgba(COLORS[i], hover === -1 || hover === i ? 0.95 : 0.25);
      ctx.lineWidth = hover === i ? 9 : 6;
      ctx.beginPath(); ctx.arc(c.x, c.y, R, a0, a1); ctx.stroke();
    });
    ctx.lineWidth = 1;
  });

  K.scene('score', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `
        <div class="score">
          <p class="score__k">${D.title}</p>
          <p class="score__n">0</p>
          <p class="score__note">${D.note}</p>
        </div>
        <div class="why is-interactive"><p class="why__k">${D.why}</p>
          <ul>${D.factors.map((f, i) => `<li data-i="${i}" style="--c:${U.rgba(COLORS[i], 1)};--d:${(i * 0.25).toFixed(2)}s"><i></i>${f.label}<b>+${f.w}</b></li>`).join('')}</ul></div>
        <ol class="flowline flowline--low">${D.chain.map((c) => `<li class="is-on">${c}</li>`).join('')}</ol>`;
      numEl = ctx.el.querySelector('.score__n');
      scoreEl = ctx.el.querySelector('.score');
      rows = [...ctx.el.querySelectorAll('.why li')];
      rows.forEach((r, i) => { r.addEventListener('pointerenter', () => { hover = i; }); r.addEventListener('pointerleave', () => { hover = -1; }); });
    },
    enter(ctx) {
      K.base({ org: 'hide' });
      const c = C();
      K.fly(c.x + 260, c.y + 30, 0.95, 2000);
      shown = 0; target = 0; hover = -1;
      numEl.dataset.v = 0; numEl.textContent = '0';
      let acc = 0;
      D.factors.forEach((f, i) => ctx.tl.at(1600 + i * 650, () => { acc += f.w; target = acc; U.countTo(numEl, acc, { duration: 600 }); rows[i].classList.add('is-on'); }));
      rows.forEach((r) => r.classList.remove('is-on'));
      EX.hud.caption('', '');
    },
    onNext(ctx) {
      if (ctx.step > 0 || target >= D.value) return false;
      ctx.tl.clear();
      target = D.value; U.countTo(numEl, D.value, { duration: 600 });
      rows.forEach((r) => r.classList.add('is-on'));
      return true;
    },
    step(ctx, n) { ctx.el.classList.toggle('is-chain', n >= 1); },
    leave() { target = 0; shown = 0; },
  });
})();
