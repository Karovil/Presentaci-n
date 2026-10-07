/* ==========================================================================
   EXPIA · KIT DE ESCENAS
   Piezas reutilizables para construir escenas sobre el mismo mundo:
   - K.scene()   registro de escena con limpieza automática
   - K.base()    estado de partida (mapa, núcleo, agentes, terreno)
   - K.node()    nodos etiquetados con la escena
   - K.stream()  partículas que fluyen entre puntos o a lo largo de rutas
   - K.msg()     mensajes que viajan entre nodos (con texto)
   - K.ring()    límites/anillos en coordenadas del mundo
   - K.chain()   cadenas de nodos que se construyen en secuencia
   - EX.say      frases grandes y contundentes
   ========================================================================== */
EX.kit = (() => {
  const U = EX.u, Wd = EX.world, P = EX.palette;
  const col = (c) => (Array.isArray(c) ? c : P[c] || P.ink);
  const F = () => Math.min(innerWidth / 1600, innerHeight / 900);

  /* ---------- Escenas ---------- */
  function scene(id, def) {
    const ctx = { id, tag: 's-' + id, tl: new U.Timeline(), annos: [], active: false, step: 0, el: null, def };
    const S = { steps: def.steps || 1 };
    S.init = (el) => { ctx.el = el; def.init && def.init(ctx); };
    S.enter = () => { ctx.active = true; ctx.step = 0; def.enter && def.enter(ctx); };
    S.setStep = (n) => { ctx.step = n; def.step && def.step(ctx, n); };
    if (def.onNext) S.onNext = () => def.onNext(ctx);
    S.leave = () => {
      ctx.active = false;
      ctx.tl.clear();
      def.leave && def.leave(ctx);
      cleanup(ctx);
    };
    EX.scenes[id] = S;
    return ctx;
  }

  function cleanup(ctx) {
    Wd.remove(ctx.tag);
    ctx.annos.forEach((a) => a.remove());
    ctx.annos = [];
    streams = streams.filter((s) => s.tag !== ctx.tag);
    msgs = msgs.filter((m) => m.tag !== ctx.tag);
    rings.forEach((r) => { if (r.tag === ctx.tag) { r.on = false; r.dead = true; } });
    EX.say.clear();
    EX.probe.hide();
  }

  /* Estado de partida de una escena. Todo lo que no se pide, se apaga. */
  function base(o = {}) {
    const OM = EX.orgMap;
    const org = o.org || 'hide';
    if (org === 'hide') OM.hide();
    else {
      OM.reveal();
      if (org === 'dim') OM.dim(() => false, o.dim ?? 0.12, 0.15);
      if (org === 'faint') OM.dim(() => false, 0.04, 0.05);
    }
    OM.showExt(!!o.ext && org !== 'hide');
    OM.setTerrain(o.terrain ?? (org === 'hide' ? 0 : 0.5));
    OM.setLabels(o.labels ? 1 : 0);
    OM.focus(null);
    EX.caseGraph.emphasizeHero(!!o.hero);
    EX.caseGraph.showCve(!!o.cve);
    if (o.core) EX.core.show(o.core.x, o.core.y, o.core.sub, o.core.scale);
    else EX.core.hide();
    if (!o.agents) EX.agents.clear();
    Wd.drift(null);
    EX.hud.caption(o.kicker || '', o.caption || '');
  }

  function fly(x, y, zMul = 1, dur = 2200, ease) { Wd.flyTo({ x, y, z: zMul * F() }, dur, ease); }

  /* ---------- Nodos ---------- */
  function node(ctx, o) {
    return Wd.addNode({ ta: 0, fixed: true, r: 4, ...o, color: col(o.color || 'ink'), tags: [ctx.tag, ...(o.tags || [])] });
  }
  function edge(ctx, a, b, o = {}) {
    return Wd.addEdge(a, b, { ta: 0.4, width: 1, ...o, color: col(o.color || [150, 175, 225]), tags: [ctx.tag, ...(o.tags || [])] });
  }
  /* Muestra un nodo (y opcionalmente su arista de llegada) */
  function show(n, { label = true, e = null, ea = 0.45 } = {}) {
    n.ta = 1;
    if (label) n.tla = 1;
    if (e) { e.ta = ea; e.td = 1; }
  }

  /* ---------- Anillos en el mundo ---------- */
  let rings = [];
  function ring(ctx, o) {
    const r = { tag: ctx.tag, k: 0, on: true, dash: [2, 7], color: 'ink', alpha: 0.35, width: 1, spin: 1, ...o };
    r.color = col(r.color);
    rings.push(r);
    return r;
  }

  /* ---------- Flujos de partículas ---------- */
  let streams = [];
  /* from/to: nodo, {x,y} o función; path: lista de nodos/puntos */
  function stream(ctx, o) {
    const s = { tag: ctx.tag, rate: 6, speed: 0.5, size: 1.6, color: 'cyan', curve: 0, on: true, parts: [], jitter: 0, ...o };
    s.color = col(s.color);
    streams.push(s);
    return s;
  }
  const pt = (p) => (typeof p === 'function' ? p() : p);

  function along(path, k) {
    const pts = path.map(pt);
    if (pts.length === 1) return pts[0];
    const seg = [];
    let total = 0;
    for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y); seg.push(d); total += d; }
    let t = k * total;
    for (let i = 0; i < seg.length; i++) {
      if (t <= seg[i] || i === seg.length - 1) {
        const f = seg[i] ? Math.min(1, t / seg[i]) : 0;
        return { x: U.lerp(pts[i].x, pts[i + 1].x, f), y: U.lerp(pts[i].y, pts[i + 1].y, f) };
      }
      t -= seg[i];
    }
    return pts[pts.length - 1];
  }

  /* ---------- Mensajes entre nodos ---------- */
  let msgs = [];
  function msg(ctx, from, to, text, o = {}) {
    const m = { tag: ctx.tag, from, to, text, t0: performance.now() + (o.delay || 0), dur: o.dur || 1700, color: col(o.color || 'cyan'), curve: o.curve ?? 0.18, onArrive: o.onArrive, done: false };
    msgs.push(m);
    return m;
  }

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';

  Wd.layer('kit', (ctx, now) => {
    // Anillos
    rings = rings.filter((r) => !r.dead || r.k > 0.01);
    for (const r of rings) {
      r.k += ((r.on ? 1 : 0) - r.k) * 0.06;
      const c = pt(r.at || r);
      const p = Wd.project(c.x, c.y);
      const R = r.r * Wd.cam.z;
      if (R < 2) continue;
      ctx.strokeStyle = U.rgba(r.color, r.alpha * r.k);
      ctx.lineWidth = r.width;
      ctx.setLineDash(r.dash || []);
      ctx.lineDashOffset = (now / 90) * r.spin;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, R, R * (r.squash || 1), 0, 0, Math.PI * 2 * U.ease.out(r.k));
      ctx.stroke();
      ctx.setLineDash([]);
      if (r.label && r.k > 0.05) {
        ctx.font = `400 10px ${MONO}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px';
        ctx.textAlign = 'center';
        ctx.fillStyle = U.rgba(r.labelColor ? col(r.labelColor) : [200, 210, 232], 0.85 * r.k);
        ctx.fillText(r.label.toUpperCase(), p.x, p.y - R * (r.squash || 1) - 12);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      }
    }

    // Flujos
    const dt = 1 / 60;
    for (const s of streams) {
      if (s.on && Math.random() < s.rate * dt) s.parts.push({ k: 0, j: (Math.random() - 0.5) * s.jitter, sp: s.speed * U.rand(0.8, 1.2) });
      for (let i = s.parts.length - 1; i >= 0; i--) {
        const q = s.parts[i];
        q.k += dt * q.sp;
        if (q.k >= 1) { s.parts.splice(i, 1); s.onArrive && s.onArrive(); continue; }
        let w;
        if (s.path) w = along(s.path, q.k);
        else {
          const A = pt(s.from), B = pt(s.to);
          const e = U.ease.sine(q.k);
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = B.x - A.x, dy = B.y - A.y;
          const cx = mx - dy * s.curve, cy = my + dx * s.curve;
          const u = 1 - e;
          w = { x: u * u * A.x + 2 * u * e * cx + e * e * B.x, y: u * u * A.y + 2 * u * e * cy + e * e * B.y };
          if (q.j) { const L = Math.hypot(dx, dy) || 1; w.x += (-dy / L) * q.j * Math.sin(q.k * Math.PI); w.y += (dx / L) * q.j * Math.sin(q.k * Math.PI); }
        }
        const p = Wd.project(w.x, w.y);
        const a = Math.sin(q.k * Math.PI) * (s.alpha ?? 0.9);
        ctx.fillStyle = U.rgba(s.color, a);
        ctx.beginPath();
        ctx.arc(p.x, p.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Mensajes
    for (const m of msgs) {
      const k = (now - m.t0) / m.dur;
      if (k < 0) continue;
      const A = pt(m.from), B = pt(m.to);
      if (k >= 1) {
        if (!m.done) { m.done = true; Wd.pulse(B, m.color, { r: 60, dur: 1200 }); m.onArrive && m.onArrive(); }
        continue;
      }
      const e = U.ease.inOut(k);
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = B.x - A.x, dy = B.y - A.y;
      const cx = mx - dy * m.curve, cy = my + dx * m.curve;
      // Estela de la trayectoria
      ctx.strokeStyle = U.rgba(m.color, 0.35);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const t = (i / 24) * e, u = 1 - t;
        const p = Wd.project(u * u * A.x + 2 * u * t * cx + t * t * B.x, u * u * A.y + 2 * u * t * cy + t * t * B.y);
        i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      const u = 1 - e;
      const p = Wd.project(u * u * A.x + 2 * u * e * cx + e * e * B.x, u * u * A.y + 2 * u * e * cy + e * e * B.y);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16);
      g.addColorStop(0, U.rgba(m.color, 0.7));
      g.addColorStop(1, U.rgba(m.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      if (m.text) {
        const a = Math.min(1, Math.sin(k * Math.PI) * 2);
        ctx.font = `400 11px ${MONO}`;
        const w = ctx.measureText(m.text).width;
        ctx.fillStyle = `rgba(7,10,18,${0.85 * a})`;
        ctx.fillRect(p.x + 14, p.y - 22, w + 16, 20);
        ctx.strokeStyle = U.rgba(m.color, 0.6 * a);
        ctx.strokeRect(p.x + 14.5, p.y - 21.5, w + 15, 19);
        ctx.fillStyle = U.rgba([230, 236, 248], a);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(m.text, p.x + 22, p.y - 12);
      }
    }
    msgs = msgs.filter((m) => !m.done || now - m.t0 < m.dur + 100);
  });

  /* ---------- Cadenas ---------- */
  /* Crea nodos en secuencia, conectados uno tras otro */
  function chain(ctx, pts, { gap = 600, delay = 0, edgeColor, onEach, ea = 0.5, r = 5, ring = true } = {}) {
    const nodes = pts.map((p) => node(ctx, { r, ring, ...p }));
    const edges = [];
    nodes.forEach((n, i) => {
      if (i > 0) edges.push(edge(ctx, nodes[i - 1], n, { ta: 0, td: 0, draw: 0, color: edgeColor || n.color, width: 1 }));
      ctx.tl.at(delay + i * gap, () => {
        if (!ctx.active) return;
        show(n, { e: edges[i - 1], ea });
        Wd.pulse(n, n.color, { r: 40, dur: 1000 });
        onEach && onEach(n, i);
      });
    });
    return { nodes, edges };
  }

  /* Hover genérico: cualquier nodo con `probe` muestra su lectura */
  Wd.onHover((n) => {
    if (n && n.probe) EX.probe.show(typeof n.probe === 'function' ? n.probe(n) : n.probe);
    else if (n === null || (n && !n.info && !n.ctx)) EX.probe.hide();
  });

  const probeHTML = (k, title, rows = []) =>
    `<span class="probe__k">${k}</span><strong>${title}</strong>` + rows.map(([a, b]) => `<span class="probe__row"><em>${a}</em>${b}</span>`).join('');

  return { scene, base, fly, F, node, edge, show, ring, stream, msg, chain, along, col, probeHTML, cleanup };
})();

/* ---------- Frases grandes ---------- */
EX.say = (() => {
  const el = document.querySelector('.say');
  const t = el.querySelector('.say__t'), s = el.querySelector('.say__s');
  let timer = 0;
  function say(text, { sub = '', pos = 'center', size = 'l' } = {}) {
    clearTimeout(timer);
    const swap = () => {
      t.innerHTML = text;
      s.innerHTML = sub;
      el.dataset.pos = pos;
      el.dataset.size = size;
      el.classList.toggle('is-on', !!text);
      document.body.classList.toggle('say-low', !!text && pos === 'low');
    };
    if (el.classList.contains('is-on')) { el.classList.remove('is-on'); timer = setTimeout(swap, 450); } else swap();
  }
  const clear = () => { clearTimeout(timer); el.classList.remove('is-on'); document.body.classList.remove('say-low'); };
  return Object.assign(say, { clear });
})();
