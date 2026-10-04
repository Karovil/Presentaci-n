/* ==========================================================================
   ESCENA 14 — AUTOMATIZACIÓN
   El caso dispara un flujo automático. Las señales de todas las fuentes
   recorren cuatro etapas: recopila → organiza → relaciona → contexto.
   El reloj corre en minutos, no en días.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.automation;
  const S = { steps: 1 };
  IRI.scenes.automation = S;

  let el, canvas, ctx, W, H, loop, stageEls = [], trigger, clock, evCount, ctxCount;
  let parts = [], t = 0, spawned = 0, absorbed = 0, active = false, done = false, lit = 0;
  const TOTAL = 320;            // partículas que se lanzan
  const SPEED = 0.115;          // avance por segundo a lo largo del flujo
  const SIM = 19;               // 1 s real = 19 s simulados (≈ 5 min al completar)

  // Geometría relativa (0–1)
  const SRC_X = 0.13, STAGE_X = [0.33, 0.5, 0.67, 0.84], CY = 0.56;
  const srcY = (i) => 0.38 + i * 0.072;

  S.init = (section) => {
    el = section;
    canvas = el.querySelector('canvas');
    el.querySelector('.statement').textContent = D.statement;
    trigger = el.querySelector('.trigger');
    trigger.innerHTML = `<span class="trigger__dot"></span><span>Caso #${IRI.data.caseId}</span><i></i><span class="trigger__on">${D.trigger}</span>`;

    el.querySelector('.pipeline').innerHTML =
      D.sources.map((s, i) => `<span class="psrc" style="left:${SRC_X * 100}%;top:${srcY(i) * 100}%">${s}</span>`).join('') +
      D.stages.map((s, i) => `
        <div class="stage" style="left:${STAGE_X[i] * 100}%;top:${CY * 100}%">
          <i class="stage__node"></i>
          <span class="stage__n">${U.pad2(i + 1)}</span>
          <p class="stage__label">${s.label}</p>
          <p class="stage__sub">${s.sub}</p>${i === D.stages.length - 1 ? `<p class="stage__ready">${D.ready}</p>` : ''}
        </div>`).join('');
    stageEls = [...el.querySelectorAll('.stage')];

    el.querySelector('.auto__readout').innerHTML = `
      <div><span>${D.elapsedLabel}</span><strong data-clock>00:00</strong></div>
      <div><span>${D.eventsLabel}</span><strong data-ev>0</strong></div>
      <div><span>Contexto</span><strong data-ctx>0</strong></div>`;
    clock = el.querySelector('[data-clock]');
    evCount = el.querySelector('[data-ev]');
    ctxCount = el.querySelector('[data-ctx]');

    loop = new U.Loop(frame);
    U.onResize(() => { if (active) resize(); });
  };

  function resize() { ({ ctx, w: W, h: H } = U.fitCanvas(canvas)); }

  function spawn() {
    const src = (Math.random() * D.sources.length) | 0;
    parts.push({
      u: 0,
      src,
      jit: U.rand(-1, 1),
      ph: Math.random() * 6.28,
      lane: (Math.random() * 3) | 0,
      dup: Math.random() < 0.3,       // duplicados que desaparecen al organizar
      alert: D.sources[src] === 'Alerta',
      sp: SPEED * U.rand(0.92, 1.08),
    });
    spawned++;
  }

  // Posición de una partícula según su avance u (0 → fuente, 1 → contexto)
  const segU = [0, 0.24, 0.48, 0.72, 1];
  const xs = () => [SRC_X, ...STAGE_X];
  function pos(p) {
    const X = xs();
    let k = 0;
    while (k < 3 && p.u > segU[k + 1]) k++;
    const f = (p.u - segU[k]) / (segU[k + 1] - segU[k]);
    const x = U.lerp(X[k], X[k + 1], f) * W;
    const cy = CY * H;
    const laneY = cy + (p.lane - 1) * 20;
    const mess = cy + p.jit * 70 + Math.sin(t * 3 + p.ph) * 10;
    let y;
    if (k === 0) y = U.lerp(srcY(p.src) * H, cy + p.jit * 30, U.ease.inOutSine(f));
    else if (k === 1) y = U.lerp(cy + p.jit * 30, mess, Math.sin(f * Math.PI)) * 1;
    else if (k === 2) y = U.lerp(cy + p.jit * 30, laneY, Math.min(1, f * 3));
    else y = U.lerp(laneY, cy, U.ease.inOutCubic(f));
    return { x, y, k, f };
  }

  function frame(dt) {
    t += dt;
    ctx.clearRect(0, 0, W, H);
    const X = xs();
    const cy = CY * H;

    if (t > 1.2 && spawned < TOTAL) {
      const n = Math.min(TOTAL - spawned, Math.ceil(dt * 46));
      for (let i = 0; i < n; i++) spawn();
    } else if (done && Math.random() < dt * 6) {
      spawn();   // el flujo sigue vivo, en calma, una vez construido el contexto
    }

    // Columna vertebral del flujo
    ctx.strokeStyle = 'rgba(150,180,235,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(X[1] * W, cy);
    ctx.lineTo(X[4] * W, cy);
    ctx.stroke();
    // Carriles ordenados entre "organiza" y "relaciona"
    if (lit >= 2) {
      ctx.strokeStyle = 'rgba(98,230,255,0.08)';
      for (let l = -1; l <= 1; l++) {
        ctx.beginPath();
        ctx.moveTo(X[2] * W, cy + l * 20);
        ctx.lineTo(X[3] * W, cy + l * 20);
        ctx.stroke();
      }
    }

    const prevByLane = [null, null, null];
    let hiStage = lit;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.u += dt * p.sp;
      if (p.dup && p.u > segU[2] + 0.02) { parts.splice(i, 1); continue; }
      if (p.u >= 1) { parts.splice(i, 1); absorbed++; continue; }
      const q = pos(p);
      hiStage = Math.max(hiStage, q.k);
      let a = 0.75;
      if (p.dup && q.k === 1) a = 0.75 * (1 - q.f * 0.6);
      const color = p.alert ? `rgba(255,90,105,${a})` : q.k >= 2 ? `rgba(150,235,255,${a})` : `rgba(210,225,255,${a})`;
      // Relaciones: enlaces entre vecinos del mismo carril
      if (q.k === 3) {
        const prev = prevByLane[p.lane];
        if (prev && Math.abs(prev.x - q.x) < 60) {
          ctx.strokeStyle = 'rgba(98,230,255,0.22)';
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
        prevByLane[p.lane] = q;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.k >= 2 ? 1.8 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Etapas que se encienden cuando llega la primera señal
    while (lit < hiStage + 1 && lit < 4) { stageEls[lit].classList.add('is-on'); lit++; }
    if (absorbed > 0 && lit < 4) { stageEls[3].classList.add('is-on'); lit = 4; }

    // Contexto: anillo que se completa con lo absorbido
    const fill = U.clamp(absorbed / (TOTAL * 0.7), 0, 1);
    if (absorbed > 0) {
      const cx = X[4] * W;
      for (let k = 0; k < 28; k++) {
        const ang = (k / 28) * Math.PI * 2 + t * 0.4;
        const on = k / 28 < fill;
        ctx.fillStyle = on ? 'rgba(98,230,255,0.9)' : 'rgba(150,180,235,0.15)';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * 38, cy + Math.sin(ang) * 38, on ? 1.8 : 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Medidores
    if (!done) {
      const sim = Math.max(0, t - 1.2) * SIM;
      clock.textContent = `${U.pad2(Math.floor(sim / 60))}:${U.pad2(Math.floor(sim % 60))}`;
      evCount.textContent = (spawned * 5).toLocaleString('es-CO');
      ctxCount.textContent = Math.round(fill * 47);
      if (spawned >= TOTAL && parts.every((p) => p.u < 0.05 || p.dup)) {
        done = true;
        el.classList.add('is-complete');
      }
    }
  }

  S.enter = () => {
    active = true;
    parts = [];
    t = 0;
    spawned = absorbed = lit = 0;
    done = false;
    el.classList.remove('is-complete');
    stageEls.forEach((s) => s.classList.remove('is-on'));
    clock.textContent = '00:00';
    evCount.textContent = '0';
    ctxCount.textContent = '0';
    resize();
    loop.start();
  };

  S.leave = () => {
    active = false;
    setTimeout(() => { if (!active) loop.stop(); }, 1600);
  };
})();
