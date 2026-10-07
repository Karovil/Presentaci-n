/* ==========================================================================
   ESCENA 36 — AUTOMATIZACIÓN CONTINUA
   EXPIA sigue observando: un cambio en el mapa dispara la cadena
   nuevo activo → nueva CVE → cambio de control → nueva exposición →
   nueva amenaza → reevaluar. Y vuelve a empezar.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, OM = EX.orgMap, P = EX.palette, D = EX.story.continuous;
  let timer = 0, k = 0, chainEls = [], pool = [];

  function tick(ctx) {
    const i = k % D.chain.length;
    chainEls.forEach((el, j) => el.classList.toggle('is-on', j === i));
    const c = K.col(D.colors[i]);
    const n = U.pick(pool);
    Wd.pulse(n, c, { r: i === D.chain.length - 1 ? 220 : 60, dur: 1500 });
    const prev = n.color; n.color = c; n.tglow = 1;
    setTimeout(() => { n.color = prev; n.tglow = 0; }, 1500);
    if (i === D.chain.length - 1) { EX.core.receive(); }
    k++;
  }

  K.scene('continuous', {
    init(ctx) {
      ctx.el.innerHTML = `<ol class="flowline flowline--loop">${D.chain.map((c, i) => `<li style="--c:${U.rgba(K.col(D.colors[i]), 1)}">${c}</li>`).join('')}</ol>`;
      chainEls = [...ctx.el.querySelectorAll('li')];
    },
    enter(ctx) {
      K.base({ org: 'show', ext: true, terrain: 0.6, kicker: D.sub, caption: D.line });
      K.fly(0, 40, 0.32, 2400);
      pool = OM.all().concat(Wd.tagged('orgx'));
      k = 0;
      clearInterval(timer);
      timer = setInterval(() => tick(ctx), 900);
      ctx.tl.at(2000, () => Wd.drift({ z: 0.01 }));
    },
    leave() { clearInterval(timer); },
  });
})();
