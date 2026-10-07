/* ==========================================================================
   ESCENA 08 — EL VOLUMEN DE SEÑALES
   Una señal. Diez. Cientos. Miles. Cada señal se posa sobre un activo real,
   clasificada por tipo: no es caos, es un sistema que recibe demasiado.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, OM = EX.orgMap, D = EX.story.volume;
  const RAMP = [[0, 0], [1.2, 1], [2.8, 1], [3.6, 10], [5, 10], [6.5, 320], [8, 320], [11, 6000]];
  const MAX = 6000;
  let marks = [], shown = 0, t = 0, run = false, fade = 1, fadeT = 1, rows = [], totalEl;

  Wd.layer('volume-marks', (ctx, now) => {
    if (!run) return;
    t += 1 / 60;
    const target = Math.round(U.sampleRampSafe(RAMP, t));
    shown += (target - shown) * 0.08;
    fade += (fadeT - fade) * 0.05;
    const n = Math.min(marks.length, Math.round(shown));
    for (let i = 0; i < n; i++) {
      const m = marks[i];
      const p = Wd.project(m.x, m.y);
      const born = Math.min(1, (now - (m.t || (m.t = now))) / 600);
      ctx.fillStyle = U.rgba(m.c, (i < 12 ? 1 : 0.75) * born * fade);
      const s = i < 12 ? 3 : 2;
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      if (i === 0 && n < 20) {
        ctx.strokeStyle = U.rgba(m.c, 0.6 * fade);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10 + 3 * Math.sin(now / 300), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // Contadores por tipo
    const frac = n / MAX;
    rows.forEach((r) => {
      const v = Math.round(r.max * frac);
      if (v !== r.v) { r.v = v; r.num.textContent = U.fmt(v); r.bar.style.transform = `scaleX(${Math.min(1, v / 18392)})`; }
    });
    const total = rows.reduce((s, r) => s + r.v, 0);
    if (total !== +totalEl.dataset.v) { totalEl.dataset.v = total; totalEl.textContent = U.fmt(total); }
  });

  K.scene('volume', {
    steps: 3,
    init(ctx) {
      ctx.el.innerHTML = `
        <div class="vol">
          <p class="vol__k">Señales recibidas</p>
          <p class="vol__n" data-v="0">0</p>
          <ul>${D.types.map((ty) => `<li><span><i style="background:${U.rgba(K.col(ty.color), 1)}"></i>${ty.label}</span><b>0</b><em><s style="background:${U.rgba(K.col(ty.color), 0.8)}"></s></em></li>`).join('')}</ul>
        </div>`;
      totalEl = ctx.el.querySelector('.vol__n');
      rows = [...ctx.el.querySelectorAll('li')].map((li, i) => ({ max: D.types[i].max, num: li.querySelector('b'), bar: li.querySelector('s'), v: -1 }));
    },
    enter(ctx) {
      K.base({ org: 'faint', ext: true, terrain: 0.4 });
      K.fly(260, 30, 0.33, 2000);
      const pool = OM.all().concat(Wd.tagged('orgx'));
      // Pesos por tipo según su volumen real
      const tot = D.types.reduce((s, ty) => s + ty.max, 0);
      marks = [];
      for (let i = 0; i < MAX; i++) {
        let r = Math.random() * tot, ty = D.types[0];
        for (const x of D.types) { if ((r -= x.max) < 0) { ty = x; break; } }
        const n = pool[(Math.random() * pool.length) | 0];
        marks.push({ x: n.home.x + U.rand(-9, 9), y: n.home.y + U.rand(-9, 9), c: K.col(ty.color) });
      }
      t = 0; shown = 0; fade = 1; fadeT = 1; run = true;
      totalEl.dataset.v = 0;
    },
    step(ctx, n) {
      if (n >= 1 && t < 11) t = 11;
      fadeT = n >= 2 ? 0.45 : 1;
      if (n === 0) EX.say.clear();
      if (n === 1) EX.say(D.lines[0], { pos: 'center' });
      if (n === 2) EX.say(D.lines[1], { pos: 'center', sub: 'Miles de señales. Ninguna, por sí sola, dice cuál es el riesgo real.' });
    },
    leave() { run = false; },
  });
})();
