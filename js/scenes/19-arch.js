/* ==========================================================================
   ESCENA 19 — ARQUITECTURA
   Paso 1: usuario → alerta → fuentes de datos → base de datos.
   Paso 2: la alerta llega a EKS, que alimenta la base y despliega el agente.
   Paso 3: el agente usa Agent Core (MCP y herramientas) y LiteLLM (modelos IA).
   Por cada conexión viajan pulsos; al pasar el cursor, cada componente
   explica su papel.
   ========================================================================== */
(() => {
  const D = IRI.data.arch;
  const S = { steps: 3 };
  IRI.scenes.arch = S;

  const NS = 'http://www.w3.org/2000/svg';
  const R = 38;   // radio de los nodos (unidades del viewBox)
  let el, svg, tip, lineEl, nodes = {}, edges = [], pulses = [], raf = 0, active = false;

  /* Iconos de trazo, centrados en 0,0 */
  const ICON = {
    user:   '<circle cx="0" cy="-8" r="8"/><path d="M-15 16c2-9 8-13 15-13s13 4 15 13"/>',
    alert:  '<rect x="-17" y="-13" width="30" height="20" rx="3"/><path d="M-12 -3h5l3-6 4 11 3-5h4"/><circle cx="12" cy="10" r="6"/><path d="m16 14 5 5"/>',
    src:    '<rect x="-8" y="-3" width="16" height="12" rx="2"/><path d="M-5 -3v-4a5 5 0 0 1 10 0v4"/>',
    db:     '<ellipse cx="0" cy="-12" rx="14" ry="5"/><path d="M-14 -12v24c0 3 6 5 14 5s14-2 14-5v-24"/><path d="M-14 0c0 3 6 5 14 5s14-2 14-5"/>',
    eks:    '<path d="M0 -18 16 -9v18L0 18l-16-9v-18z"/><path d="M-5 -7v14M-5 0l8-7M-5 0l8 7"/>',
    agent:  '<rect x="-12" y="-8" width="24" height="18" rx="5"/><path d="M0 -8v-6"/><circle cx="0" cy="-15" r="1.6"/><circle cx="-5" cy="1" r="1.6"/><circle cx="5" cy="1" r="1.6"/>',
    core:   '<circle cx="0" cy="0" r="7"/><circle cx="0" cy="0" r="15" stroke-dasharray="3 4"/>',
    mcp:    '<circle cx="-12" cy="-8" r="3"/><circle cx="-12" cy="8" r="3"/><circle cx="0" cy="-12" r="3"/><circle cx="0" cy="0" r="3"/><circle cx="0" cy="12" r="3"/><circle cx="12" cy="0" r="3"/><path d="M-9 -8 -3 -12M-9 -8-3 0M-9 8-3 0M-9 8-3 12M3 -12 9 0M3 0h6M3 12 9 0"/>',
    llm:    '<path d="M-14 0h28M-14 -8h28M-14 8h28"/><path d="M8 -12 14 -8 8 -4M8 4l6 4-6 4"/>',
    models: '<path d="M0 -15c-8 0-14 6-14 13 0 4 2 8 5 10v6h18v-6c3-2 5-6 5-10 0-7-6-13-14-13z"/><path d="M0 -15v29M-7 -5h7M0 3h7M-7 9h7"/>',
  };

  const mk = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  /* Línea entre bordes de dos nodos (con una curva suave) */
  function pathFor(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L;
    const x1 = a.x + ux * (R + 8), y1 = a.y + uy * (R + 8);
    const x2 = b.x - ux * (R + 12), y2 = b.y - uy * (R + 12);
    const mx = (x1 + x2) / 2 - uy * L * 0.06, my = (y1 + y2) / 2 + ux * L * 0.06;
    return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }

  S.init = (section) => {
    el = section;
    svg = el.querySelector('.arch');
    tip = el.querySelector('.arch-tip');
    lineEl = el.querySelector('.arch__line');

    const defs = mk('defs', {}, svg);
    const m = mk('marker', { id: 'arch-arrow', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
    mk('path', { d: 'M0,0 L10,5 L0,10 z', class: 'arch-arrow' }, m);

    const gEdges = mk('g', { class: 'arch-edges' }, svg);
    const gPulses = mk('g', { class: 'arch-pulses' }, svg);
    const gNodes = mk('g', { class: 'arch-nodes' }, svg);

    D.nodes.forEach((n) => {
      const g = mk('g', { class: `arch-node arch-node--${n.kind}${n.alert ? ' is-alert' : ''}`, transform: `translate(${n.x} ${n.y})`, 'data-step': n.step }, gNodes);
      if (n.kind === 'eks') mk('path', { class: 'arch-node__shape', d: `M0 ${-R - 4} ${R} ${-R / 2 - 2}v${R + 4}L0 ${R + 4}l${-R} ${-R / 2 - 2}v${-R - 4}z` }, g);
      else if (n.kind === 'mcp' || n.kind === 'models') mk('rect', { class: 'arch-node__shape', x: -R - 6, y: -R - 6, width: (R + 6) * 2, height: (R + 6) * 2, rx: 6 }, g);
      else mk('circle', { class: 'arch-node__shape', r: R }, g);
      mk('circle', { class: 'arch-node__halo', r: R + 12 }, g);
      const ic = mk('g', { class: 'arch-node__icon' }, g);
      ic.innerHTML = ICON[n.kind];
      const t = mk('text', { class: 'arch-node__label', y: R + 34, 'text-anchor': 'middle' }, g);
      t.textContent = n.label.toUpperCase();
      g.addEventListener('pointerenter', () => showTip(n, g));
      g.addEventListener('pointerleave', hideTip);
      nodes[n.id] = { ...n, g };
    });

    edges = D.edges.map(([a, b, step]) => {
      const p = mk('path', { class: 'arch-edge', d: pathFor(nodes[a], nodes[b]), pathLength: 1, 'marker-end': 'url(#arch-arrow)', 'data-step': step }, gEdges);
      const dot = mk('circle', { class: 'arch-pulse' + (a === 'user' || a === 'alert' ? ' is-alert' : ''), r: 4 }, gPulses);
      return { a, b, step, p, dot, k: Math.random(), sp: 0.35 + Math.random() * 0.15 };
    });
  };

  function showTip(n, g) {
    if (+g.dataset.step > +el.dataset.step) return;
    const r = g.getBoundingClientRect();
    tip.innerHTML = `<span class="arch-tip__k">${n.label}</span><p>${n.desc}</p>`;
    const right = r.left + r.width / 2 < innerWidth * 0.62;
    tip.style.left = right ? `${r.right + 18}px` : '';
    tip.style.right = right ? '' : `${innerWidth - r.left + 18}px`;
    tip.style.top = `${Math.max(80, Math.min(innerHeight - 160, r.top + r.height / 2 - 50))}px`;
    tip.classList.add('is-on');
    edges.forEach((e) => e.p.classList.toggle('is-hot', e.a === n.id || e.b === n.id));
    el.classList.add('has-hot');
    g.classList.add('is-hot');
  }
  function hideTip() {
    tip.classList.remove('is-on');
    el.classList.remove('has-hot');
    edges.forEach((e) => e.p.classList.remove('is-hot'));
    Object.values(nodes).forEach((n) => n.g.classList.remove('is-hot'));
  }

  /* Pulsos que recorren las conexiones visibles */
  function tick(now) {
    if (!active) return;
    const step = +el.dataset.step;
    edges.forEach((e) => {
      const on = e.step <= step;
      e.dot.style.opacity = on ? 1 : 0;
      if (!on) return;
      e.k = (e.k + 0.016 * e.sp) % 1;
      const L = e.p.getTotalLength();
      const pt = e.p.getPointAtLength(L * e.k);
      e.dot.setAttribute('cx', pt.x);
      e.dot.setAttribute('cy', pt.y);
      e.dot.style.opacity = Math.sin(e.k * Math.PI).toFixed(3);
    });
    raf = requestAnimationFrame(tick);
  }

  function setLine(n) {
    lineEl.classList.remove('is-in');
    void lineEl.offsetWidth;
    lineEl.textContent = D.lines[n];
    lineEl.classList.add('is-in');
  }

  S.enter = () => {
    active = true;
    hideTip();
    setLine(0);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  };
  S.setStep = (n) => { hideTip(); setLine(n); };
  S.leave = () => { active = false; cancelAnimationFrame(raf); hideTip(); };
})();
