/* ==========================================================================
   ESCENA 13 — LA PREGUNTA
   Solo queda "03 DAYS". Pausa. Luego, las dos preguntas que abren la solución.
   ========================================================================== */
(() => {
  const U = IRI.utils;
  const D = IRI.data.ask;
  const S = { steps: 3 };
  IRI.scenes.ask = S;

  S.init = (section) => {
    section.querySelector('.ask__total').textContent = D.total;
    U.splitLetters(section.querySelector('.q1'), D.questions[0], { step: 0.03, delay: 0.5 });
    U.splitLetters(section.querySelector('.q2'), D.questions[1], { step: 0.03, delay: 0.4 });
  };
})();
