/* ==========================================================================
   ESCENA 03 — UNA VULNERABILIDAD
   La cámara desciende hasta un servidor entre miles. Aparece una CVE crítica.
   La pregunta: ¿es realmente peligrosa? El sistema empieza a investigar.
   ========================================================================== */
(() => {
  const U = EX.u, Wd = EX.world, P = EX.palette, OM = EX.orgMap, CG = EX.caseGraph;
  const T = EX.text.vuln, D = EX.org;
  const S = { steps: 3 };
  EX.scenes.vuln = S;

  let el, heroAnno, cveAnno, scan = 0, scanOn = false, probes = [], pulseTimer = 0;
  const tl = new U.Timeline();

  S.init = (section) => {
    el = section;
    el.querySelector('.ask__q').textContent = T.lines[2];
    el.querySelector('.ask__s').textContent = T.investigating;
    Wd.layer('vuln-scan', drawScan);
  };

  /* Radar de investigación alrededor del activo */
  function drawScan(ctx, now) {
    scan += ((scanOn ? 1 : 0) - scan) * 0.05;
    if (scan < 0.01) return;
    const h = CG.hero();
    const p = Wd.project(h.x, h.y);
    const R = 150 + 30 * Math.sin(now / 900);
    const a0 = (now / 900) % (Math.PI * 2);
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
    g.addColorStop(0, `rgba(94,226,255,${0.0})`);
    g.addColorStop(1, `rgba(94,226,255,${0.16 * scan})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.arc(p.x, p.y, R, a0, a0 + 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(94,226,255,${0.25 * scan})`;
    ctx.setLineDash([1, 5]);
    [0.45, 0.75, 1].forEach((k) => { ctx.beginPath(); ctx.arc(p.x, p.y, R * k, 0, Math.PI * 2); ctx.stroke(); });
    ctx.setLineDash([]);
    // Sondas: líneas que salen a buscar en otras regiones del mapa
    probes.forEach((pr) => {
      const age = (now - pr.t0) / 1400;
      if (age > 1) return;
      const q = Wd.project(pr.n.x, pr.n.y);
      const k = U.ease.out(Math.min(1, age * 1.6));
      ctx.strokeStyle = `rgba(94,226,255,${0.35 * (1 - age) * scan})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(U.lerp(p.x, q.x, k), U.lerp(p.y, q.y, k));
      ctx.stroke();
    });
    probes = probes.filter((pr) => now - pr.t0 < 1400);
    if (scanOn && Math.random() < 0.06) {
      const pool = Wd.tagged('org');
      probes.push({ n: pool[(Math.random() * pool.length) | 0], t0: now });
    }
  }

  function heroHTML() {
    return `<span class="anno__k">${D.hero.kind}</span><strong>${D.hero.id}</strong><span class="anno__s">${D.hero.zone}</span>`;
  }

  S.enter = () => {
    const h = CG.hero();
    OM.reveal();
    OM.setTerrain(0.6);
    OM.setLabels(0);
    OM.focus(null);
    const near = CG.neighbors();
    OM.dim((n) => near.has(n), 0.12, 0.2);
    CG.emphasizeHero(true);
    CG.showCve(false);
    Wd.drift(null);
    Wd.flyTo({ x: h.home.x + 40, y: h.home.y + 10, z: 3.2 * Math.min(innerWidth / 1600, innerHeight / 900) }, 2800);
    heroAnno = EX.anno.create({ target: h, dx: -90, dy: -70, html: heroHTML(), cls: 'anno--hero' });
    tl.at(2400, () => heroAnno.show());
    tl.at(900, () => EX.hud.caption(D.hero.id, T.lines[0]));
  };

  function showCve() {
    const c = CG.cve();
    CG.showCve(true);
    Wd.pulse(c, P.red, { r: 120, dur: 1500 });
    clearInterval(pulseTimer);
    pulseTimer = setInterval(() => Wd.pulse(c, P.red, { r: 70, dur: 1800 }), 1900);
    if (!cveAnno) {
      cveAnno = EX.anno.create({
        target: c, dx: 90, dy: 64, color: P.red, cls: 'anno--cve',
        html: `<span class="anno__k anno__k--red">${T.detected}</span><strong>${D.cve.id}</strong><span class="anno__tag">${D.cve.severity} · ${D.cve.score}</span><span class="anno__s">${D.cve.detail}</span>`,
      });
    }
    setTimeout(() => cveAnno && cveAnno.show(), 500);
  }

  S.setStep = (n) => {
    if (n >= 1) { showCve(); EX.hud.caption(D.cve.id, T.lines[1]); }
    else { CG.showCve(false); clearInterval(pulseTimer); cveAnno && cveAnno.hide(); EX.hud.caption(D.hero.id, T.lines[0]); }
    scanOn = n >= 2;
    if (n >= 2) EX.hud.caption('', '');
  };

  S.leave = () => {
    tl.clear();
    clearInterval(pulseTimer);
    scanOn = false;
    heroAnno && heroAnno.remove();
    cveAnno && cveAnno.remove();
    heroAnno = cveAnno = null;
  };
})();
