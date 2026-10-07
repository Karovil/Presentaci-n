/* ==========================================================================
   ESCENA 16 — AEGIS
   AEGIS relaciona el activo con sus controles: implementados, fallidos,
   parciales, ausentes y excepciones. Lo revisa control por control.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, K = EX.kit, TM = EX.team, A = EX.agents, D = EX.story.aegis;
  const COLOR = { ok: 'green', fail: 'red', partial: 'yellow', absent: [110, 120, 140], exception: 'violet' };
  let ctrls = [], asset = null, packet = null;

  K.scene('aegis', {
    steps: 2,
    init(ctx) {
      ctx.el.innerHTML = `<ul class="legend legend--aegis">${Object.entries(D.legend).map(([k, v]) =>
        `<li><i style="background:${U.rgba(K.col(COLOR[k]), 1)}"></i>${v}</li>`).join('')}</ul>`;
    },
    enter(ctx) {
      TM.stage(ctx, TM.CORE3);
      A.set('argus', 'on'); A.set('agora', 'on');
      const a = A.get('aegis');
      const p = TM.pos('aegis');
      K.fly(p.x, p.y + 200, 1.05, 2400);
      EX.hud.caption('AEGIS', 'Controles y líneas base');
      asset = K.node(ctx, { x: p.x, y: p.y + 230, r: 6, ring: true, color: 'ink', label: 'SRV-PS-014', sub: 'Servidor PeopleSoft', labelSide: 1 });
      const ea = K.edge(ctx, a.n, asset, { ta: 0, color: [150, 175, 225], width: 1 });
      K.msg(ctx, EX.core.node, a.n, D.task, { delay: 1100, color: 'green', onArrive: () => { A.set('aegis', 'work', 'Validando ' + D.task); K.show(asset); ea.ta = 0.5; } });
      ctrls = D.controls.map((c, i) => {
        // Dos columnas a los lados del activo, etiquetas hacia fuera
        const left = i % 2 === 0, row = Math.floor(i / 2), rows = Math.ceil(D.controls.length / 2);
        const n = K.node(ctx, {
          x: asset.x + (left ? -1 : 1) * (380 + row * 18), y: asset.y - 40 + (row - (rows - 1) / 2) * 120 + (left ? 0 : 40), r: 4.5, ring: c.state !== 'absent',
          color: COLOR[c.state], label: c.label, sub: D.legend[c.state], labelSide: left ? -1 : 1, labelSize: 9, subSize: 12,
          interactive: true, hitR: 16, probe: K.probeHTML('Control', c.label, [['Estado', D.legend[c.state]], ['Activo', 'SRV-PS-014']]),
        });
        n.e = K.edge(ctx, asset, n, { ta: 0, td: 0, draw: 0, color: COLOR[c.state], width: 0.8, dash: c.state === 'absent' ? [2, 5] : null });
        ctx.tl.at(3200 + i * 520, () => { K.show(n, { e: n.e, ea: 0.5 }); if (c.state !== 'ok') Wd.pulse(n, n.color, { r: 30, dur: 1000 }); });
        return n;
      });
      packet = null;
    },
    step(ctx, n) {
      if (n >= 1 && !packet) {
        ctx.tl.clear();
        ctrls.forEach((c) => { c.ta = 1; c.tla = 0; c.e.ta = 0.3; c.e.td = 1; });
        packet = TM.fold(ctx, [], 'aegis', D.out);
        A.set('aegis', 'on', D.out);
        EX.say(D.note, { pos: 'top', size: 's' });
      }
    },
  });
})();
