/* ==========================================================================
   EXPIA · EQUIPO DE AGENTES
   Ayudas compartidas por las escenas multi-agente: coloca al núcleo y a los
   agentes en la estación, conecta cada agente con el orquestador y genera
   las "investigaciones" (facetas que un agente abre a su alrededor).
   ========================================================================== */
EX.team = (() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, ST = EX.stations, A = EX.agents, L = EX.story.agents.layout;
  const CORE3 = ['argus', 'agora', 'aegis'];
  const MORE = ['identity', 'asset', 'threat', 'network', 'exposure', 'software'];

  const pos = (id) => ({ x: ST.agents.x + L[id][0], y: ST.agents.y + L[id][1] });

  /* Núcleo + agentes pedidos, con un estado por defecto */
  function stage(ctx, ids, { state = 'idle', links = true, from = null, sub = 'Orquestador' } = {}) {
    K.base({ org: 'hide', core: { x: ST.agents.x, y: ST.agents.y, sub }, agents: true });
    const live = new Set(ids);
    A.live.forEach((a, id) => { if (!live.has(id)) { a.tk = 0; a.fading = true; a.n.ta = 0; } });
    return ids.map((id, i) => {
      const p = pos(id);
      const a = A.spawn(id, from ? from.x : p.x, from ? from.y : p.y, { state });
      if (from) Wd.moveNode(a.n, p.x, p.y, 1400, i * 220, U.ease.out);
      if (links) a.link = K.edge(ctx, EX.core.node, a.n, { ta: 0.16, color: a.color, width: 0.8, dash: [2, 6] });
      return a;
    });
  }

  /* Abre facetas alrededor de un agente (hacia fuera del núcleo) */
  function facets(ctx, agentId, list, { r = 250, spread = 2.4, gap = 420, delay = 600, color } = {}) {
    const a = A.get(agentId);
    const c = { x: a.n.x, y: a.n.y };
    const out = Math.atan2(c.y - ST.agents.y, c.x - ST.agents.x || 0.0001);
    const nodes = list.map(([label, value], i) => {
      const ang = out + (list.length > 1 ? (i / (list.length - 1) - 0.5) * spread : 0);
      const n = K.node(ctx, {
        x: c.x, y: c.y, r: 4, ring: true, color: color || a.color, label, sub: value,
        labelSide: Math.cos(ang) < -0.15 ? -1 : 1, interactive: true, hitR: 16,
        probe: K.probeHTML(a.d.name + ' · hallazgo', label, [['Resultado', value]]),
      });
      n.dest = { x: c.x + Math.cos(ang) * r * 1.15, y: c.y + Math.sin(ang) * r * 0.9 };
      n.e = K.edge(ctx, a.n, n, { ta: 0, td: 0, draw: 0, color: color || a.color, width: 0.8 });
      ctx.tl.at(delay + i * gap, () => {
        if (!ctx.active) return;
        K.show(n, { e: n.e, ea: 0.45 });
        Wd.moveNode(n, n.dest.x, n.dest.y, 900, 0, U.ease.out);
      });
      return n;
    });
    return nodes;
  }

  /* Pliega las facetas en un único paquete de inteligencia */
  function fold(ctx, nodes, agentId, label) {
    const a = A.get(agentId);
    const t = { x: U.lerp(a.n.x, ST.agents.x, 0.45), y: U.lerp(a.n.y, ST.agents.y, 0.45) + 70 };
    nodes.forEach((n, i) => { n.tla = 0; Wd.moveNode(n, a.n.x, a.n.y, 900, i * 50); setTimeout(() => { n.ta = 0; n.e.ta = 0; }, 800 + i * 50); });
    const pk = K.node(ctx, { x: a.n.x, y: a.n.y, r: 6, ring: true, color: a.color, label, labelSide: t.x <= ST.agents.x ? -1 : 1 });
    ctx.tl.at(900, () => { pk.ta = 1; pk.tla = 1; pk.tglow = 1; Wd.moveNode(pk, t.x, t.y, 1200, 0, U.ease.inOut); });
    return pk;
  }

  return { CORE3, MORE, pos, stage, facets, fold };
})();
