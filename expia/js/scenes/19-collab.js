/* ==========================================================================
   ESCENA 19 — LOS AGENTES COLABORAN
   ARGUS encuentra la vulnerabilidad y pide postura a AGORA. AGORA encuentra
   la exposición y pide controles a AEGIS. AEGIS confirma la brecha. Los tres
   devuelven su contexto a EXPIA.
   ========================================================================== */
(() => {
  const U = EX.u, K = EX.kit, TM = EX.team, ST = EX.stations, A = EX.agents, D = EX.story.collab;
  let done = false;

  function find(ctx, id, text) {
    const a = A.get(id);
    A.set(id, 'work', text);
    const right = a.n.x >= ST.agents.x;
    ctx.annos.push(EX.anno.create({ target: a.n, dx: right ? 80 : -80, dy: -70, color: a.color,
      html: `<span class="anno__k">${a.d.name} · hallazgo</span><span class="anno__q">${text}</span>` }).show());
  }

  function converge(ctx) {
    if (done) return;
    done = true;
    TM.CORE3.forEach((id, i) => {
      const a = A.get(id);
      K.stream(ctx, { from: a.n, to: EX.core.node, color: a.color, rate: 14, speed: 0.6, jitter: 26, size: 1.8 });
      ctx.tl.at(i * 200, () => A.set(id, 'on', 'Contexto entregado a EXPIA'));
    });
    EX.core.setSub('Contexto unificado');
    ctx.tl.at(900, () => EX.core.receive());
  }

  K.scene('collab', {
    steps: 2,
    enter(ctx) {
      TM.stage(ctx, TM.CORE3.concat(TM.MORE), { sub: 'Orquestando' });
      TM.MORE.forEach((id) => A.set(id, 'dim'));
      TM.CORE3.forEach((id) => A.set(id, 'on'));
      done = false;
      K.fly(ST.agents.x, ST.agents.y + 40, 0.82, 1800);
      EX.hud.caption('Colaboración', '');
      let t = 1000;
      D.script.forEach((s) => {
        if (s.at) { ctx.tl.at(t, () => find(ctx, s.at, s.find)); t += 1500; }
        else {
          ctx.tl.at(t, () => {
            const from = A.get(s.from), to = A.get(s.to);
            K.msg(ctx, from.n, to.n, s.msg, { color: from.color, dur: 1800, curve: -0.3 });
          });
          t += 2100;
        }
      });
      ctx.tl.at(t + 400, () => EX.hud.caption('Colaboración', D.lines[0]));
    },
    step(ctx, n) {
      if (n >= 1) {
        converge(ctx);
        EX.hud.caption('', '');
        EX.say(D.lines[0], { pos: 'low', size: 'm', sub: D.lines[1] });
      } else EX.say.clear();
    },
  });
})();
