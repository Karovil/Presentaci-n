/* ==========================================================================
   ESCENA 15 — LA CAPA DE IA
   A la izquierda, el contexto que construyó la automatización. En el medio,
   la capa de IA. A la derecha, una explicación en lenguaje natural que cita
   cada evidencia. Pasar el cursor por una cita ilumina su evidencia.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.ai;
  const S = { steps: 1 };
  IRI.scenes.ai = S;

  let el, svg, graph, answerEl, nodes = [], links = [], tokens = [], total = 0, shown = 0, active = false;
  let typer = 0;
  const tl = new U.Timeline();
  const HUB = { x: 27, y: 56 };

  S.init = (section) => {
    el = section;
    svg = el.querySelector('.ai-links');
    graph = el.querySelector('.ai-graph');
    answerEl = el.querySelector('.ai-panel__a');
    el.querySelector('.statement').textContent = D.statement;
    el.querySelector('.ai-panel__q').innerHTML = `<span>Analista</span>${D.question}`;
    el.querySelector('.ai-panel__note').textContent = D.sourcesNote;
    el.querySelector('.ai-principle').textContent = D.principle;

    graph.innerHTML = `<div class="ai-hub" style="left:${HUB.x}%;top:${HUB.y}%"><i></i><span>Contexto</span></div>` +
      D.evidence.map((e, i) => `
        <div class="ai-ev${e.alert ? ' is-alert' : ''}${e.reduces ? ' is-reduce' : ''}" data-ref="${i + 1}" style="left:${e.x}%;top:${e.y}%">
          <span class="ai-ev__n">${i + 1}</span>
          <span class="ai-ev__dot">${U.icon(e.icon)}</span>
          <span class="ai-ev__label">${e.label}</span>
        </div>`).join('');
    nodes = [...graph.querySelectorAll('.ai-ev')];
    nodes.forEach((n) => {
      n.addEventListener('pointerenter', () => focus(+n.dataset.ref));
      n.addEventListener('pointerleave', () => focus(0));
    });

    // Tokens de la respuesta: texto + citas [n]
    tokens = [];
    D.answer.join('').split(/(\[\d\])/).forEach((part) => {
      const m = part.match(/^\[(\d)\]$/);
      if (m) tokens.push({ cite: +m[1] });
      else if (part) tokens.push({ text: part });
    });
    total = tokens.reduce((s, t) => s + (t.text ? t.text.length : 1), 0);

    answerEl.addEventListener('pointerover', (e) => { const c = e.target.closest('.cite'); if (c) focus(+c.dataset.ref); });
    answerEl.addEventListener('pointerout', (e) => { if (e.target.closest('.cite')) focus(0); });
    U.onResize(() => { if (active) layout(); });
  };

  function layout() {
    svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
    svg.innerHTML = '';
    const hx = (HUB.x / 100) * innerWidth, hy = (HUB.y / 100) * innerHeight;
    links = D.evidence.map((e, i) => {
      const x = (e.x / 100) * innerWidth, y = (e.y / 100) * innerHeight;
      const ln = U.svgEl('line', { x1: hx, y1: hy, x2: x, y2: y, class: 'ai-link' + (e.alert ? ' is-alert' : ''), style: `--d:${(0.9 + i * 0.12).toFixed(2)}s` });
      svg.appendChild(ln);
      return ln;
    });
  }

  function focus(ref) {
    el.classList.toggle('has-focus', ref > 0);
    nodes.forEach((n, i) => n.classList.toggle('is-focus', i + 1 === ref));
    links.forEach((l, i) => l.classList.toggle('is-focus', i + 1 === ref));
    answerEl.querySelectorAll('.cite').forEach((c) => c.classList.toggle('is-focus', +c.dataset.ref === ref));
  }

  function render(n) {
    let left = n, html = '';
    for (const t of tokens) {
      if (left <= 0) break;
      if (t.text) { html += t.text.slice(0, left); left -= t.text.length; }
      else { html += `<button type="button" class="cite" data-ref="${t.cite}">${t.cite}</button>`; left -= 1; }
    }
    answerEl.innerHTML = html + (n < total ? '<i class="caret"></i>' : '');
  }

  function type() {
    clearInterval(typer);
    typer = setInterval(() => {
      shown = Math.min(total, shown + 2);
      render(shown);
      if (shown >= total) { clearInterval(typer); el.classList.add('is-typed'); }
    }, 26);
  }

  S.enter = () => {
    active = true;
    shown = 0;
    answerEl.innerHTML = '';
    el.classList.remove('is-typed');
    focus(0);
    tl.at(80, layout);
    tl.at(2300, type);
  };

  S.onNext = () => {
    if (shown >= total) return false;
    tl.clear();
    clearInterval(typer);
    shown = total;
    render(total);
    el.classList.add('is-typed');
    return true;
  };

  S.leave = () => {
    active = false;
    tl.clear();
    clearInterval(typer);
  };
})();
