/* ==========================================================================
   ESCENA 08 — REVELACIÓN
   Primera aparición clara del nombre de la solución.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.reveal;
  const S = { steps: 1 };
  IRI.scenes.reveal = S;

  S.init = (section) => {
    U.splitLetters(section.querySelector('.t1'), D.title[0], { step: 0.05, delay: 1.3 });
    U.splitLetters(section.querySelector('.t2'), D.title[1], { step: 0.05, delay: 1.75 });
    section.querySelector('.reveal__sub').textContent = D.subtitle;
    section.querySelector('[data-org]').textContent = D.org;
    section.querySelector('[data-next]').textContent = D.next;
  };
})();
