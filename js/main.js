/* ==========================================================================
   ARRANQUE
   Parallax global, luz que sigue al cursor, reloj del HUD e inicio del controlador.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const root = document.documentElement;

  // Parallax suavizado: --pnx / --pny (-1..1) alimentan a todo elemento .px
  new U.Loop((dt) => {
    const m = U.mouse;
    const k = Math.min(1, dt * 3);
    m.sx += (m.nx - m.sx) * k;
    m.sy += (m.ny - m.sy) * k;
    root.style.setProperty('--pnx', m.sx.toFixed(4));
    root.style.setProperty('--pny', m.sy.toFixed(4));
    root.style.setProperty('--mx', m.x.toFixed(1) + 'px');
    root.style.setProperty('--my', m.y.toFixed(1) + 'px');
  }).start();

  // Reloj en vivo del HUD.
  const clock = document.querySelector('[data-clock]');
  const tick = () => {
    const d = new Date();
    clock.textContent = `${U.pad2(d.getHours())}:${U.pad2(d.getMinutes())}:${U.pad2(d.getSeconds())}`;
  };
  tick();
  setInterval(tick, 1000);

  const boot = () => IRI.controller.init();
  // Espera a las fuentes para que las medidas de texto sean correctas.
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(boot);
  } else {
    boot();
  }
})();
