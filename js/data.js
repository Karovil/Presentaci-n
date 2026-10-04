/* ==========================================================================
   DATOS DE LA EXPERIENCIA
   Todo el texto y la configuración narrativa vive aquí.
   Para cambiar un mensaje, una fuente o un paso, edita solo este archivo.
   ========================================================================== */
window.IRI = window.IRI || {};

IRI.data = {

  /* Orden y metadatos de las escenas.
     mood: intensidad del fondo ambiental (0 = vacío, 1 = denso). */
  scenes: [
    { id: 'activation', code: '01', name: 'Activación',       mood: 0.2 },
    { id: 'identity',   code: '02', name: 'Una identidad',    mood: 0.55 },
    { id: 'chaos',      code: '03', name: 'El caos',          mood: 0.3 },
    { id: 'silos',      code: '04', name: 'Piezas separadas', mood: 0.45, hint: 'Pasa el cursor sobre cada fuente' },
    { id: 'analyst',    code: '05', name: 'El analista',      mood: 0.4 },
    { id: 'question',   code: '06', name: 'La pregunta',      mood: 0.08 },
    { id: 'shift',      code: '07', name: 'El cambio',        mood: 0.4 },
    { id: 'reveal',     code: '08', name: 'Revelación',       mood: 0.6, hint: 'Fin de la primera parte' },
  ],

  defaultHint: 'Desplaza para continuar',

  /* ---------- 01 · ACTIVACIÓN ---------- */
  boot: {
    title: ['IDENTITY RISK', 'INTELLIGENCE'],
    initializing: 'INICIALIZANDO SISTEMA',
    ready: 'SISTEMA LISTO',
    cta: 'Iniciar experiencia',
    log: [
      { label: 'Despertando sensores',     state: 'OK' },
      { label: 'Escuchando señales',       state: 'OK' },
      { label: 'Reconociendo identidades', state: 'OK' },
      { label: 'Sincronizando fuentes',    state: 'OK' },
      { label: 'Construyendo contexto',    state: 'PENDIENTE', pending: true },
    ],
  },

  /* ---------- 02 · UNA IDENTIDAD ---------- */
  identity: {
    lines: [
      'Cada identidad deja huellas en todo lo que toca.',
      'Y no deja de generarlas. Cada minuto. Cada día.',
    ],
    core: 'Identidad',
    signals: [
      { icon: 'lock',   label: 'Autenticación', desc: 'Cómo y cuándo entró' },
      { icon: 'device', label: 'Dispositivo',   desc: 'Desde dónde lo hizo' },
      { icon: 'app',    label: 'Aplicación',    desc: 'Qué recurso utilizó' },
      { icon: 'globe',  label: 'Acceso',        desc: 'A qué intentó llegar' },
      { icon: 'alert',  label: 'Alerta',        desc: 'Qué llamó la atención', alert: true },
      { icon: 'clock',  label: 'Tiempo',        desc: 'Cuándo ocurrió cada cosa' },
    ],
    countAfter: 48,
  },

  /* ---------- 03 · EL CAOS ---------- */
  chaos: {
    labels: ['INICIO DE SESIÓN', 'DISPOSITIVO', 'APLICACIÓN', 'ACCESO', 'SESIÓN', 'UBICACIÓN', 'INICIO DE SESIÓN', 'DISPOSITIVO', 'ACCESO', 'APLICACIÓN'],
    alertLabel: 'ALERTA',
    alertRatio: 0.1,
    /* Población visual a lo largo del tiempo (segundos → partículas). */
    ramp: [[0, 0], [0.6, 5], [2.4, 5], [3.2, 20], [4.8, 20], [5.6, 50], [7, 50], [10.5, 460]],
    phrases: [
      'El problema no es la falta de información.',
      'Es la falta de <em>contexto</em>.',
    ],
  },

  /* ---------- 04 · PIEZAS SEPARADAS ---------- */
  silos: {
    statement: 'Cada fuente guarda una pieza. Ninguna tiene la historia completa.',
    /* x / y en % de la pantalla. knows / misses alimentan la tarjeta al pasar el cursor. */
    sources: [
      { key: 'identity', icon: 'user',     title: 'Identidad',     x: 15, y: 54, events: '1 cuenta',
        desc: 'Quién es y qué puede hacer',
        knows: 'Cuenta con permisos elevados',
        misses: 'Qué hizo en las últimas horas' },
      { key: 'auth',     icon: 'lock',     title: 'Autenticación', x: 37, y: 36, events: '1.284 eventos',
        desc: 'Cómo y cuándo se produjo el acceso',
        knows: 'Inicio de sesión a las 02:14, tras un intento fallido',
        misses: 'Si el equipo era conocido' },
      { key: 'device',   icon: 'device',   title: 'Dispositivos',  x: 64, y: 30, events: '3 equipos',
        desc: 'Desde dónde ocurrió la actividad',
        knows: 'Un equipo que nunca se había visto',
        misses: 'Quién lo estaba usando' },
      { key: 'app',      icon: 'app',      title: 'Aplicaciones',  x: 84, y: 48, events: '27 recursos',
        desc: 'Qué recurso fue utilizado',
        knows: 'Una aplicación poco habitual para esta persona',
        misses: 'Si hubo una alerta relacionada' },
      { key: 'alert',    icon: 'alert',    title: 'Alertas',       x: 47, y: 74, events: '6 alertas', alert: true,
        desc: 'Qué comportamiento llamó la atención',
        knows: 'Una ejecución inusual en un equipo',
        misses: 'A qué identidad pertenecía la sesión' },
      { key: 'incident', icon: 'incident', title: 'Incidentes',    x: 75, y: 78, events: '1 caso abierto',
        desc: 'Qué casos ya se están investigando',
        knows: 'Un caso abierto hace tres días',
        misses: 'Si tiene relación con esta actividad' },
    ],
    /* Pares de fuentes que "intentan" conectarse sin lograrlo. */
    gaps: [['identity', 'auth'], ['auth', 'device'], ['device', 'app'], ['auth', 'alert'], ['alert', 'incident'], ['app', 'incident'], ['identity', 'alert']],
    knowsLabel: 'Sabe',
    missesLabel: 'No sabe',
  },

  /* ---------- 05 · EL ANALISTA ---------- */
  analyst: {
    lines: [
      'Alguien tiene que unir las piezas. A mano.',
      'Horas reconstruyendo una historia que ya estaba en los datos.',
    ],
    windows: [
      { key: 'auth',     title: 'Autenticaciones', meta: '1.284', x: 17, y: 44, kind: 'rows' },
      { key: 'device',   title: 'Dispositivos',    meta: '3',     x: 39, y: 22, kind: 'rows' },
      { key: 'app',      title: 'Aplicaciones',    meta: '27',    x: 63, y: 22, kind: 'rows' },
      { key: 'alert',    title: 'Alertas',         meta: '6',     x: 84, y: 44, kind: 'rows', alert: true },
      { key: 'timeline', title: 'Línea de tiempo',        meta: '72 h',  x: 21, y: 76, kind: 'timeline' },
      { key: 'incident', title: 'Incidentes',      meta: '1',     x: 79, y: 76, kind: 'rows' },
    ],
    /* Cada verbo enfoca una ventana y suma esfuerzo a los medidores. */
    verbs: [
      { verb: 'Buscar',      win: 0, minutes: 18, queries: 3, certainty: 12 },
      { verb: 'Comparar',    win: 1, minutes: 26, queries: 2, certainty: 20 },
      { verb: 'Revisar',     win: 2, minutes: 31, queries: 4, certainty: 26 },
      { verb: 'Relacionar',  win: 3, minutes: 42, queries: 3, certainty: 33, misstep: 5 },
      { verb: 'Interpretar', win: 4, minutes: 35, queries: 2, certainty: 38 },
      { verb: 'Decidir',     win: 5, minutes: 28, queries: 2, certainty: 41 },
    ],
    overload: {
      titles: ['Búsqueda #2', 'Notas', 'Historial', 'Búsqueda #3', 'Correo del caso', 'Capturas', 'Otra consola', 'Búsqueda #4'],
      minutes: 232, queries: 31, certainty: 34,
    },
    meters: { time: 'Tiempo invertido', queries: 'Consultas', windows: 'Ventanas', certainty: 'Certeza' },
  },

  /* ---------- 06 · LA PREGUNTA ---------- */
  question: [
    '¿Qué está pasando realmente?',
    '¿Podemos confiar en esta identidad?',
  ],

  /* ---------- 07 · EL CAMBIO ---------- */
  shift: {
    /* Las cuatro fuentes que convergen, en orden. */
    sources: [
      { icon: 'lock',   label: 'Autenticación', x: 27, y: 22 },
      { icon: 'device', label: 'Dispositivo',   x: 74, y: 22 },
      { icon: 'app',    label: 'Aplicación',    x: 74, y: 80 },
      { icon: 'alert',  label: 'Alerta',        x: 27, y: 80, alert: true },
    ],
    chainEnd: 'Contexto',
    captions: [
      '¿Y si las piezas pudieran encontrarse solas?',
      'Cada señal encuentra su lugar.',
    ],
  },

  /* ---------- 08 · REVELACIÓN ---------- */
  reveal: {
    title: ['IDENTITY RISK', 'INTELLIGENCE'],
    subtitle: 'Convertimos señales fragmentadas en contexto para tomar mejores decisiones.',
    org: 'Academia Bintec 2026',
    next: 'A continuación — Cómo lo resolvimos',
  },

  /* ---------- ICONOS (trazos 24×24, sin relleno) ---------- */
  icons: {
    user:     '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.9 4.3-5.8 7.5-5.8s6.1 1.9 7.5 5.8"/>',
    lock:     '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/><path d="M12 14.2v2.2"/>',
    device:   '<rect x="4" y="5" width="16" height="10.5" rx="1.5"/><path d="M2.5 19h19"/>',
    app:      '<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>',
    globe:    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.6 2.6 14.4 0 17"/><path d="M12 3.5c-2.6 2.6-2.6 14.4 0 17"/>',
    alert:    '<path d="M12 4.2 20.5 19H3.5z"/><path d="M12 10v4"/><path d="M12 16.6v.1"/>',
    clock:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    incident: '<rect x="4" y="8" width="16" height="12" rx="1.5"/><path d="M6.5 5h11"/><path d="M9 2.5h6"/><path d="M8 13h8"/>',
  },
};
