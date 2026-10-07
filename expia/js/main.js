/* ==========================================================================
   EXPIA · ARRANQUE
   ========================================================================== */
(() => {
  const U = EX.u;
  // Puntero suavizado (parallax del mapa)
  new U.Loop((dt) => {
    const p = U.pointer, k = Math.min(1, dt * 2.5);
    p.sx += (p.nx - p.sx) * k;
    p.sy += (p.ny - p.sy) * k;
  }).start();

  const boot = () => EX.ctrl.init();
  if (document.fonts && document.fonts.load) {
    // El lienzo dibuja texto: las fuentes deben estar cargadas antes de empezar
    const fonts = Promise.all([
      document.fonts.load('400 10px "IBM Plex Mono"'),
      document.fonts.load('500 10px "IBM Plex Mono"'),
      document.fonts.load('300 13px "Space Grotesk"'),
      document.fonts.ready,
    ]);
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(boot);
  } else boot();
})();
