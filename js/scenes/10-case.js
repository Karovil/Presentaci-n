/* ==========================================================================
   ESCENA 10 — SE ABRE LA INVESTIGACIÓN
   El caso queda abierto. El analista está al centro y alrededor aparecen
   los tipos de evidencia que tendrá que revisar, todavía sin respuesta.
   Paso 2: "¿Qué ocurrió?" — la mirada recorre cada fuente.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.case;
  const S = { steps: 2 };
  IRI.scenes.case = S;

  let el, svg, ring, analyst, nodes = [], lines = [], active = false, scanIdx = 0;
  const tl = new U.Timeline();
  let scanTimer = 0;

  // Arco superior alrededor del analista (ángulos en grados)
  const CENTER = { x: 50, y: 58 };
  const angles = (n) => Array.from({ length: n }, (_, i) => 186 + (i * (354 - 186)) / (n - 1));

  S.init = (section) => {
    el = section;
    svg = el.querySelector('.case-links');
    ring = el.querySelector('.evidence-ring');
    analyst = el.querySelector('.analyst');
    el.querySelector('.statement').textContent = D.question;

    el.querySelector('.casefile').innerHTML = `
      <p class="casefile__id"><span>Caso</span> #${IRI.data.caseId}</p>
      <p class="casefile__title">${D.title}</p>
      <dl>
        <div><dt>Estado</dt><dd class="is-open">${D.status}</dd></div>
        <div><dt>Responsable</dt><dd>${D.owner}</dd></div>
        <div><dt>Apertura</dt><dd>${D.opened}</dd></div>
      </dl>`;

    const ang = angles(D.evidence.length);
    ring.innerHTML = D.evidence.map((e, i) => {
      const a = (ang[i] * Math.PI) / 180;
      const x = CENTER.x + Math.cos(a) * 33, y = CENTER.y + Math.sin(a) * 36;
      return `<div class="ev${e.alert ? ' ev--alert' : ''}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--delay:${(0.8 + i * 0.14).toFixed(2)}s">
        <div class="ev__dot">${U.icon(e.icon)}</div>
        <div class="ev__label">${e.label}</div>
        <div class="ev__state">?</div>
      </div>`;
    }).join('');
    nodes = [...ring.children];
    U.onResize(() => { if (active) layout(); });
  };

  function layout() {
    svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
    const ar = analyst.getBoundingClientRect();
    const hx = ar.left + ar.width / 2, hy = ar.top + ar.height * 0.34;
    svg.innerHTML = '';
    lines = nodes.map((n) => {
      const r = n.querySelector('.ev__dot').getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const d = Math.hypot(x - hx, y - hy);
      const k1 = 70 / d, k2 = 1 - (r.width / 2 + 10) / d;
      const ln = U.svgEl('line', {
        x1: hx + (x - hx) * k1, y1: hy + (y - hy) * k1,
        x2: hx + (x - hx) * k2, y2: hy + (y - hy) * k2,
        class: 'case-link',
      });
      svg.appendChild(ln);
      return ln;
    });
  }

  function scan() {
    nodes.forEach((n, i) => { n.classList.toggle('is-scan', i === scanIdx); lines[i] && lines[i].classList.toggle('is-scan', i === scanIdx); });
    scanIdx = (scanIdx + 1) % nodes.length;
  }

  S.enter = () => {
    active = true;
    scanIdx = 0;
    clearInterval(scanTimer);
    nodes.forEach((n) => n.classList.remove('is-scan'));
    tl.at(80, layout);
    tl.at(1600, layout);   // tras la animación de entrada
  };

  S.setStep = (n) => {
    clearInterval(scanTimer);
    if (n >= 1) {
      layout();
      tl.at(900, () => { scan(); scanTimer = setInterval(scan, 700); });
    } else {
      nodes.forEach((x) => x.classList.remove('is-scan'));
      lines.forEach((x) => x.classList.remove('is-scan'));
    }
  };

  S.leave = () => {
    active = false;
    tl.clear();
    clearInterval(scanTimer);
  };
})();
