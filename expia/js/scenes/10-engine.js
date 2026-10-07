/* ==========================================================================
   ESCENA 10 — MOTOR DE AUTOMATIZACIÓN
   Antes de cualquier IA hay una enorme capa de automatización. Las compuertas
   aparecen una a una y cada una transforma las señales que la cruzan.
   ========================================================================== */
(() => {
  const U = EX.u, K = EX.kit, PL = EX.pipeline, ST = EX.stations, D = EX.story.engine;
  let inEl, outEl, dropEl, timer = 0;

  K.scene('engine', {
    init(ctx) {
      ctx.el.innerHTML = `
        <div class="io">
          <div><span>Señales que entran</span><b data-in>0</b></div>
          <div><span>Descartadas · fusionadas</span><b data-drop>0</b></div>
          <div><span>Contextos construidos</span><b data-out>0</b></div>
        </div>`;
      inEl = ctx.el.querySelector('[data-in]');
      dropEl = ctx.el.querySelector('[data-drop]');
      outEl = ctx.el.querySelector('[data-out]');
    },
    enter(ctx) {
      K.base({ org: 'hide', kicker: D.title, caption: D.line });
      PL.reset();
      PL.show(26);
      K.fly(ST.pipeline.x + 80, ST.pipeline.y + 60, 0.48, 2600);
      D.stages.forEach((_, i) => ctx.tl.at(1400 + i * 650, () => PL.gates(i + 1)));
      clearInterval(timer);
      timer = setInterval(() => {
        inEl.textContent = U.fmt(PL.stats.in * 37);
        dropEl.textContent = U.fmt((PL.stats.dropped + PL.stats.merged) * 37);
        outEl.textContent = U.fmt(PL.stats.out * 0.6);
      }, 200);
    },
    onNext(ctx) {
      if (PL.gatesShown >= D.stages.length) return false;
      ctx.tl.clear();
      PL.gates(D.stages.length);
      return true;
    },
    leave(ctx) {
      clearInterval(timer);
      if (!['code'].includes(document.body.dataset.scene)) PL.hide();
    },
  });
})();
