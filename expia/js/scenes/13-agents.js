/* ==========================================================================
   ESCENA 13 — NACEN LOS AGENTES
   Los lugares vacíos se ocupan: ARGUS, AGORA y AEGIS emergen del núcleo.
   No son módulos: cada uno es un especialista con su dominio.
   Hover: qué investiga. Clic: qué está investigando ahora.
   ========================================================================== */
(() => {
  const K = EX.kit, TM = EX.team, ST = EX.stations, D = EX.story.agents;
  K.scene('agents', {
    steps: 2,
    enter(ctx) {
      TM.stage(ctx, [], {});
      EX.core.think(true);
      K.fly(ST.agents.x, ST.agents.y + 60, 0.95, 1800);
      EX.hud.caption('Multi-agente', D.intro[0]);
      ctx.tl.at(1400, () => {
        EX.core.think(false);
        TM.stage(ctx, TM.CORE3, { from: ST.agents });
        TM.CORE3.forEach((id, i) => ctx.tl.at(400 + i * 220, () => EX.world.pulse(TM.pos(id), EX.agents.get(id).color, { r: 90, dur: 1400 })));
      });
    },
    step(ctx, n) {
      EX.hud.caption('Multi-agente', n >= 1 ? D.intro[1] : D.intro[0]);
      if (n >= 1) EX.say('Cada uno conoce profundamente <em>su dominio</em>.', { pos: 'top', size: 's' });
      else EX.say.clear();
    },
  });
})();
