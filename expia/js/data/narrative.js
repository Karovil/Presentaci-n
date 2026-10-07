/* ==========================================================================
   EXPIA · NARRATIVA
   Todo el texto visible de la experiencia. Para cambiar un mensaje,
   edita solo este archivo.
   ========================================================================== */
window.EX = window.EX || {};

EX.text = {
  brand: 'EXPIA',
  brandSub: 'Exposure & Intelligence Platform',
  hudLeft: 'Inteligencia de exposición',
  defaultHint: 'Desplaza para profundizar',

  /* Escenas: id, código, nombre (rail y HUD) y nivel de zoom narrativo */
  scenes: [
    { id: 'boot',    code: '01', name: 'Activación',                 layer: 'Plataforma' },
    { id: 'map',     code: '02', name: 'El mapa de la organización', layer: 'Organización', hint: 'Pasa el cursor por el mapa' },
    { id: 'vuln',    code: '03', name: 'Una vulnerabilidad',         layer: 'Activo' },
    { id: 'context', code: '04', name: 'La señal y su contexto',     layer: 'Contexto', hint: 'Pasa el cursor por cada relación' },
  ],

  /* ---------- 01 · ACTIVACIÓN ---------- */
  boot: {
    detections: [
      { key: 'assets',   label: 'Activos detectados',         value: 2847 },
      { key: 'vulns',    label: 'Vulnerabilidades detectadas', value: 18392 },
      { key: 'controls', label: 'Controles de seguridad',      value: 412 },
      { key: 'exposure', label: 'Señales de exposición',       value: 1136 },
      { key: 'intel',    label: 'Inteligencia de amenazas',    value: 96, suffix: ' fuentes' },
    ],
    separated: 'Fuentes detectadas · sin conexión entre sí',
    ready: 'Sistema listo',
    activate: 'Explorar la exposición',
    holdHint: 'Mantén presionado para activar',
  },

  /* ---------- 02 · EL MAPA ---------- */
  map: {
    kicker: 'Superficie de ataque',
    count: 2847,
    countLabel: 'activos',
    line: 'Cada punto es un activo. Cada línea, una dependencia.',
  },

  /* ---------- 03 · UNA VULNERABILIDAD ---------- */
  vuln: {
    lines: [
      'Un activo entre miles.',
      'Aparece una vulnerabilidad.',
      '¿Es realmente peligrosa?',
    ],
    detected: 'CVE detectada',
    investigating: 'Investigando',
  },

  /* ---------- 04 · LA SEÑAL Y SU CONTEXTO ---------- */
  context: {
    lines: [
      'Una vulnerabilidad no es el riesgo.',
      'Es una señal.',
      'El riesgo aparece cuando entendemos el contexto.',
    ],
    sourceLabel: 'Fuente',
    sourcesFooter: 'Contexto reunido desde',
  },
};
