/* ==========================================================================
   ESCENA 27 — DE DATOS A EXPLICACIÓN
   500 señales → contexto → análisis de IA → una explicación corta.
   Las señales se condensan físicamente en un único punto y de ahí sale
   la respuesta.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.explain;
  let dots = [], stageEls = [], ansEl, typer = 0, focus;

  function type() {
    clearInterval(typer);
    let i = 0;
    typer = setInterval(() => {
      i = Math.min(D.answer.length, i + 2);
      ansEl.innerHTML = D.answer.slice(0, i) + (i < D.answer.length ? '<i class="caret"></i>' : '');
      if (i >= D.answer.length) clearInterval(typer);
    }, 24);
  }

  K.scene('explain', {
    steps: 3,
    init(ctx) {
      ctx.el.innerHTML = `
        <ol class="flowline flowline--low"><li>${D.from}</li><li>${D.mid}</li><li>${D.ai}</li></ol>
        <div class="answer"><p class="answer__q">${D.question}</p><p class="answer__a"></p></div>`;
      stageEls = [...ctx.el.querySelectorAll('.flowline li')];
      ansEl = ctx.el.querySelector('.answer__a');
    },
    enter(ctx) {
      const c = ST.ai;
      K.base({ org: 'hide' });
      K.fly(c.x - 320, c.y, 0.75, 2000);
      dots = [];
      for (let i = 0; i < 500; i++) {
        const n = K.node(ctx, { x: c.x - 320 + U.rand(-640, 640), y: c.y + U.rand(-380, 380), r: 1.5, color: U.pick([P.orange, P.yellow, P.violet, P.cyan, P.asset]), fixed: false });
        dots.push(n);
        ctx.tl.at(Math.random() * 1200, () => { n.ta = 0.7; });
      }
      focus = K.node(ctx, { x: c.x - 320, y: c.y, r: 9, ring: true, color: 'cyan', label: 'Contexto', labelSide: 1 });
      stageEls.forEach((s, i) => s.classList.toggle('is-on', i === 0));
      ansEl.innerHTML = '';
      ctx.el.classList.remove('is-answer');
      EX.hud.caption('', '');
    },
    step(ctx, n) {
      const c = ST.ai;
      stageEls.forEach((s, i) => s.classList.toggle('is-on', i <= n));
      if (n >= 1) {
        dots.forEach((d, i) => {
          const a = (i / dots.length) * Math.PI * 2, r = 30 + (i % 5) * 18;
          Wd.moveNode(d, c.x - 320 + Math.cos(a) * r, c.y + Math.sin(a) * r * 0.9, 1400, Math.random() * 400, U.ease.inOut);
        });
        ctx.tl.at(1400, () => { K.show(focus); Wd.pulse(focus, P.cyan, { r: 120, dur: 1500 }); });
      }
      if (n >= 2) {
        focus.color = P.violet;
        dots.forEach((d) => { d.ta = 0.12; });
        K.fly(c.x - 20, c.y, 0.75, 1600);
        ctx.el.classList.add('is-answer');
        ctx.tl.at(900, type);
      } else { ctx.el.classList.remove('is-answer'); clearInterval(typer); ansEl.innerHTML = ''; }
    },
    leave() { clearInterval(typer); },
  });
})();
