/* ==========================================================================
   ESCENA 14 — ARGUS
   La CVE llega a ARGUS. Investiga y abre sus hallazgos alrededor.
   Después los pliega en un paquete: inteligencia especializada, no decisión.
   ========================================================================== */
(() => {
  const U = EX.u, K = EX.kit, TM = EX.team, A = EX.agents, D = EX.story.argus;
  let facets = [], packet = null;
  K.scene('argus', {
    steps: 2,
    enter(ctx) {
      TM.stage(ctx, TM.CORE3);
      A.set('agora', 'dim'); A.set('aegis', 'dim');
      const a = A.get('argus');
      const p = TM.pos('argus');
      K.fly(p.x - 190, p.y + 10, 1.35, 2400);
      EX.hud.caption('ARGUS', 'Inteligencia de vulnerabilidades');
      K.msg(ctx, EX.core.node, a.n, D.task, { delay: 1200, color: 'red', onArrive: () => A.set('argus', 'work', 'Investigando ' + D.task) });
      facets = TM.facets(ctx, 'argus', D.facets, { delay: 3000, gap: 380, r: 260, spread: 1.75 });
      packet = null;
    },
    step(ctx, n) {
      if (n >= 1 && !packet) {
        ctx.tl.clear();
        facets.forEach((f) => { f.ta = 1; f.x = f.dest.x; f.y = f.dest.y; });
        packet = TM.fold(ctx, facets, 'argus', D.out);
        A.set('argus', 'on', D.out);
        const p = TM.pos('argus');
        K.fly(p.x + 40, p.y + 60, 1.1, 1800);
        EX.say(D.note, { pos: 'low', size: 's' });
      }
    },
  });
})();
