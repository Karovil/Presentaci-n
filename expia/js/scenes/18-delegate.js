/* ==========================================================================
   ESCENA 18 — DELEGACIÓN
   Llega una consulta. EXPIA la analiza y decide qué capacidades necesita.
   Solo algunos especialistas se activan; los demás quedan en espera.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, TM = EX.team, ST = EX.stations, A = EX.agents, D = EX.story.delegate;
  let stepsEl, sent = 0;

  function dispatch(ctx, i) {
    const ask = D.asks[i];
    if (!ask) return;
    const a = A.get(ask.agent);
    A.set(ask.agent, 'on', ask.need);
    K.msg(ctx, EX.core.node, a.n, ask.need, { color: a.color, dur: 1500, onArrive: () => A.set(ask.agent, 'work', ask.need) });
    sent = i + 1;
  }

  K.scene('delegate', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `<ol class="flowline">${D.steps.map((s) => `<li>${s}</li>`).join('')}</ol>`;
      stepsEl = [...ctx.el.querySelectorAll('li')];
    },
    enter(ctx) {
      TM.stage(ctx, TM.CORE3.concat(TM.MORE), { sub: 'Analizando' });
      A.live.forEach((a, id) => A.set(id, 'idle', ''));
      K.fly(ST.agents.x, ST.agents.y + 40, 0.62, 1800);
      EX.hud.caption(D.word, D.query);
      stepsEl.forEach((s) => s.classList.remove('is-on'));
      sent = 0;
      // La consulta entra desde arriba
      const q = K.node(ctx, { x: ST.agents.x, y: ST.agents.y - 760, r: 6, ring: true, color: 'red', label: 'Consulta', sub: D.query, labelSide: 1 });
      ctx.tl.at(600, () => { K.show(q); stepsEl[0].classList.add('is-on'); Wd.moveNode(q, ST.agents.x, ST.agents.y - 150, 1500, 0, U.ease.inOut); });
      ctx.tl.at(2200, () => { q.ta = 0; q.tla = 0; EX.core.receive(); EX.core.think(true); stepsEl[1].classList.add('is-on'); });
      ctx.tl.at(4000, () => {
        EX.core.think(false);
        stepsEl[2].classList.add('is-on');
        EX.core.setSub('Orquestando');
        A.live.forEach((a, id) => { if (!D.asks.some((x) => x.agent === id)) A.set(id, 'dim', 'No requerido para esta consulta'); });
      });
      D.asks.forEach((_, i) => ctx.tl.at(4600 + i * 700, () => dispatch(ctx, i)));
    },
    onNext(ctx) {
      if (sent >= D.asks.length) return false;
      ctx.tl.clear();
      stepsEl.forEach((s) => s.classList.add('is-on'));
      EX.core.think(false);
      A.live.forEach((a, id) => { if (!D.asks.some((x) => x.agent === id)) A.set(id, 'dim', 'No requerido para esta consulta'); });
      for (let i = sent; i < D.asks.length; i++) dispatch(ctx, i);
      return true;
    },
    step(ctx, n) {
      if (n >= 1) EX.say(D.line, { pos: 'low', size: 'm', sub: 'Solo participan los especialistas que la consulta necesita.' });
      else EX.say.clear();
    },
    leave() { EX.core.think(false); },
  });
})();
