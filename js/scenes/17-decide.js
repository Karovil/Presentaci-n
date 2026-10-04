/* ==========================================================================
   ESCENA 17 — EL ANALISTA DECIDE
   Tres capas, tres frases. Cada paso enciende una:
   Automation does the work → AI helps understand it → The analyst decides.
   Al final, las opciones de decisión quedan en manos del analista.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.decide;
  const S = { steps: 3 };
  IRI.scenes.decide = S;

  const GLYPHS = [
    // Automatización: un flujo con un pulso que lo recorre
    `<div class="g-flow"><i></i><i></i><i></i><i></i><b></b></div>`,
    // IA: el plano de luz
    `<div class="g-lens"><i></i></div>`,
    // Analista
    `<svg class="g-analyst" viewBox="0 0 200 170" aria-hidden="true">
       <circle class="halo" cx="100" cy="58" r="44"/>
       <circle class="head" cx="100" cy="58" r="20"/>
       <path class="body" d="M42 166 C48 118 74 98 100 98 C126 98 152 118 158 166"/>
     </svg>`,
  ];

  S.init = (section) => {
    section.querySelector('.layers').innerHTML =
      `<p class="layers__case">${D.summary.map((s) => `<span><em>${s.k}</em>${s.v}</span>`).join('')}</p>` +
      D.layers.map((l, i) => `
        <div class="layer" data-i="${i}">
          <div class="layer__glyph">${GLYPHS[i]}</div>
          <span class="layer__name">${U.pad2(i + 1)} · ${l}</span>
          <p class="layer__line">${D.lines[i]}</p>
        </div>`).join('');
    section.querySelector('.decision').innerHTML =
      `<span class="decision__label">${D.optionsLabel}</span>` +
      D.options.map((o) => `<button type="button" class="opt">${o}</button>`).join('');
    section.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
      section.querySelectorAll('.opt').forEach((x) => x.classList.toggle('is-picked', x === b && !b.classList.contains('is-picked')));
    }));
  };

  S.enter = (section) => section.querySelectorAll('.opt').forEach((x) => x.classList.remove('is-picked'));
})();
