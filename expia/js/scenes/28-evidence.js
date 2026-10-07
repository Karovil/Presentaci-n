/* ==========================================================================
   ESCENA 28 — PRIMERO LA EVIDENCIA
   Cada fragmento de la explicación está anclado a una evidencia del grafo.
   Pasar el cursor por un fragmento (o por una evidencia) ilumina el par.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, P = EX.palette, ST = EX.stations, D = EX.story.evidence;
  let items = {}, root, lines = {}, sentence;

  function focus(ref) {
    sentence.querySelectorAll('[data-ref]').forEach((s) => s.classList.toggle('is-on', s.dataset.ref === ref));
    sentence.classList.toggle('has-focus', !!ref);
    Object.entries(items).forEach(([k, n]) => { n.tglow = k === ref ? 1 : 0; n.ta = !ref || k === ref ? 1 : 0.3; lines[k].ta = !ref ? 0.35 : k === ref ? 0.9 : 0.08; });
  }

  K.scene('evidence', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `<p class="sentence is-interactive">${D.parts.map((p) => (p.ref ? `<span data-ref="${p.ref}">${p.t}</span>` : p.t)).join('')}</p><p class="sentence__k">Explicación de IA · cada afirmación lleva a su evidencia</p>`;
      sentence = ctx.el.querySelector('.sentence');
      sentence.addEventListener('pointerover', (e) => { const s = e.target.closest('[data-ref]'); if (s) focus(s.dataset.ref); });
      sentence.addEventListener('pointerout', (e) => { if (e.target.closest('[data-ref]')) focus(null); });
      Wd.onHover((n) => { if (n && n.evRef) focus(n.evRef); else if (n === null && sentence.classList.contains('has-focus') && !sentence.matches(':hover')) focus(null); });
    },
    enter(ctx) {
      const c = { x: ST.ai.x, y: ST.ai.y + 1400 };
      K.base({ org: 'hide' });
      K.fly(c.x - 40, c.y + 120, 0.8, 1800);
      root = K.node(ctx, { x: c.x, y: c.y - 60, r: 7, ring: true, color: 'violet', label: 'Explicación', labelSide: 1 });
      items = {}; lines = {};
      D.items.forEach((it, i) => {
        const x = c.x - 700 + i * 262, y = c.y + 290;
        const n = K.node(ctx, {
          x, y, r: 6, ring: true, color: it.color, label: it.label, sub: it.sub, labelSide: 1, subSize: 12,
          interactive: true, hitR: 22, evRef: it.key,
          probe: K.probeHTML('Evidencia', it.label, [['Fuente', it.sub]]),
        });
        // Etiquetas alternadas para que no se toquen
        n.labelSide = 1;
        lines[it.key] = K.edge(ctx, root, n, { ta: 0, td: 0, draw: 0, color: it.color, width: 1 });
        items[it.key] = n;
        ctx.tl.at(1500 + i * 220, () => { K.show(n, { e: lines[it.key], ea: 0.35 }); });
      });
      ctx.tl.at(900, () => K.show(root));
      ctx.el.classList.remove('is-shown');
      ctx.tl.at(500, () => ctx.el.classList.add('is-shown'));
      EX.hud.caption('', '');
    },
    step(ctx, n) {
      if (n >= 1) EX.say(D.line, { pos: 'low', size: 's', sub: 'La IA explica. La evidencia sostiene.' });
      else EX.say.clear();
    },
  });
})();
