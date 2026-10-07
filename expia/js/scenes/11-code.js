/* ==========================================================================
   ESCENA 11 — EL CÓDIGO DETRÁS
   El mismo motor, visto desde dentro: un trabajo en ejecución recorre las
   nueve etapas línea por línea, sincronizado con las compuertas. Después,
   una regla: si ocurre X → ejecuta Y → obtén Z.
   ========================================================================== */
(() => {
  const U = EX.u, K = EX.kit, PL = EX.pipeline, ST = EX.stations, D = EX.story.code;
  let lines = [], cur = 0, timer = 0, runEl, run = 4812, elapsed = 0;

  function tick() {
    lines.forEach((l, i) => { l.classList.toggle('is-cur', i === cur); l.classList.toggle('is-done', i < cur); });
    PL.highlight(cur);
    cur = (cur + 1) % lines.length;
    if (cur === 0) { run++; lines.forEach((l) => l.classList.remove('is-done')); }
    elapsed += 0.4;
    runEl.textContent = `job expia.context · run ${run} · ${elapsed.toFixed(1)} s · determinístico`;
  }

  K.scene('code', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `
        <div class="code">
          <p class="code__run"></p>
          <ol>${D.lines.map(([stage, src], i) => `<li><span class="code__n">${U.pad(i + 1)}</span><span class="code__stage">${stage}</span><code>${src}</code></li>`).join('')}</ol>
          <div class="rule">${D.rule.map((r, i) => `${i ? '<i class="rule__arrow"></i>' : ''}<div class="rule__row" style="--d:${i * 0.35}s"><span>${r.k}</span><b>${r.v}</b></div>`).join('')}</div>
        </div>`;
      lines = [...ctx.el.querySelectorAll('li')];
      runEl = ctx.el.querySelector('.code__run');
    },
    enter(ctx) {
      K.base({ org: 'hide', kicker: 'Automatización', caption: D.line });
      if (PL.gatesShown < 9) { PL.reset(); PL.gates(9); }
      PL.show(26);
      // El motor se desplaza a la izquierda: el código ocupa el lado derecho
      K.fly(ST.pipeline.x + 1150, ST.pipeline.y + 20, 0.36, 2200);
      cur = 0; elapsed = 0;
      clearInterval(timer);
      timer = setInterval(tick, 420);
    },
    step(ctx, n) {
      ctx.el.classList.toggle('is-rule', n >= 1);
      EX.hud.caption('Automatización', n >= 1 ? 'Si ocurre X, ejecuta Y, obtén Z.' : D.line);
    },
    leave() { clearInterval(timer); PL.highlight(-1); PL.hide(); },
  });
})();
