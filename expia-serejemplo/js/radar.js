/* ==========================================================================
   EXPIA · SER EJEMPLO — RADAR
   Un único lienzo persistente. Las escenas no dibujan pantallas: mueven el
   radar, encienden señales, generan ruido o trazan la ruta de exposición.
   Coordenadas de señales: normalizadas al radio (−1 … 1).
   ========================================================================== */
SX.radar = (() => {
  const cv = document.getElementById('radar');
  const ctx = cv.getContext('2d');
  const TAU = Math.PI * 2;
  const COL = {
    ink: [226, 232, 244], cyan: [94, 226, 255], violet: [150, 128, 255], green: [61, 220, 151],
    yellow: [255, 209, 102], orange: [255, 138, 61], red: [255, 69, 88],
  };
  const NOISE_COLORS = ['orange', 'orange', 'yellow', 'red', 'violet', 'cyan', 'ink', 'ink'];
  let W = 0, H = 0, dpr = 1;

  /* Vista: centro (fracción de pantalla), radio (fracción del lado menor), brillo */
  const v = { cx: 0.5, cy: 0.5, r: 0.36, dim: 0.5 };
  const tv = { ...v };
  let sweep = -Math.PI / 2, speed = 1.15;

  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a))})`;
  const lerp = (a, b, k) => a + (b - a) * k;
  const norm = (a) => ((a % TAU) + TAU) % TAU;

  /* ---------- Señales ---------- */
  const events = [];   // incidentes 2026 (con etiqueta)
  const noise = [];    // ruido: miles de señales sin contexto
  const pings = [];    // ataques "en vivo" (reloj)
  const chain = { nodes: [], show: 0, tshow: 0, t0: 0 };

  function setEvents(list) {
    events.length = 0;
    list.forEach((e) => {
      const a = (e.a - 90) * Math.PI / 180;
      events.push({ ...e, x: Math.cos(a) * e.d, y: Math.sin(a) * e.d, al: 0, ta: 0, lit: 0, seen: false, la: 0 });
    });
  }
  /* pick: resalta solo algunas señales (p. ej. las que entraron por un proveedor) */
  function showEvents(on, labels = on, pick = null) {
    events.forEach((e) => {
      e.hl = !!(pick && pick(e));
      e.ta = on ? 1 : e.hl ? 1 : (labels === 'faint' ? (pick ? 0.18 : 0.35) : 0);
      e.labels = labels;
      if (!on && labels !== 'faint') e.seen = false;
    });
  }

  function makeNoise(n) {
    noise.length = 0;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, d = Math.sqrt(Math.random()) * 0.96;
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      noise.push({ x, y, hx: x, hy: y, tx: x, ty: y, c: NOISE_COLORS[i % NOISE_COLORS.length], al: 0, ta: 0, lit: 0, s: 0.8 + Math.random() * 1.4, delay: Math.random() });
    }
  }
  function showNoise(level) {
    noise.forEach((p) => { p.ta = level; p.tx = p.hx; p.ty = p.hy; });
  }
  /* El ruido converge en la ruta y desaparece */
  /* El ruido converge en un conjunto de puntos (fuentes de EXPIA o ruta) y desaparece */
  function collapseNoise(targets) {
    const ns = targets === 'hub' ? hubs.sources.items : chain.nodes;
    noise.forEach((p, i) => {
      const n = ns[i % ns.length];
      p.tx = n.x + (Math.random() - 0.5) * 0.05; p.ty = n.y + (Math.random() - 0.5) * 0.05;
      p.ta = 0;
    });
  }

  /* ---------- Hubs: EXPIA en el centro, fuentes y agentes alrededor ---------- */
  const hubs = {
    sources: { items: [], show: 0, tshow: 0, t0: 0, r: 0.82, kind: 'source' },
    agents:  { items: [], show: 0, tshow: 0, t0: 0, r: 0.46, kind: 'agent' },
  };
  let core = 0, tcore = 0;
  function setHub(key, list) {
    const h = hubs[key], n = list.length, off = key === 'agents' ? -90 : -90 + 180 / n;
    h.items = list.map((it, i) => {
      const a = (off + i * 360 / n) * Math.PI / 180;
      return { ...it, a, x: Math.cos(a) * h.r, y: Math.sin(a) * h.r };
    });
  }
  /* level: 0 oculto · 0.3 tenue · 1 visible */
  function showHub(key, level) {
    const h = hubs[key];
    if (level > h.tshow + 0.01 && h.tshow < 0.5) h.t0 = performance.now();
    h.tshow = level;
    tcore = Math.max(hubs.sources.tshow, hubs.agents.tshow) > 0 ? 1 : 0;
  }

  function setChain(list) {
    const n = list.length;
    chain.nodes = list.map((c, i) => {
      const t = i / (n - 1);
      return { ...c, x: -0.86 + t * 1.72, y: Math.sin(t * Math.PI * 1.6 + 0.4) * 0.16, up: i % 2 === 0 };
    });
  }
  function showChain(on) { chain.tshow = on ? 1 : 0; if (on) chain.t0 = performance.now(); }

  function ping() {
    const a = Math.random() * TAU, d = 0.35 + Math.random() * 0.5;
    pings.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, t0: performance.now() });
  }

  /* ---------- Vista ---------- */
  function view(o) { Object.assign(tv, o); }

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
  }

  /* ---------- Dibujo ---------- */
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const k = Math.min(1, dt * 2.2);
    for (const key in tv) v[key] = lerp(v[key], tv[key], k);

    const prev = sweep;
    sweep += speed * dt;
    const swPrev = norm(prev), swNow = norm(sweep);
    const crossed = (ang) => {
      const a = norm(ang);
      return swPrev <= swNow ? (a > swPrev && a <= swNow) : (a > swPrev || a <= swNow);
    };

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const cx = W * v.cx, cy = H * v.cy, R = Math.min(W, H) * v.r, D = v.dim;
    const P = (x, y) => [cx + x * R, cy + y * R];

    /* Halo */
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.25);
    g.addColorStop(0, `rgba(20,44,80,${0.35 * D})`);
    g.addColorStop(1, 'rgba(5,7,11,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    /* Anillos y ejes */
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      ctx.strokeStyle = `rgba(150,170,215,${(i === 4 ? 0.26 : 0.11) * D})`;
      ctx.beginPath(); ctx.arc(cx, cy, R * i / 4, 0, TAU); ctx.stroke();
    }
    ctx.strokeStyle = `rgba(150,170,215,${0.08 * D})`;
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

    /* Graduación exterior */
    ctx.font = '400 9px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let deg = 0; deg < 360; deg += 5) {
      const a = (deg - 90) * Math.PI / 180, major = deg % 30 === 0;
      const r1 = R * 1.0, r2 = R * (major ? 1.045 : 1.02);
      ctx.strokeStyle = `rgba(150,170,215,${(major ? 0.4 : 0.18) * D})`;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.stroke();
      if (major) {
        ctx.fillStyle = `rgba(104,115,137,${0.9 * D})`;
        ctx.fillText(String(deg).padStart(3, '0'), cx + Math.cos(a) * R * 1.09, cy + Math.sin(a) * R * 1.09);
      }
    }

    /* Barrido */
    const wedge = 1.1;
    if (ctx.createConicGradient) {
      const cg = ctx.createConicGradient(sweep - wedge, cx, cy);
      const f = wedge / TAU;
      cg.addColorStop(0, 'rgba(94,226,255,0)');
      cg.addColorStop(f * 0.999, `rgba(94,226,255,${0.2 * D})`);
      cg.addColorStop(Math.min(1, f + 0.001), 'rgba(94,226,255,0)');
      cg.addColorStop(1, 'rgba(94,226,255,0)');
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = `rgba(94,226,255,${0.7 * D})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R); ctx.stroke();

    /* Ruido */
    for (const p of noise) {
      p.al = lerp(p.al, p.ta, Math.min(1, dt * (p.ta > p.al ? 1.2 + p.delay * 2 : 1.6)));
      p.x = lerp(p.x, p.tx, Math.min(1, dt * 1.6)); p.y = lerp(p.y, p.ty, Math.min(1, dt * 1.6));
      if (p.al < 0.01) continue;
      if (crossed(Math.atan2(p.y, p.x))) p.lit = 1;
      p.lit = Math.max(0, p.lit - dt * 0.7);
      const [x, y] = P(p.x, p.y), c = COL[p.c];
      ctx.fillStyle = rgba(c, p.al * (0.35 + p.lit * 0.65));
      ctx.beginPath(); ctx.arc(x, y, p.s + p.lit * 1.2, 0, TAU); ctx.fill();
    }

    /* Incidentes 2026 */
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    for (const e of events) {
      e.al = lerp(e.al, e.ta, Math.min(1, dt * 2));
      if (e.al < 0.01) continue;
      if (crossed(Math.atan2(e.y, e.x))) { e.lit = 1; if (e.ta === 1) e.seen = true; }
      e.lit = Math.max(0, e.lit - dt * 0.55);
      e.la = lerp(e.la, e.seen && e.labels === true ? 1 : 0, Math.min(1, dt * 3));
      const [x, y] = P(e.x, e.y), c = COL[e.c];
      const a = e.al * (0.55 + e.lit * 0.45);
      /* onda */
      if (e.lit > 0) {
        ctx.strokeStyle = rgba(c, e.lit * 0.7 * e.al);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, 6 + (1 - e.lit) * 26, 0, TAU); ctx.stroke();
      }
      if (e.hl) {
        const ph = (now / 1400) % 1;
        ctx.strokeStyle = rgba(c, (1 - ph) * 0.8 * e.al); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(x, y, 8 + ph * 34, 0, TAU); ctx.stroke();
      }
      ctx.fillStyle = rgba(c, e.hl ? e.al : a);
      ctx.beginPath(); ctx.arc(x, y, e.hl ? 5 : 3.6, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(c, a * 0.5);
      ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.stroke();
      /* etiqueta */
      if (e.la > 0.01) {
        const right = e.x >= -0.05;
        const lx = x + (right ? 18 : -18), ly = y - 14;
        ctx.strokeStyle = rgba(c, 0.5 * e.la);
        ctx.beginPath(); ctx.moveTo(x + (right ? 8 : -8), y - 4); ctx.lineTo(lx, ly + 4); ctx.lineTo(lx + (right ? 10 : -10), ly + 4); ctx.stroke();
        ctx.textAlign = right ? 'left' : 'right';
        const tx = lx + (right ? 14 : -14);
        ctx.font = '500 13px "Space Grotesk", sans-serif';
        ctx.fillStyle = rgba(COL.ink, e.la);
        ctx.fillText(e.label, tx, ly + 1);
        ctx.font = '400 10.5px "IBM Plex Mono", monospace';
        ctx.fillStyle = rgba([164, 175, 196], e.la * 0.95);
        ctx.fillText(e.sub, tx, ly + 17);
      }
    }

    /* Hubs: fuentes conectadas y agentes orquestados */
    core = lerp(core, tcore, Math.min(1, dt * 2.5));
    for (const key of ['sources', 'agents']) {
      const h = hubs[key];
      h.show = lerp(h.show, h.tshow, Math.min(1, dt * 2.5));
      if (h.show < 0.01) continue;
      const el = (now - h.t0) / 1000, n = h.items.length;
      h.items.forEach((it, i) => {
        const on = Math.max(0, Math.min(1, (el - 0.6 - i * (key === 'agents' ? 0.45 : 0.3)) * 1.6)) * h.show;
        if (on <= 0) return;
        const c = COL[it.c || 'cyan'];
        const [x, y] = P(it.x, it.y);
        const [x0, y0] = P(it.x * 0.2, it.y * 0.2);
        /* enlace con el núcleo */
        ctx.strokeStyle = rgba(c, 0.28 * on); ctx.lineWidth = 1;
        ctx.setLineDash(key === 'sources' ? [3, 5] : []);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x0, y0); ctx.stroke();
        ctx.setLineDash([]);
        /* flujo: datos que entran (fuentes) · tareas y respuestas (agentes) */
        const flows = key === 'sources' ? [[(now / 1500 + i * 0.17) % 1, 1]] : [[(now / 1300 + i * 0.21) % 1, -1], [(now / 1300 + i * 0.21 + 0.5) % 1, 1]];
        flows.forEach(([f, dir]) => {
          const t = dir > 0 ? f : 1 - f;
          const px = x + (x0 - x) * t, py = y + (y0 - y) * t;
          ctx.fillStyle = rgba(dir > 0 ? c : COL.cyan, on * (1 - Math.abs(t - 0.5)) * 1.4);
          ctx.beginPath(); ctx.arc(px, py, 2.2, 0, TAU); ctx.fill();
        });
        /* nodo */
        const big = key === 'agents', rr = big ? 15 : 6;
        ctx.fillStyle = '#05070b';
        ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill();
        ctx.strokeStyle = rgba(c, on); ctx.lineWidth = big ? 1.8 : 1.2;
        ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.stroke();
        ctx.fillStyle = rgba(c, on);
        ctx.beginPath(); ctx.arc(x, y, big ? 4.5 : 2.4, 0, TAU); ctx.fill();
        if (big) {
          const ph = ((now / 1300 + i * 0.21) % 1);
          ctx.strokeStyle = rgba(c, (1 - ph) * 0.5 * on);
          ctx.beginPath(); ctx.arc(x, y, rr + ph * 16, 0, TAU); ctx.stroke();
        }
        /* etiqueta, hacia afuera (solo si el hub está en primer plano) */
        if (h.tshow < 0.5) return;
        const cs = Math.cos(it.a), sn = Math.sin(it.a);
        const lx = x + cs * (rr + 12), ly = y + sn * (rr + 14);
        ctx.textAlign = cs > 0.25 ? 'left' : cs < -0.25 ? 'right' : 'center';
        const base = sn > 0.25 ? ly + 10 : sn < -0.25 ? ly - 14 : ly - 2;
        ctx.font = `500 ${big ? 15 : 13}px "Space Grotesk", sans-serif`;
        ctx.fillStyle = rgba(COL.ink, on);
        ctx.fillText(it.l, lx, base);
        ctx.font = '400 10.5px "IBM Plex Mono", monospace';
        ctx.fillStyle = rgba([164, 175, 196], on);
        ctx.fillText(it.s, lx, base + 15);
      });
    }
    /* Núcleo EXPIA */
    if (core > 0.01) {
      const rc = R * 0.16, pulse = 1 + Math.sin(now / 500) * 0.04;
      const cg2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, rc * 2.2);
      cg2.addColorStop(0, `rgba(94,226,255,${0.22 * core})`); cg2.addColorStop(1, 'rgba(94,226,255,0)');
      ctx.fillStyle = cg2; ctx.beginPath(); ctx.arc(cx, cy, rc * 2.2, 0, TAU); ctx.fill();
      ctx.fillStyle = `rgba(5,7,11,${0.92 * core})`;
      ctx.beginPath(); ctx.arc(cx, cy, rc * pulse, 0, TAU); ctx.fill();
      ctx.strokeStyle = `rgba(94,226,255,${0.85 * core})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, rc * pulse, 0, TAU); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `500 ${Math.max(14, rc * 0.36)}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = `rgba(230,235,245,${core})`;
      ctx.fillText('EXPIA', cx, cy - rc * 0.08);
      ctx.font = `400 ${Math.max(8, rc * 0.12)}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = `rgba(94,226,255,${core})`;
      ctx.fillText('ORQUESTADOR', cx, cy + rc * 0.3);
      ctx.textBaseline = 'alphabetic';
    }

    /* Ruta de exposición */
    chain.show = lerp(chain.show, chain.tshow, Math.min(1, dt * 3));
    if (chain.show > 0.01 && chain.nodes.length) {
      const ns = chain.nodes, el = (now - chain.t0) / 1000;
      const prog = chain.tshow ? Math.min(ns.length - 1, Math.max(0, (el - 0.9) * 1.7)) : ns.length - 1;
      ctx.lineWidth = 1.6;
      for (let i = 0; i < ns.length - 1; i++) {
        const seg = Math.max(0, Math.min(1, prog - i));
        if (seg <= 0) break;
        const [x1, y1] = P(ns[i].x, ns[i].y), [x2, y2] = P(ns[i + 1].x, ns[i + 1].y);
        ctx.strokeStyle = rgba(COL.red, 0.75 * chain.show);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + (x2 - x1) * seg, y1 + (y2 - y1) * seg); ctx.stroke();
      }
      /* pulso que recorre la ruta */
      if (prog >= ns.length - 1) {
        const tt = ((el * 0.35) % 1) * (ns.length - 1), i = Math.floor(tt), f = tt - i;
        const [x1, y1] = P(ns[i].x, ns[i].y), [x2, y2] = P(ns[i + 1].x, ns[i + 1].y);
        const px = x1 + (x2 - x1) * f, py = y1 + (y2 - y1) * f;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 16);
        pg.addColorStop(0, rgba(COL.red, 0.9 * chain.show)); pg.addColorStop(1, rgba(COL.red, 0));
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 16, 0, TAU); ctx.fill();
      }
      ns.forEach((n, i) => {
        const on = Math.max(0, Math.min(1, (prog - i + 1) * 1.5)) * chain.show;
        if (on <= 0) return;
        const [x, y] = P(n.x, n.y), c = COL[n.c];
        ctx.fillStyle = '#05070b';
        ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill();
        ctx.strokeStyle = rgba(c, on); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.stroke();
        ctx.fillStyle = rgba(c, on);
        ctx.beginPath(); ctx.arc(x, y, 3.4, 0, TAU); ctx.fill();
        ctx.textAlign = 'center';
        const dy = n.up ? -26 : 34;
        ctx.font = '500 14px "Space Grotesk", sans-serif';
        ctx.fillStyle = rgba(COL.ink, on);
        ctx.fillText(n.l, x, y + dy);
        ctx.font = '400 10.5px "IBM Plex Mono", monospace';
        ctx.fillStyle = rgba([164, 175, 196], on);
        ctx.fillText(n.s, x, y + dy + (n.up ? -17 : 16));
      });
    }

    /* Ataques en vivo */
    for (let i = pings.length - 1; i >= 0; i--) {
      const p = pings[i], t = (now - p.t0) / 2600;
      if (t > 1) { pings.splice(i, 1); continue; }
      const [x, y] = P(p.x, p.y);
      ctx.strokeStyle = rgba(COL.red, (1 - t) * 0.9); ctx.lineWidth = 1.5;
      for (let r = 0; r < 3; r++) { ctx.beginPath(); ctx.arc(x, y, 4 + ((t * 3 + r / 3) % 1) * 46, 0, TAU); ctx.stroke(); }
      ctx.fillStyle = rgba(COL.red, 1 - t);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  resize();
  addEventListener('resize', resize);
  requestAnimationFrame(frame);

  return { view, setEvents, showEvents, makeNoise, showNoise, collapseNoise, setHub, showHub, setChain, showChain, ping, set speed(s) { speed = s; } };
})();
