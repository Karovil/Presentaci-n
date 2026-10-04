/* ==========================================================================
   ESCENA 04 — LAS PIEZAS ESTÁN SEPARADAS
   Seis "universos" de información. Cada uno genera actividad propia, intenta
   alcanzar a los demás y nunca lo logra. Al pasar el cursor, cada fuente
   cuenta qué sabe y qué no sabe.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.silos;
  const S = { steps: 1 };
  IRI.scenes.silos = S;

  let el, canvas, ctx, W, H, wrap, card, loop, islands = [], gaps = [], packets = [];
  let active = false, focus = -1, t = 0;

  S.init = (section) => {
    el = section;
    canvas = el.querySelector('canvas');
    wrap = el.querySelector('.islands');
    card = el.querySelector('.card');
    el.querySelector('.statement').textContent = D.statement;

    wrap.innerHTML = D.sources.map((s, i) => `
      <div class="island${s.alert ? ' island--alert' : ''}" data-i="${i}"
           style="left:${s.x}%;top:${s.y}%;--fx:${(50 - s.x).toFixed(1)}vw;--fy:${(50 - s.y).toFixed(1)}vh;--delay:${(0.5 + i * 0.12).toFixed(2)}s">
        <div class="island__field">
          <i class="island__ring"></i>
          <i class="island__orbit o1"><b></b><b></b></i>
          <i class="island__orbit o2"><b></b><b></b><b></b></i>
          <i class="island__orbit o3"><b></b></i>
          <i class="island__ping"></i>
        </div>
        <div class="island__core">${U.icon(s.icon)}</div>
        <div class="island__label">${s.title}</div>
        <div class="island__meta">${s.events}</div>
      </div>`).join('');
    islands = [...wrap.children];

    islands.forEach((n, i) => {
      n.addEventListener('pointerenter', () => setFocus(i));
      n.addEventListener('pointerleave', () => setFocus(-1));
      n.addEventListener('click', () => setFocus(focus === i ? -1 : i));   // táctil
    });

    const key = Object.fromEntries(D.sources.map((s, i) => [s.key, i]));
    gaps = D.gaps.map(([a, b]) => ({ a: key[a], b: key[b] }));

    loop = new U.Loop(frame);
    U.onResize(() => { if (active) resize(); });
  };

  function setFocus(i) {
    focus = i;
    el.classList.toggle('has-focus', i >= 0);
    islands.forEach((n, k) => n.classList.toggle('is-focus', k === i));
    if (i < 0) { card.classList.remove('is-on'); return; }
    const s = D.sources[i];
    card.innerHTML = `
      <div class="card__head"><span class="card__ico">${U.icon(s.icon)}</span><span>${s.title}</span></div>
      <p class="card__desc">${s.desc}</p>
      <div class="card__row"><span class="card__k">${D.knowsLabel}</span><span class="card__v">${s.knows}</span></div>
      <div class="card__row card__row--miss"><span class="card__k">${D.missesLabel}</span><span class="card__v">${s.misses}</span></div>`;
    card.classList.toggle('card--alert', !!s.alert);
    // La tarjeta se ubica al lado más despejado de la fuente
    const r = islands[i].getBoundingClientRect();
    const right = r.left + r.width / 2 < innerWidth * 0.6;
    card.style.left = right ? `${r.left + r.width / 2 + 90}px` : '';
    card.style.right = right ? '' : `${innerWidth - (r.left + r.width / 2) + 90}px`;
    card.style.top = `${U.clamp(r.top + r.height / 2 - 90, 90, innerHeight - 260)}px`;
    card.classList.remove('is-on');
    void card.offsetWidth;   // reinicia la animación de entrada
    card.classList.add('is-on');
  }

  function resize() { ({ ctx, w: W, h: H } = U.fitCanvas(canvas)); }

  const center = (i) => ({ x: (D.sources[i].x / 100) * W, y: (D.sources[i].y / 100) * H });

  function frame(dt) {
    t += dt;
    ctx.clearRect(0, 0, W, H);
    const reveal = U.clamp((t - 1.6) / 1.4, 0, 1);
    if (reveal <= 0) return;

    // Puentes rotos: cada fuente se estira hacia otra y se apaga a mitad de camino
    for (const g of gaps) {
      const A = center(g.a), B = center(g.b);
      const dim = focus >= 0 && focus !== g.a && focus !== g.b ? 0.3 : 1;
      const hot = focus === g.a || focus === g.b ? 1.8 : 1;
      drawStub(A, B, reveal * dim * hot);
      drawStub(B, A, reveal * dim * hot);
      // Gap marker en el punto medio
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      ctx.strokeStyle = `rgba(150,175,225,${0.4 * reveal * dim})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const ang = Math.atan2(B.y - A.y, B.x - A.x) + Math.PI / 2;
      ctx.moveTo(mx + Math.cos(ang) * 4, my + Math.sin(ang) * 4);
      ctx.lineTo(mx - Math.cos(ang) * 4, my - Math.sin(ang) * 4);
      ctx.stroke();
    }

    // Paquetes que salen de una fuente y se pierden antes de llegar
    if (Math.random() < dt * 5 * reveal) {
      const g = U.pick(gaps);
      const flip = Math.random() < 0.5;
      packets.push({ from: flip ? g.b : g.a, to: flip ? g.a : g.b, k: 0, sp: U.rand(0.18, 0.3) });
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.k += dt * p.sp;
      if (p.k > 0.42) { packets.splice(i, 1); continue; }
      const A = center(p.from), B = center(p.to);
      const x = U.lerp(A.x, B.x, p.k), y = U.lerp(A.y, B.y, p.k);
      const a = Math.sin((p.k / 0.42) * Math.PI) * 0.85;
      const alert = D.sources[p.from].alert;
      ctx.fillStyle = alert ? `rgba(255,74,92,${a})` : `rgba(160,230,255,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStub(A, B, alpha) {
    const ex = U.lerp(A.x, B.x, 0.44), ey = U.lerp(A.y, B.y, 0.44);
    const sx = U.lerp(A.x, B.x, 0.12), sy = U.lerp(A.y, B.y, 0.12);
    const g = ctx.createLinearGradient(sx, sy, ex, ey);
    g.addColorStop(0, `rgba(150,180,235,${0.5 * alpha})`);
    g.addColorStop(1, 'rgba(150,180,235,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  S.enter = () => {
    active = true;
    t = 0;
    packets = [];
    setFocus(-1);
    resize();
    loop.start();
  };

  S.leave = () => {
    active = false;
    setFocus(-1);
    setTimeout(() => { if (!active) loop.stop(); }, 1600);
  };
})();
