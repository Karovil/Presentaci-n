/* ==========================================================================
   ESCENA 18 — DE 3 DÍAS A 5 MINUTOS
   La barra de 72 horas de trabajo manual se comprime hasta una línea.
   03 DÍAS → 05 MIN.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.compress;
  const S = { steps: 2 };
  IRI.scenes.compress = S;

  let el, vEl, uEl, labFrom, labTo, savEl;
  // (1 − 5 / 1.440) × 100 = 99,65 %
  const pct = () => (1 - D.saving.autoMin / D.saving.manualMin) * 100;
  const fmt = (v) => v.toFixed(2).replace('.', ',');

  S.init = (section) => {
    el = section;
    vEl = el.querySelector('.compress__v');
    uEl = el.querySelector('.compress__u');
    labFrom = el.querySelector('.lab-from');
    labTo = el.querySelector('.lab-to');
    labFrom.textContent = D.fromLabel;
    labTo.textContent = D.toLabel;
    el.querySelector('.compress__line').textContent = D.line;
    el.querySelector('.compress__note').textContent = D.note;
    el.querySelector('.saving__k').textContent = D.saving.label;
    el.querySelector('.saving__calc').textContent = D.saving.calc;
    savEl = el.querySelector('.saving__v');
    // La barra manual: los segmentos de trabajo de la escena 11
    el.querySelector('.bar-manual').innerHTML = IRI.data.manual.actions
      .map((a) => `<b style="flex:${a.hours}"></b>`).join('');
  };

  function show(n, animate) {
    const to = n >= 1 ? D.to : D.from;
    if (animate) U.scramble(vEl, to.value, { duration: 700 });
    else vEl.textContent = to.value;
    uEl.textContent = to.unit;
  }

  S.enter = () => { show(0, false); savEl.dataset.value = 0; savEl.textContent = fmt(0); };
  S.setStep = (n) => {
    setTimeout(() => show(n, true), n >= 1 ? 900 : 0);
    if (n >= 1) setTimeout(() => U.countTo(savEl, pct(), { duration: 1800, format: fmt }), 1500);
    else { savEl.dataset.value = 0; savEl.textContent = fmt(0); }
  };
})();
