/* ==========================================================================
   ESCENA 09 — LA ALERTA
   La identidad sigue en el centro, en calma. Una señal roja nace en el borde
   de la red, salta de nodo en nodo y la alcanza.
   NORMAL → INVESTIGATION REQUIRED → RISK DETECTED · CASE #IR-2047
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.alert;
  const S = { steps: 2 };
  IRI.scenes.alert = S;

  let el, canvas, ctx, W, H, CX, CY, loop, stateK, stateV, sentinel;
  let nodes = [], edges = [], path = [], sig = null, shock = null, hot = new Map();
  let t = 0, active = false, arrived = false;
  const tl = new U.Timeline();
  const HOP_SPEED = 520;   // px/s de la señal

  S.init = (section) => {
    el = section;
    canvas = el.querySelector('canvas');
    sentinel = el.querySelector('.sentinel');
    el.querySelector('.sentinel__body').innerHTML = U.icon('user');
    stateK = el.querySelector('.sentinel__k');
    stateV = el.querySelector('.sentinel__v');
    stateK.textContent = D.stateLabel;
    el.querySelector('.swap__a').textContent = D.lines[0];
    el.querySelector('.swap__b').textContent = D.lines[1];
    el.querySelector('.detect__a').textContent = D.detected;
    el.querySelector('.detect__case').innerHTML = `Caso #${IRI.data.caseId} <em>${D.created}</em>`;
    loop = new U.Loop(frame);
    U.onResize(() => { if (active) { resize(); build(); } });
  };

  function resize() {
    ({ ctx, w: W, h: H } = U.fitCanvas(canvas));
    CX = W / 2;
    CY = H / 2;
  }

  /* Red: nodos dispersos + enlaces a los vecinos más cercanos */
  function build() {
    const n = U.clamp(Math.round((W * H) / 16000), 50, 120);
    nodes = [{ x: CX, y: CY, core: true }];
    let guard = 0;
    while (nodes.length < n && guard++ < 4000) {
      const x = U.rand(0.03, 0.97) * W, y = U.rand(0.06, 0.94) * H;
      if (Math.hypot(x - CX, y - CY) < 120) continue;
      if (nodes.some((o) => Math.hypot(o.x - x, o.y - y) < 60)) continue;
      nodes.push({ x, y, r: U.rand(0.8, 1.7), ph: Math.random() * 6.28 });
    }
    edges = [];
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
        .filter((o) => o.j !== i)
        .sort((p, q) => p.d - q.d)
        .slice(0, a.core ? 6 : 3);
      near.forEach(({ j }) => { if (!edges.some((e) => (e.a === j && e.b === i))) edges.push({ a: i, b: j }); });
    });
    nodes.forEach((nd, i) => { nd.adj = edges.filter((e) => e.a === i || e.b === i).map((e) => (e.a === i ? e.b : e.a)); });
  }

  /* Camino codicioso desde un nodo lejano hasta la identidad */
  function route() {
    const far = nodes
      .map((nd, i) => ({ i, d: Math.hypot(nd.x - CX, nd.y - CY), nd }))
      .filter((o) => o.nd.x > W * 0.62 && o.nd.y < H * 0.4)
      .sort((p, q) => q.d - p.d);
    let cur = (far[0] || { i: nodes.length - 1 }).i;
    const out = [cur];
    for (let k = 0; k < 30 && cur !== 0; k++) {
      const here = nodes[cur];
      const dHere = Math.hypot(here.x - CX, here.y - CY);
      let best = -1, bestD = dHere;
      for (const j of here.adj) {
        const dj = Math.hypot(nodes[j].x - CX, nodes[j].y - CY);
        if (dj < bestD - 8) { bestD = dj; best = j; }
      }
      if (best < 0) { out.push(0); break; }
      out.push(best);
      cur = best;
    }
    if (out[out.length - 1] !== 0) out.push(0);
    return out;
  }

  function launch() {
    path = route();
    sig = { seg: 0, k: 0, born: t };
  }

  function arrive() {
    if (arrived) return;
    arrived = true;
    sig = null;
    shock = t;
    sentinel.classList.add('is-hit');
    el.classList.add('is-hit');
    setState(1);
  }

  function setState(i) {
    stateV.textContent = D.states[i];
    sentinel.dataset.state = i;
  }

  function frame(dt) {
    t += dt;
    ctx.clearRect(0, 0, W, H);
    const reveal = U.clamp(t / 1.4, 0, 1);
    const ox = -U.mouse.sx * 8, oy = -U.mouse.sy * 6;

    // Enlaces
    ctx.lineWidth = 0.6;
    for (const e of edges) {
      const A = nodes[e.a], B = nodes[e.b];
      const key = e.a < e.b ? e.a + '-' + e.b : e.b + '-' + e.a;
      const h = hot.get(key) || 0;
      if (h > 0) hot.set(key, Math.max(0, h - dt * 0.5));
      ctx.strokeStyle = h > 0.02
        ? `rgba(255,74,92,${0.12 + h * 0.6})`
        : `rgba(140,170,230,${0.1 * reveal})`;
      ctx.beginPath();
      ctx.moveTo(A.x + ox, A.y + oy);
      ctx.lineTo(B.x + ox, B.y + oy);
      ctx.stroke();
    }
    // Nodos
    for (const nd of nodes) {
      if (nd.core) continue;
      const a = (0.25 + 0.25 * Math.sin(t * 0.9 + nd.ph)) * reveal;
      ctx.fillStyle = `rgba(205,222,255,${a})`;
      ctx.beginPath();
      ctx.arc(nd.x + ox, nd.y + oy, nd.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Señal en tránsito
    if (sig) {
      const A = nodes[path[sig.seg]], B = nodes[path[sig.seg + 1]];
      const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
      sig.k += (dt * HOP_SPEED) / len;
      const key = path[sig.seg] < path[sig.seg + 1] ? path[sig.seg] + '-' + path[sig.seg + 1] : path[sig.seg + 1] + '-' + path[sig.seg];
      hot.set(key, 1);
      if (sig.k >= 1) {
        sig.seg++;
        sig.k = 0;
        if (sig.seg >= path.length - 1) arrive();
      }
      if (sig) {
        const x = U.lerp(A.x, B.x, Math.min(1, sig.k)) + ox, y = U.lerp(A.y, B.y, Math.min(1, sig.k)) + oy;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 22);
        g.addColorStop(0, 'rgba(255,74,92,0.55)');
        g.addColorStop(1, 'rgba(255,74,92,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff6a78';
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        // Origen: pequeño destello que se desvanece
        const o = nodes[path[0]], age = t - sig.born;
        if (age < 1.6) {
          ctx.strokeStyle = `rgba(255,74,92,${0.6 * (1 - age / 1.6)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(o.x + ox, o.y + oy, 4 + age * 30, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // Onda de impacto al llegar a la identidad
    if (shock !== null) {
      const k = (t - shock) / 2.2;
      if (k > 1) shock = null;
      else {
        for (let r = 0; r < 2; r++) {
          const kk = U.clamp(k - r * 0.18, 0, 1);
          ctx.strokeStyle = `rgba(255,74,92,${0.5 * (1 - kk)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(CX, CY, 40 + U.ease.outCubic(kk) * Math.max(W, H) * 0.45, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }

  S.enter = () => {
    active = true;
    arrived = false;
    sig = null;
    shock = null;
    hot = new Map();
    t = 0;
    sentinel.classList.remove('is-hit');
    el.classList.remove('is-hit');
    setState(0);
    resize();
    build();
    loop.start();
    tl.at(2600, launch);
  };

  // Antes del impacto, avanzar hace llegar la señal.
  S.onNext = () => {
    if (arrived) return false;
    tl.clear();
    if (!sig) launch();
    arrive();
    return true;
  };

  S.setStep = (n) => {
    if (n >= 1) { S.onNext(); setState(2); }
    else if (arrived) setState(1);
  };

  S.leave = () => {
    active = false;
    tl.clear();
    setTimeout(() => { if (!active) loop.stop(); }, 1600);
  };
})();
