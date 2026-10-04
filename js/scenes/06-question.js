/* ==========================================================================
   ESCENA 06 — LA PREGUNTA
   Silencio. Solo la pregunta que todo analista se hace.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.question;
  const S = { steps: 2 };
  IRI.scenes.question = S;

  S.init = (section) => {
    U.splitLetters(section.querySelector('.q1'), D[0], { step: 0.045, delay: 1.2 });
    U.splitLetters(section.querySelector('.q2'), D[1], { step: 0.045, delay: 0.3 });
  };
})();
