/* ==========================================================================
   FONDO AMBIENTAL
   Polvo de partículas con profundidad y parallax suave. Su densidad visible
   cambia según el "mood" de cada escena.
   ========================================================================== */
IRI.background = (() => {
  const U = IRI.utils;
  const canvas = document.getElementById('bg');
  let ctx, W, H, dust = [];
  let mood = 0.2, target = 0.2;

  function resize() {
    ({ ctx, w: W, h: H } = U.fitCanvas(canvas));
    const n = U.clamp(Math.round((W * H) / 9000), 60, 240);
    dust = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.pow(Math.random(), 1.6),          // profundidad 0 (lejos) – 1 (cerca)
      vx: U.rand(-4, 4),
      vy: U.rand(-6, -1),
      tw: Math.random() * Math.PI * 2,
    }));
  }

  const loop = new U.Loop((dt, now) => {
    mood += (target - mood) * Math.min(1, dt * 1.2);
    ctx.clearRect(0, 0, W, H);
    const t = now / 1000;
    for (const p of dust) {
      p.x += p.vx * dt * (0.3 + p.z);
      p.y += p.vy * dt * (0.3 + p.z);
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
      const px = p.x - U.mouse.sx * (6 + p.z * 26);
      const py = p.y - U.mouse.sy * (4 + p.z * 18);
      const tw = 0.55 + 0.45 * Math.sin(t * 0.8 + p.tw);
      const a = (0.08 + p.z * 0.5) * tw * mood;
      if (a < 0.004) continue;
      ctx.fillStyle = `rgba(180,205,255,${a})`;
      ctx.beginPath();
      ctx.arc(px, py, 0.4 + p.z * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  function setMood(m) {
    target = m;
    document.documentElement.style.setProperty('--grid-alpha', (0.25 + m * 0.75).toFixed(2));
  }

  resize();
  U.onResize(resize);
  loop.start();

  return { setMood };
})();
