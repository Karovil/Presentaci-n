/* ==========================================================================
   EXPIA · MUNDO
   Un único lienzo persistente: el "mapa vivo" de la organización.
   Las escenas no dibujan pantallas; mueven la cámara y cambian el estado
   de nodos y relaciones de este mundo.

   Nodo:  { id, x, y, r, color, alpha→ta, tags, label, sub, fixed, interactive, info }
   Arista:{ a, b, color, alpha→ta, draw→td, width, dash }
   ========================================================================== */
EX.world = (() => {
  const U = EX.u;
  const canvas = document.getElementById('world');
  let ctx, W = 0, H = 0;

  /* ---------- Cámara ---------- */
  const cam = { x: 0, y: 0, z: 1, fly: null, drift: null };
  function flyTo(t, dur = 2200, ease = U.ease.inOut) {
    cam.fly = { from: { x: cam.x, y: cam.y, z: cam.z }, to: { x: cam.x, y: cam.y, z: cam.z, ...t }, t0: performance.now(), dur, ease };
    cam.drift = null;
  }
  function setCam(t) { Object.assign(cam, t); cam.fly = null; }
  /* Deriva lenta (zoom continuo, sensación de "entrar") */
  function drift(d) { cam.drift = d; }

  const project = (x, y) => ({ x: (x - cam.x) * cam.z + W / 2, y: (y - cam.y) * cam.z + H / 2 });
  const unproject = (sx, sy) => ({ x: (sx - W / 2) / cam.z + cam.x, y: (sy - H / 2) / cam.z + cam.y });

  /* ---------- Grafo ---------- */
  let nodes = [];
  let edges = [];
  const byId = new Map();
  let seq = 0;

  function addNode(o) {
    const n = {
      id: o.id || 'n' + seq++,
      x: o.x || 0, y: o.y || 0,
      r: 1.6, color: EX.palette.asset, alpha: 0, ta: 1,
      tags: [], fixed: false, interactive: false,
      labelAlpha: 0, tla: 0, glow: 0, tglow: 0, move: null,
      ...o,
    };
    nodes.push(n);
    byId.set(n.id, n);
    return n;
  }

  function addEdge(a, b, o = {}) {
    const e = { a, b, color: [150, 175, 225], alpha: 0, ta: 0.18, draw: 1, td: 1, width: 0.6, dash: null, tags: [], ...o };
    edges.push(e);
    return e;
  }

  const has = (n, tag) => n.tags.includes(tag);
  const tagged = (tag) => nodes.filter((n) => has(n, tag));
  const get = (id) => byId.get(id);

  /* Mueve un nodo con interpolación */
  function moveNode(n, x, y, dur = 1600, delay = 0, ease = U.ease.inOut) {
    n.move = { fx: n.x, fy: n.y, tx: x, ty: y, t0: performance.now() + delay, dur, ease };
  }

  /* Elimina por etiqueta con desvanecimiento */
  function remove(tag) {
    nodes.forEach((n) => { if (has(n, tag)) { n.ta = 0; n.tla = 0; n.dying = true; } });
    edges.forEach((e) => { if (e.tags.includes(tag) || e.a.dying || e.b.dying) { e.ta = 0; e.dying = true; } });
  }
  function removeNow(tag) {
    nodes = nodes.filter((n) => { if (has(n, tag)) { byId.delete(n.id); return false; } return true; });
    edges = edges.filter((e) => !(e.tags.includes(tag) || has(e.a, tag) || has(e.b, tag)));
  }

  /* ---------- Capas de dibujo de las escenas ---------- */
  const under = new Map();   // se dibujan antes del grafo (terreno, halos)
  const over = new Map();    // después (retículas, pulsos, etiquetas)
  const layer = (name, fn, top = true) => (top ? over : under).set(name, fn);
  const unlayer = (name) => { over.delete(name); under.delete(name); };

  /* Pulsos: anillos que se expanden en pantalla */
  let pulses = [];
  function pulse(target, color = EX.palette.cyan, { r = 120, dur = 1600, width = 1 } = {}) {
    pulses.push({ target, color, r, dur, width, t0: performance.now() });
  }

  /* ---------- Interacción ---------- */
  let hovered = null;
  const hoverFns = [];
  const clickFns = [];
  const onHover = (f) => hoverFns.push(f);
  const onClick = (f) => clickFns.push(f);
  let pointerDirty = false;
  addEventListener('pointermove', () => { pointerDirty = true; }, { passive: true });

  function pick(sx, sy, maxD = 14) {
    let best = null, bd = maxD * maxD;
    for (const n of nodes) {
      if (!n.interactive || n.alpha < 0.25) continue;
      const p = project(n.x, n.y);
      const dx = p.x - sx, dy = p.y - sy, d = dx * dx + dy * dy;
      const rr = Math.max(bd, (n.hitR || 0) ** 2);
      if (d < rr && d < (best ? best.d : Infinity)) best = { n, d };
    }
    return best ? best.n : null;
  }
  canvas.addEventListener('click', (e) => {
    const n = pick(e.clientX, e.clientY);
    if (n && n.onClick) n.onClick(n, e);
    clickFns.forEach((f) => f(n, e));
  });

  /* ---------- Render ---------- */
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const nodeRadius = (n) => (n.fixed ? n.r : n.r * U.clamp(0.55 + 0.45 * Math.sqrt(cam.z), 0.5, 2.6));

  function frame(dt, now) {
    // Cámara
    if (cam.fly) {
      const f = cam.fly;
      const k = U.clamp((now - f.t0) / f.dur, 0, 1), e = f.ease(k);
      // El zoom se interpola en escala logarítmica: el viaje se siente natural
      cam.z = Math.exp(U.lerp(Math.log(f.from.z), Math.log(f.to.z), e));
      cam.x = U.lerp(f.from.x, f.to.x, e);
      cam.y = U.lerp(f.from.y, f.to.y, e);
      if (k >= 1) cam.fly = null;
    } else if (cam.drift) {
      cam.z *= 1 + (cam.drift.z || 0) * dt;
      cam.x += (cam.drift.x || 0) * dt;
      cam.y += (cam.drift.y || 0) * dt;
    }
    // Parallax del puntero: el mapa respira bajo la mano
    const px = -U.pointer.sx * 14 / cam.z, py = -U.pointer.sy * 10 / cam.z;
    const savedX = cam.x, savedY = cam.y;
    cam.x -= px; cam.y -= py;

    // Estado de nodos
    const ka = Math.min(1, dt * 3.2);
    for (const n of nodes) {
      n.alpha += (n.ta - n.alpha) * ka;
      n.labelAlpha += (n.tla - n.labelAlpha) * ka;
      n.glow += (n.tglow - n.glow) * ka;
      if (n.move) {
        const m = n.move, k = U.clamp((now - m.t0) / m.dur, 0, 1);
        if (k > 0) {
          const e = m.ease(k);
          n.x = U.lerp(m.fx, m.tx, e);
          n.y = U.lerp(m.fy, m.ty, e);
        }
        if (k >= 1) n.move = null;
      }
    }
    for (const e of edges) {
      e.alpha += (e.ta - e.alpha) * ka;
      e.draw += (e.td - e.draw) * Math.min(1, dt * (e.drawSpeed || 2.4));
    }
    // Limpieza de lo que terminó de desvanecerse
    if (nodes.some((n) => n.dying && n.alpha < 0.01)) {
      const dead = new Set(nodes.filter((n) => n.dying && n.alpha < 0.01));
      nodes = nodes.filter((n) => { if (dead.has(n)) { byId.delete(n.id); return false; } return true; });
      edges = edges.filter((e) => !dead.has(e.a) && !dead.has(e.b) && !(e.dying && e.alpha < 0.01));
    }

    // Hover
    if (pointerDirty) {
      pointerDirty = false;
      const h = U.pointer.inside ? pick(U.pointer.x, U.pointer.y) : null;
      if (h !== hovered) { hovered = h; canvas.style.cursor = h ? 'pointer' : ''; hoverFns.forEach((f) => f(h)); }
    }

    ctx.clearRect(0, 0, W, H);
    under.forEach((fn) => fn(ctx, now));

    // Aristas
    ctx.lineCap = 'round';
    for (const e of edges) {
      const a = e.alpha * Math.min(e.a.alpha, e.b.alpha) ;
      if (a < 0.004 || e.draw < 0.002) continue;
      const A = project(e.a.x, e.a.y), B = project(e.b.x, e.b.y);
      if (Math.max(A.x, B.x) < -50 || Math.min(A.x, B.x) > W + 50 || Math.max(A.y, B.y) < -50 || Math.min(A.y, B.y) > H + 50) continue;
      const bx = U.lerp(A.x, B.x, e.draw), by = U.lerp(A.y, B.y, e.draw);
      ctx.strokeStyle = U.rgba(e.color, a);
      ctx.lineWidth = e.width;
      ctx.setLineDash(e.dash || []);
      if (e.dashFlow) ctx.lineDashOffset = -now / 40;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      if (e.curve) {
        const mx = (A.x + bx) / 2, my = (A.y + by) / 2;
        const dx = bx - A.x, dy = by - A.y;
        ctx.quadraticCurveTo(mx - dy * e.curve, my + dx * e.curve, bx, by);
      } else ctx.lineTo(bx, by);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    // Nodos
    for (const n of nodes) {
      if (n.alpha < 0.01 || n.hidden) continue;
      const p = project(n.x, n.y);
      if (p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) continue;
      const r = nodeRadius(n);
      const hot = n === hovered;
      if (n.glow > 0.02 || hot) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 7);
        g.addColorStop(0, U.rgba(n.color, 0.35 * Math.max(n.glow, hot ? 0.8 : 0) * n.alpha));
        g.addColorStop(1, U.rgba(n.color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 7, 0, Math.PI * 2);
        ctx.fill();
      }
      if (n.ring) {
        ctx.strokeStyle = U.rgba(n.color, 0.8 * n.alpha);
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(7,9,14,0.92)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = U.rgba(n.color, n.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.6, r * 0.28), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = U.rgba(n.color, n.alpha * (hot ? 1 : 0.85));
        ctx.beginPath();
        ctx.arc(p.x, p.y, hot ? r * 1.6 : r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (n.labelAlpha > 0.01 && n.label) drawLabel(n, p, r);
    }

    // Pulsos
    pulses = pulses.filter((pl) => now - pl.t0 < pl.dur);
    for (const pl of pulses) {
      const k = (now - pl.t0) / pl.dur;
      const t = pl.target;
      const p = project(t.x, t.y);
      ctx.strokeStyle = U.rgba(pl.color, 0.6 * (1 - k));
      ctx.lineWidth = pl.width;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 + U.ease.out(k) * pl.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    over.forEach((fn) => fn(ctx, now));
    cam.x = savedX; cam.y = savedY;
  }

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  function drawLabel(n, p, r) {
    const a = n.labelAlpha * n.alpha;
    const side = n.labelSide || 1;
    const x = p.x + side * (r + 10);
    ctx.textAlign = side > 0 ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.font = `400 ${n.labelSize || 10}px ${MONO}`;
    ctx.fillStyle = U.rgba(n.labelColor || [190, 202, 225], a);
    const label = n.labelUpper === false ? n.label : n.label.toUpperCase();
    // Tracking manual (el canvas no tiene letter-spacing fiable en todos los navegadores)
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
    ctx.fillText(label, x, n.sub ? p.y - 7 : p.y);
    if (n.sub) {
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      ctx.font = `300 ${n.subSize || 13}px "Space Grotesk", system-ui, sans-serif`;
      ctx.fillStyle = U.rgba(n.subColor || [232, 238, 248], a);
      ctx.fillText(n.sub, x, p.y + 10);
    }
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  }

  resize();
  U.onResize(resize);
  new U.Loop(frame).start();

  return {
    cam, flyTo, setCam, drift, project, unproject,
    addNode, addEdge, moveNode, remove, removeNow, tagged, get, has,
    get nodes() { return nodes; }, get edges() { return edges; },
    layer, unlayer, pulse, onHover, onClick, pick,
    get size() { return { W, H }; },
    get hovered() { return hovered; },
  };
})();
