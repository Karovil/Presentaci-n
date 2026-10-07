/* ==========================================================================
   ESCENA 25 — INTELIGENCIA, NO SOLO ALERTAS
   "500 vulnerabilidades" se desvanece y en su lugar quedan cuatro
   respuestas con contexto.
   ========================================================================== */
(() => {
  const U = EX.u, K = EX.kit, ST = EX.stations, D = EX.story.insight;
  K.scene('insight', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `
        <div class="insight">
          <p class="insight__before"><b>${D.before.n}</b> ${D.before.label}</p>
          <ul>${D.items.map((it, i) => `<li style="--d:${(i * 0.35).toFixed(2)}s;--c:${U.rgba(K.col(it.color), 1)}"><b>${it.n}</b><span>${it.label}</span></li>`).join('')}</ul>
        </div>`;
    },
    enter(ctx) {
      K.base({ org: 'hide' });
      K.fly(ST.insight.x, ST.insight.y, 0.6, 2000);
      EX.hud.caption('', '');
    },
    step(ctx, n) {
      if (n >= 1) EX.say(D.lines[0], { pos: 'low', size: 's', sub: D.lines[1] });
      else EX.say.clear();
    },
  });
})();
