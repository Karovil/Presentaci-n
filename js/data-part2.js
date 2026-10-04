/* ==========================================================================
   DATOS — SEGUNDA PARTE
   De la alerta a la decisión: investigación manual, automatización, IA,
   Identity Risk Score y visión de futuro.
   Se añaden a IRI.data sin modificar la primera parte.
   ========================================================================== */
IRI.data.scenes.push(
  { id: 'alert',      code: '09', name: 'La alerta',             mood: 0.35, part: 2 },
  { id: 'case',       code: '10', name: 'Se abre el caso',       mood: 0.4 },
  { id: 'manual',     code: '11', name: 'Investigación manual',  mood: 0.35, hint: 'Avanza para acelerar cada acción' },
  { id: 'time',       code: '12', name: 'El tiempo',             mood: 0.3 },
  { id: 'ask',        code: '13', name: 'Otra pregunta',         mood: 0.06 },
  { id: 'automation', code: '14', name: 'Automatización',        mood: 0.45 },
  { id: 'ai',         code: '15', name: 'La capa de IA',         mood: 0.4, hint: 'Pasa el cursor sobre cada referencia' },
  { id: 'score',      code: '16', name: 'Identity Risk Score',   mood: 0.35 },
  { id: 'decide',     code: '17', name: 'El analista decide',    mood: 0.4 },
  { id: 'compress',   code: '18', name: '3 días → 5 minutos',    mood: 0.2 },
  { id: 'future',     code: '19', name: 'El futuro',             mood: 0.6, hint: 'Fin de la segunda parte' },
);

/* Caso que se investiga durante toda la segunda parte */
IRI.data.caseId = 'IR-2047';

