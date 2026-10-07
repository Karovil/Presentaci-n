/* ==========================================================================
   ESCENA 38 — EXPIA COMO SISTEMA DE INTELIGENCIA
   Zoom out total: el mapa de la organización arriba, el motor, los agentes
   y el núcleo debajo. Todo fluye hacia EXPIA. Y la frase se compone:
   de señales, a contexto, a exposición, a inteligencia, a decisión.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, OM = EX.orgMap, PL = EX.pipeline, TM = EX.team, ST = EX.stations, D = EX.story.engine2;
  let words = [];
  K.scene('engine2', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `<p class="words">${D.words.map((w, i) => `<span style="--d:${(i * 0.45).toFixed(2)}s">${w}</span>`).join(' ')}</p>`;
    },
    enter(ctx) {
      OM.reveal(); OM.showExt(true); OM.setLabels(0); OM.setTerrain(0.5); OM.focus(null);
      OM.dim(() => true, 0.55, 0.6);
      TM.stage(ctx, TM.CORE3.concat(TM.MORE), { sub: 'Inteligencia' });
      OM.reveal(); OM.showExt(true); OM.setTerrain(0.5);
      PL.reset(); PL.gates(9); PL.show(18);
      K.fly(-1500, 2000, 0.14, 3200);
      // Todo converge en el núcleo
      const pick = (arr, n) => Array.from({ length: n }, () => U.pick(arr));
      ctx.tl.at(1600, () => {
        pick(OM.all(), 10).forEach((n) => K.stream(ctx, { from: n, to: EX.core.node, color: 'cyan', rate: 1.2, speed: 0.25, size: 2.2, curve: U.rand(-0.2, 0.2) }));
        K.stream(ctx, { from: { x: ST.pipeline.x + PL.LEN / 2 + 60, y: ST.pipeline.y }, to: EX.core.node, color: 'cyan', rate: 8, speed: 0.4, size: 2.4, jitter: 120 });
      });
      ctx.el.classList.remove('is-on');
      EX.hud.caption('', '');
    },
    step(ctx, n) {
      if (n >= 1) {
        // Todo se recoge hacia EXPIA
        K.fly(ST.core.x, ST.core.y + 260, 0.4, 2600);
        OM.dim(() => false, 0.08, 0.05);
        PL.hide();
        ctx.el.classList.add('is-on');
      } else {
        K.fly(-1500, 2000, 0.14, 2000);
        ctx.el.classList.remove('is-on');
      }
    },
    leave(ctx) { PL.hide(); ctx.el.classList.remove('is-on'); },
  });
})();
