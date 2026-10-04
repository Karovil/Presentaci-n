/* ==========================================================================
   ESCENA 19 — EL FUTURO
   Hoy: la identidad humana. Mañana: identidades humanas y no humanas
   orbitando el mismo núcleo de contexto.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.future;
  const S = { steps: 2 };
  IRI.scenes.future = S;

  let el, canvas, ctx, W, H, loop, active = false, t = 0, expand = 0, target = 0;
  const RADII = [0.15, 0.25, 0.34];   // en fracción de min(W, H)

  S.init = (section) => {
    el = section;
    canvas = el.querySelector('canvas');
    const [today, tomorrow] = el.querySelectorAll('.future__col');
    today.querySelector('span').textContent = D.today;
    today.querySelector('p').textContent = D.todayTitle;
    tomorrow.querySelector('span').textContent = D.tomorrow;
    tomorrow.querySelector('p').textContent = D.tomorrowTitle;
    el.querySelector('.future__line').textContent = D.line;
    el.querySelector('.future__end').textContent = D.end;

    // Identidades: anillo 0 (hoy) visible desde el inicio; 1 y 2 en el paso 2
    const cosmos = el.querySelector('.cosmos');
    cosmos.innerHTML = `<div class="cosmos__core">${U.icon('user')}</div>` +
      D.rings.map((ring, r) => ring.items.map((it, i) => {
        const a = (-90 + r * 38 + i * 180 + (r === 2 ? 25 : 0)) * (Math.PI / 180);
        return `<div class="ident r${r}" data-r="${r}" style="--a:${a};--delay:${(0.2 + r * 0.5 + i * 0.2).toFixed(2)}s">
          <span class="ident__dot">${U.icon(it.icon)}</span>
          <span class="ident__label">${it.label}</span>
          <span class="ident__ring">${ring.label}</span>
        </div>`;
      }).join('')).join('');
    loop = new U.Loop(frame);
    U.onResize(() => { if (active) place(); });
  };

  // Posiciona cada identidad sobre su órbita
  function place() {
    ({ ctx, w: W, h: H } = U.fitCanvas(canvas));
    const m = Math.min(W, H);
    el.querySelectorAll('.ident').forEach((n) => {
      const r = +n.dataset.r, a = parseFloat(n.style.getPropertyValue('--a'));
      n.style.left = `${W / 2 + Math.cos(a) * RADII[r] * m * 1.35}px`;
      n.style.top = `${H * 0.52 + Math.sin(a) * RADII[r] * m}px`;
    });
  }

  function frame(dt) {
    t += dt;
    expand += (target - expand) * Math.min(1, dt * 1.2);
    ctx.clearRect(0, 0, W, H);
    const m = Math.min(W, H), cx = W / 2, cy = H * 0.52;
    RADII.forEach((R, r) => {
      const vis = r === 0 ? 1 : U.clamp(expand * 2 - (r - 1) * 0.6, 0, 1);
      if (vis <= 0) return;
      ctx.strokeStyle = r === 0 ? `rgba(98,230,255,${0.35 * vis})` : `rgba(150,180,235,${0.16 * vis})`;
      ctx.setLineDash(r === 2 ? [2, 6] : []);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * m * 1.35, R * m, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Pulsos que recorren cada órbita
      for (let k = 0; k < 3; k++) {
        const a = t * (0.25 - r * 0.06) + (k / 3) * Math.PI * 2 + r;
        ctx.fillStyle = `rgba(200,240,255,${0.7 * vis})`;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * R * m * 1.35, cy + Math.sin(a) * R * m, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.setLineDash([]);
  }

  S.enter = () => {
    active = true;
    t = 0;
    expand = target = 0;
    place();
    loop.start();
  };
  S.setStep = (n) => { target = n >= 1 ? 1 : 0; };
  S.leave = () => {
    active = false;
    setTimeout(() => { if (!active) loop.stop(); }, 1600);
  };
})();
