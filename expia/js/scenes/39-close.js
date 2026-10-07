/* ==========================================================================
   ESCENA 39 — CIERRE
   Pantalla limpia. EXPIA. Tres frases, con pausa. Y la puerta a la
   arquitectura.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.close;
  K.scene('close', {
    steps: 4,
    init(ctx) {
      ctx.el.innerHTML = `
        <div class="closing">
          <h2 class="closing__mark" aria-label="EXPIA">${[...'EXPIA'].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</h2>
          <p class="closing__sub">${EX.text.brandSub}</p>
          <p class="closing__l l1">${D.lines[0]}</p>
          <p class="closing__l l2">${D.lines[1]}</p>
          <p class="closing__l l3">${D.lines[2]}</p>
        </div>
        <button class="door" type="button"><span class="door__q">${D.question}</span><span class="door__cta">${D.enter} <i></i></span></button>`;
      ctx.el.querySelector('.door').addEventListener('click', () => {
        Wd.pulse({ x: ST.core.x, y: ST.core.y }, P.cyan, { r: 1400, dur: 2600, width: 1.4 });
        ctx.el.classList.add('is-door');
      });
    },
    enter(ctx) {
      K.base({ org: 'hide' });
      K.fly(ST.core.x, ST.core.y, 0.5, 2400);
      ctx.el.classList.remove('is-door');
      // Rastro final: polvo que converge hacia el centro
      for (let i = 0; i < 240; i++) {
        const a = Math.random() * Math.PI * 2, r = U.rand(600, 1600);
        const n = K.node(ctx, { x: ST.core.x + Math.cos(a) * r, y: ST.core.y + Math.sin(a) * r * 0.7, r: U.rand(1, 1.8), color: U.pick([P.cyan, P.asset, P.violet]), fixed: false });
        n.ta = 0.6;
        Wd.moveNode(n, ST.core.x + U.gauss() * 6, ST.core.y + U.gauss() * 6, U.rand(2400, 3600), U.rand(0, 600), U.ease.inOut);
        ctx.tl.at(3800, () => { n.ta = 0; });
      }
      ctx.tl.at(3600, () => Wd.pulse({ x: ST.core.x, y: ST.core.y }, P.cyan, { r: 500, dur: 2200 }));
      EX.hud.caption('', '');
    },
  });
})();
