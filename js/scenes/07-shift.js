/* ==========================================================================
   ESCENA 07 — EL CAMBIO
   Paso 1: fragmentos dispersos, cuatro fuentes aisladas.
   Paso 2: las fuentes se enlazan una a una; cada fragmento viaja por su
           fuente y encuentra su órbita alrededor de la identidad.
   Paso 3: IDENTIDAD + CONTEXTO = RIESGO.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.shift;
  const S = { steps: 3 };
  IRI.scenes.shift = S;

  let el, canvas, ctx, W, H, CX, CY, scale = 1, loop;
  let srcEls = [], chainEls = [], nucleus;
  let parts = [], linked = [], pulses = [], t = 0, active = false, order = 0, orderTarget = 0, risk = 0, riskTarget = 0;
  const tl = new U.Timeline();
  const RINGS = [96, 134, 176, 222];
  const RING_SPEED = [0.22, -0.15, 0.1, -0.07];
  const N = 300;
  const LINK_GAP = 750;   // ms entre enlaces

  S.init = (section) => {
    el = section;
    canvas = el.querySelector('canvas');
    nucleus = el.querySelector('.nucleus');
    el.querySelector('.caption .swap__a').textContent = D.captions[0];
    el.querySelector('.caption .swap__b').textContent = D.captions[1];

    const srcWrap = el.querySelector('.sources');
    srcWrap.innerHTML = D.sources.map((s, i) => `
      <div class="src${s.alert ? ' src--alert' : ''}" style="left:${s.x}%;top:${s.y}%;--delay:${(0.6 + i * 0.15).toFixed(2)}s">
        <div class="src__dot">${U.icon(s.icon)}</div>
        <div class="src__label">${s.label}</div>
      </div>`).join('');
    srcEls = [...srcWrap.children];

    const chain = el.querySelector('.chain');
    chain.innerHTML = [...D.sources.map((s) => s.label), D.chainEnd]
      .map((l, i, a) => `<li class="${i === a.length - 1 ? 'is-end' : ''}">${l}</li>`).join('');
    chainEls = [...chain.children];

    loop = new U.Loop(frame);
    U.onResize(() => { if (active) resize(); });
  };

  function resize() {
    ({ ctx, w: W, h: H } = U.fitCanvas(canvas));
    CX = W / 2;
    CY = H * 0.48;
    scale = U.clamp(Math.min(W / 1600, H / 900), 0.55, 1.4);
  }

  const srcPos = (i) => ({ x: (D.sources[i].x / 100) * W, y: (D.sources[i].y / 100) * H });

  function seed() {
    parts = [];
    for (let i = 0; i < N; i++) {
      // Ranuras: más partículas en los anillos exteriores
      const ring = i < 40 ? 0 : i < 100 ? 1 : i < 190 ? 2 : 3;
      parts.push({
        x: U.rand(0.04, 0.96) * W,
        y: U.rand(0.06, 0.94) * H,
        vx: U.rand(-20, 20), vy: U.rand(-20, 20),
        g: i % 4,
        ring,
        ang: Math.random() * Math.PI * 2,
        rj: U.rand(-5, 5),
        mode: 'chaos',
        r: U.rand(0.7, 1.6),
      });
    }
  }

  function slotPos(p) {
    const a = p.ang + RING_SPEED[p.ring] * t;
    const R = (RINGS[p.ring] + p.rj) * scale;
    return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R * 0.92 };
  }

  function link(g) {
    linked[g] = true;
    srcEls[g].classList.add('is-linked');
    chainEls[g].classList.add('is-on');
    for (const p of parts) {
      if (p.g !== g || p.mode !== 'chaos') continue;
      p.mode = 'fly';
      p.t0 = t + U.rand(0, 0.9);
      p.dur = U.rand(1.5, 2.4);
      p.p0 = null;
    }
    for (let k = 0; k < 3; k++) pulses.push({ g, k: k / 3, sp: U.rand(0.35, 0.5) });
  }

  function converge() {
    tl.clear();
    D.sources.forEach((_, g) => { if (!linked[g]) tl.at(300 + g * LINK_GAP, () => link(g)); });
    tl.at(300 + D.sources.length * LINK_GAP + 400, () => {
      chainEls[chainEls.length - 1].classList.add('is-on');
      nucleus.classList.add('is-lit');
      orderTarget = 1;
    });
  }

  function scatter() {
    tl.clear();
    linked = [];
    pulses = [];
    orderTarget = 0;
    for (const p of parts) { p.mode = 'chaos'; p.vx = U.rand(-60, 60); p.vy = U.rand(-60, 60); }
    srcEls.forEach((s) => s.classList.remove('is-linked'));
    chainEls.forEach((c) => c.classList.remove('is-on'));
    nucleus.classList.remove('is-lit');
  }

  function frame(dt) {
    t += dt;
    order += (orderTarget - order) * Math.min(1, dt * 1.5);
    risk += (riskTarget - risk) * Math.min(1, dt * 1.2);
    ctx.clearRect(0, 0, W, H);

    // Anillos-guía de la estructura (aparecen con el orden)
    if (order > 0.01) {
      ctx.lineWidth = 1;
      RINGS.forEach((R, i) => {
        ctx.strokeStyle = i === 0
          ? `rgba(98,230,255,${(0.1 + risk * 0.25) * order})`
          : `rgba(150,180,235,${0.07 * order})`;
        ctx.beginPath();
        ctx.ellipse(CX, CY, R * scale, R * scale * 0.92, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    // Enlaces fuente → identidad
    D.sources.forEach((s, g) => {
      if (!linked[g]) return;
      const A = srcPos(g);
      const grad = ctx.createLinearGradient(A.x, A.y, CX, CY);
      const c = s.alert ? '255,74,92' : '98,230,255';
      grad.addColorStop(0, `rgba(${c},0.05)`);
      grad.addColorStop(0.5, `rgba(${c},${0.28 + risk * 0.2})`);
      grad.addColorStop(1, `rgba(${c},0.0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(CX, CY);
      ctx.stroke();
    });
    for (const p of pulses) {
      p.k = (p.k + dt * p.sp) % 1;
      const A = srcPos(p.g);
      const k = U.ease.inOutSine(p.k);
      const x = U.lerp(A.x, CX, k), y = U.lerp(A.y, CY, k);
      const a = Math.sin(p.k * Math.PI);
      ctx.fillStyle = D.sources[p.g].alert ? `rgba(255,74,92,${a})` : `rgba(160,240,255,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fragmentos
    for (const p of parts) {
      let x, y, a = 0.55;
      if (p.mode === 'chaos') {
        p.vx += U.rand(-60, 60) * dt;
        p.vy += U.rand(-60, 60) * dt;
        p.vx *= Math.pow(0.6, dt);
        p.vy *= Math.pow(0.6, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        x = p.x; y = p.y; a = 0.4;
      } else if (p.mode === 'fly') {
        if (t < p.t0) { x = p.x; y = p.y; a = 0.4; }
        else {
          if (!p.p0) p.p0 = { x: p.x, y: p.y };
          const k = U.clamp((t - p.t0) / p.dur, 0, 1);
          const e = U.ease.inOutCubic(k);
          const S0 = srcPos(p.g);
          const ctrl = { x: U.lerp(S0.x, CX, 0.25), y: U.lerp(S0.y, CY, 0.25) };
          const end = slotPos(p);
          const u = 1 - e;
          x = u * u * p.p0.x + 2 * u * e * ctrl.x + e * e * end.x;
          y = u * u * p.p0.y + 2 * u * e * ctrl.y + e * e * end.y;
          a = 0.4 + e * 0.5;
          if (k >= 1) p.mode = 'orbit';
          // Estela
          ctx.strokeStyle = `rgba(160,220,255,${0.18 * Math.sin(k * Math.PI)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          p.x = x; p.y = y;
        }
      } else {
        const s = slotPos(p);
        x = p.x = s.x; y = p.y = s.y;
        a = p.ring === 0 ? 0.95 : 0.75;
      }
      const alert = D.sources[p.g].alert;
      const tint = p.mode === 'orbit' && p.ring === 0;
      ctx.fillStyle = alert
        ? `rgba(255,90,105,${a})`
        : tint ? `rgba(140,235,255,${a})` : `rgba(210,225,255,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  S.enter = () => {
    active = true;
    resize();
    seed();
    t = 0;
    order = orderTarget = 0;
    risk = riskTarget = 0;
    scatter();
    el.classList.remove('is-risk');
    loop.start();
  };

  S.setStep = (n) => {
    if (n === 0) { scatter(); riskTarget = 0; }
    if (n >= 1 && !nucleus.classList.contains('is-lit') && !linked.some(Boolean)) converge();
    riskTarget = n >= 2 ? 1 : 0;
    if (n >= 2 && !nucleus.classList.contains('is-lit')) {
      // Si se avanza rápido, completa la convergencia
      tl.clear();
      D.sources.forEach((_, g) => { if (!linked[g]) link(g); });
      chainEls.forEach((c) => c.classList.add('is-on'));
      nucleus.classList.add('is-lit');
      orderTarget = 1;
    }
  };

  S.leave = () => {
    active = false;
    tl.clear();
    setTimeout(() => { if (!active) loop.stop(); }, 1600);
  };
})();
