/* ==========================================================================
   ESCENA 17 — MÁS ESPECIALISTAS
   La cámara se aleja: hay más especialistas, cada uno en una dimensión.
   ========================================================================== */
(() => {
  const K = EX.kit, TM = EX.team, ST = EX.stations, A = EX.agents, Wd = EX.world, D = EX.story.agents;
  K.scene('more', {
    enter(ctx) {
      TM.stage(ctx, TM.CORE3);
      TM.CORE3.forEach((id) => A.set(id, 'idle'));
      K.fly(ST.agents.x, ST.agents.y + 60, 0.6, 2400);
      ctx.tl.at(1200, () => {
        const more = TM.stage(ctx, TM.CORE3.concat(TM.MORE), { from: ST.agents });
        more.slice(3).forEach((a, i) => ctx.tl.at(300 + i * 180, () => Wd.pulse(TM.pos(a.id), a.color, { r: 70, dur: 1300 })));
      });
      EX.hud.caption('Multi-agente', D.moreLine);
    },
  });
})();
