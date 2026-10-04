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

  let el, vEl, uEl, labFrom, labTo;

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

  S.enter = () => show(0, false);
  S.setStep = (n) => setTimeout(() => show(n, true), n >= 1 ? 900 : 0);
})();