Object.assign(IRI.data, {

  /* ---------- 09 · LA ALERTA ---------- */
  alert: {
    states: ['NORMAL', 'INVESTIGATION REQUIRED', 'RISK DETECTED'],
    stateLabel: 'Estado',
    detected: 'Risk signal detected',
    created: 'Case created',
    lines: ['Algo pasó.', 'Ahora tenemos que investigar.'],
  },

  /* ---------- 10 · SE ABRE LA INVESTIGACIÓN ---------- */
  case: {
    title: 'Identity under investigation',
    status: 'Open',
    owner: 'Analista SOC · Nivel 2',
    opened: 'Abierto hace 2 min',
    question: '¿Qué ocurrió?',
    evidence: [
      { icon: 'lock',     label: 'Authentication' },
      { icon: 'device',   label: 'Device' },
      { icon: 'app',      label: 'Application' },
      { icon: 'globe',    label: 'Access' },
      { icon: 'alert',    label: 'Alert', alert: true },
      { icon: 'activity', label: 'Activity' },
      { icon: 'clock',    label: 'Timeline' },
    ],
  },

  /* ---------- 11 · LA INVESTIGACIÓN MANUAL ----------
     Cada acción tiene una viñeta visual (kind), un verbo y la evidencia
     que deja sobre la línea de tiempo (chip + posición 0–1). */
  manual: {
    statement: 'Cada respuesta abre otra búsqueda.',
    actions: [
      { verb: 'Search',   text: 'Buscar una autenticación',      kind: 'search',  hours: 2.5, chip: '02:14 · inicio de sesión', at: 0.40, lane: 0 },
      { verb: 'Review',   text: 'Revisar el dispositivo',        kind: 'device',  hours: 3,   chip: 'Equipo nunca visto',       at: 0.47, lane: 1 },
      { verb: 'Review',   text: 'Consultar la aplicación',       kind: 'apps',    hours: 2.5, chip: 'Aplicación poco habitual', at: 0.57, lane: 0 },
      { verb: 'Search',   text: 'Buscar actividad histórica',    kind: 'history', hours: 4,   chip: 'Fuera de su patrón',       at: 0.13, lane: 0 },
      { verb: 'Compare',  text: 'Comparar horarios',             kind: 'compare', hours: 3.5, chip: '6 min de diferencia',      at: 0.65, lane: 1 },
      { verb: 'Filter',   text: 'Revisar alertas relacionadas',  kind: 'alerts',  hours: 4,   chip: 'Alerta en el mismo equipo', at: 0.76, lane: 0, alert: true },
      { verb: 'Relate',   text: 'Relacionar eventos',            kind: 'relate',  hours: 5,   chip: null },
      { verb: 'Document', text: 'Construir la línea de tiempo',  kind: 'order',   hours: 6,   chip: null },
      { verb: 'Validate', text: 'Validar la evidencia',          kind: 'validate',hours: 5.5, chip: null },
      { verb: 'Decide',   text: 'Interpretar',                   kind: 'interpret', hours: 4, chip: null },
    ],
    stepMs: 1900,
    readout: { elapsed: 'Tiempo', queries: 'Consultas', sources: 'Fuentes' },
    timelineLabel: 'Línea de tiempo del caso',
  },

  /* ---------- 12 · EL TIEMPO ---------- */
  time: {
    days: ['DAY 01', 'DAY 02', 'DAY 03'],
    dayNotes: [
      'Búsquedas, consultas, primeras hipótesis.',
      'Más ventanas. Más evidencia. Más validaciones.',
      'La historia todavía se está reconstruyendo.',
    ],
    total: '03 DAYS',
    lines: [
      'Much of the time is spent reconstructing the context.',
      'No es lentitud. Es información fragmentada.',
    ],
  },

  /* ---------- 13 · LA PREGUNTA ---------- */
  ask: {
    total: '03 DAYS',
    questions: [
      '¿Y si no tuviéramos que hacer todo esto manualmente?',
      '¿Qué parte de la investigación puede hacer una máquina?',
    ],
  },

  /* ---------- 14 · AUTOMATIZACIÓN ---------- */
  automation: {
    kicker: 'Automatización',
    statement: 'Automation does the work.',
    trigger: 'Automation triggered',
    ready: 'Context ready',
    stages: [
      { label: 'Recopila',   sub: 'todas las fuentes, en paralelo' },
      { label: 'Organiza',   sub: 'mismo formato, sin duplicados' },
      { label: 'Relaciona',  sub: 'eventos de la misma historia' },
      { label: 'Contexto',   sub: 'una visión de la identidad' },
    ],
    sources: ['Autenticación', 'Dispositivo', 'Aplicación', 'Acceso', 'Alerta', 'Historial'],
    elapsedLabel: 'Tiempo',
    eventsLabel: 'Eventos',
  },

  /* ---------- 15 · LA CAPA DE IA ---------- */
  ai: {
    statement: 'AI helps understand it.',
    question: '¿Por qué esta identidad requiere atención?',
    /* La respuesta cita evidencia: [n] enlaza con evidence[n-1] */
    answer: [
      'Inicio de sesión a las 02:14 desde un equipo nunca visto [1], tras un intento fallido [2]. ',
      'Seis minutos después se usó una aplicación poco habitual [3] y se generó una alerta en el mismo equipo [4]. ',
      'El riesgo se reduce porque se usó autenticación fuerte [5].',
    ],
    evidence: [
      { label: 'Equipo nunca visto',       icon: 'device', x: 22, y: 30 },
      { label: 'Intento fallido',          icon: 'lock',   x: 10, y: 54 },
      { label: 'Aplicación poco habitual', icon: 'app',    x: 36, y: 66 },
      { label: 'Alerta en el equipo',      icon: 'alert',  x: 40, y: 36, alert: true },
      { label: 'Autenticación fuerte',     icon: 'lock',   x: 16, y: 80, reduces: true },
    ],
    principle: 'La IA explica la evidencia. No inventa el veredicto.',
    sourcesNote: 'Fuentes citadas · 5 eventos · 4 fuentes',
  },

  /* ---------- 16 · IDENTITY RISK SCORE ---------- */
  score: {
    title: 'Identity Risk Score',
    max: 100,
    /* El puntaje se construye factor a factor: cada uno suma o resta. */
    base: 12,
    factors: [
      { label: 'Equipo nunca visto',          delta: 18 },
      { label: 'Aplicación poco habitual',    delta: 14 },
      { label: 'Intento fallido previo',      delta: 9 },
      { label: 'Alerta en el mismo equipo',   delta: 21, alert: true },
      { label: 'Autenticación fuerte',        delta: -11 },
      { label: 'Ubicación conocida',          delta: -5 },
    ],
    levels: [[0, 'Bajo'], [35, 'Medio'], [70, 'Alto']],
    levelLabel: 'Nivel de riesgo',
    note: 'Cada punto tiene una evidencia detrás.',
  },

  /* ---------- 17 · EL ANALISTA DECIDE ---------- */
  decide: {
    lines: ['Automation does the work.', 'AI helps understand it.', 'The analyst decides.'],
    layers: ['Automatización', 'Inteligencia artificial', 'Analista'],
    summary: [
      { k: 'Caso', v: '#IR-2047' },
      { k: 'Evidencia', v: '5 hechos · 4 fuentes' },
      { k: 'Score', v: '58 · Medio' },
    ],
    options: ['Escalar', 'Contener', 'Monitorear', 'Cerrar'],
    optionsLabel: 'Decisión del analista',
  },

  /* ---------- 18 · DE 3 DÍAS A 5 MINUTOS ---------- */
  compress: {
    from: { value: '03', unit: 'DAYS' },
    to: { value: '05', unit: 'MIN' },
    fromLabel: 'Investigación manual',
    toLabel: 'Investigación automatizada y contextualizada',
    line: 'De reconstruir el contexto a revisarlo.',
    note: 'Estimación del flujo automatizado · a validar en el piloto',
  },

  /* ---------- 19 · EL FUTURO ---------- */
  future: {
    today: 'Hoy',
    tomorrow: 'Mañana',
    todayTitle: 'Human identity',
    tomorrowTitle: 'Human + non-human identities',
    rings: [
      { label: 'Hoy',        items: [{ icon: 'user', label: 'Usuario' }, { icon: 'key', label: 'Cuenta privilegiada' }] },
      { label: 'Evolución',  items: [{ icon: 'gear', label: 'Cuenta de servicio' }, { icon: 'app', label: 'Service principal' }] },
      { label: 'Futuro',     items: [{ icon: 'flow', label: 'Workflow automatizado' }, { icon: 'agent', label: 'Agente de IA' }] },
    ],
    line: 'Misma trazabilidad. Mismo contexto. Nuevos tipos de identidad.',
    end: 'Identity Risk Intelligence',
  },
});

/* Iconos adicionales (trazo 24×24) */
Object.assign(IRI.data.icons, {
  activity: '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
  key:      '<circle cx="8" cy="12" r="4"/><path d="M12 12h9"/><path d="M17.5 12v3"/><path d="M20.5 12v2"/>',
  gear:     '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  flow:     '<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><rect x="9" y="15" width="6" height="5" rx="1"/><path d="M9 6.5h6"/><path d="M18 9v3H12v3"/>',
  agent:    '<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 7V4"/><circle cx="12" cy="3.5" r="0.8"/><circle cx="9.5" cy="12" r="1"/><circle cx="14.5" cy="12" r="1"/><path d="M9.5 15.2h5"/>',
  search:   '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5.5 5.5"/>',
});
