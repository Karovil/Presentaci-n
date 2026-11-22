/* ==========================================================================
   EXPIA · SER EJEMPLO — TEXTOS, DATOS Y GUION
   Todo el texto visible está aquí. Para cambiar un mensaje, edita solo
   este archivo. `t` = segundos asignados a la escena en modo automático
   (la suma es 180). `notes` = lo que dice quien presenta.
   ========================================================================== */
window.SX = window.SX || {};

SX.total = 180;

/* Ataques semanales por organización en Colombia (Check Point Research, oct 2026)
   → un ataque cada 10.080 / 4.151 ≈ 2,43 minutos */
SX.weekly = 4151;

SX.scenes = [
  {
    id: 'hook', name: 'Tres minutos', t: 12,
    notes: 'Tenemos tres minutos. Les pido que miren el reloj de arriba a la derecha: va a contar algo mientras hablo.',
  },
  {
    id: 'world', name: '2026 en el radar', t: 24,
    notes: '2026 no ha sido un año normal. Plataformas educativas con cientos de millones de registros, plantas de agua bloqueadas por credenciales por defecto, el sector financiero coreano atacado con IA, una guerra que también se libra en la red. Sectores y países distintos, un mismo patrón: lo que estaba expuesto.',
    events: [
      { a: -62,  d: 0.62, c: 'red',    label: 'Canvas · Instructure',        sub: 'Hasta 275 M de personas, según el atacante · may' },
      { a: -18,  d: 0.84, c: 'orange', label: 'Plantas de agua · Minnesota', sub: '+30 bloqueadas · credenciales por defecto en equipos expuestos · jul' },
      { a: 24,   d: 0.55, c: 'violet', label: 'Sector financiero · Corea',   sub: '16 entidades · ataques asistidos por IA · oct' },
      { a: 66,   d: 0.80, c: 'red',    label: 'PaperCut',                    sub: '440 servidores · 48 países · agentes de IA' },
      { a: 118,  d: 0.66, c: 'yellow', label: 'KelpDAO',                     sub: '≈ USD 293 M robados · abr' },
      { a: 158,  d: 0.86, c: 'violet', label: 'Guerra en Irán',              sub: '+60 grupos hacktivistas activos · mar' },
      { a: 204,  d: 0.58, c: 'orange', label: 'Registro civil · Dinamarca',  sub: 'Brecha del registro nacional · oct' },
      { a: 246,  d: 0.78, c: 'red',    label: 'Colombia',                    sub: '+30 incidentes en la ola de mayo' },
    ],
    title: '2026 no ha sido un año normal.',
    line: 'Distintos sectores. Distintos países. Un mismo patrón: <b>lo que estaba expuesto</b>.',
  },
  {
    id: 'door', name: 'La puerta principal', t: 18,
    notes: 'Y hay un dato que cambia la conversación: por primera vez en diecinueve años de informe de Verizon, la primera vía de entrada de las brechas es explotar una vulnerabilidad. Treinta y uno por ciento. Ya no es la contraseña robada: es lo que dejamos expuesto.',
    value: 31, from: 20, unit: '%',
    k: 'Primera vía de entrada de las brechas',
    big: 'empezaron explotando una vulnerabilidad.',
    sub: 'Por primera vez en 19 años supera al robo de credenciales · <s>20 %</s> el año anterior.',
    src: 'Verizon DBIR 2026',
  },
  {
    id: 'race', name: 'La carrera', t: 20,
    notes: 'Y es una carrera que vamos perdiendo. En promedio, el atacante explota la falla siete días antes de que exista el parche. Nosotros tardamos cuarenta y tres días en cerrar las vulnerabilidades que ya sabemos que se están explotando. Solo una de cada cuatro críticas se cierra por completo.',
    att: { n: '−7', u: 'días', l: 'El atacante explota antes de que exista el parche (promedio)', src: 'Mandiant M-Trends 2026' },
    def: { n: '43', u: 'días', l: 'Tardamos en remediar una vulnerabilidad que ya se explota (mediana KEV)', src: 'Verizon DBIR 2026' },
    foot: 'Solo el <b>26 %</b> de las vulnerabilidades críticas explotadas se remedió por completo.',
    line: 'No llegamos tarde por falta de esfuerzo. Llegamos tarde por diseño.',
  },
  {
    id: 'ai', name: 'El atacante ya automatizó', t: 20,
    notes: 'Además, el atacante ya automatizó. En septiembre, cientos de agentes de IA comprometieron 440 servidores en 48 países pocos días después de publicada la falla. Una de cada cuatro brechas maliciosas ya usa IA. Ellos no investigan un activo a la vez. ¿Por qué nosotros sí?',
    stats: [
      { n: 440, l: 'servidores comprometidos' },
      { n: 395, l: 'organizaciones' },
      { n: 48,  l: 'países' },
    ],
    k: 'Septiembre de 2026 · falla de PaperCut',
    big: 'Cientos de agentes de IA. Un solo ataque coordinado.',
    side: '<b>1 de cada 4</b> brechas maliciosas ya usa IA',
    sideSrc: 'IBM Cost of a Data Breach 2026',
    src: 'GreyNoise, sep 2026',
    line: 'El atacante no investiga un activo a la vez. <b>¿Por qué nosotros sí?</b>',
  },
  {
    id: 'here', name: 'Aquí', t: 16,
    notes: 'Y no es un problema de otros. En Colombia cada organización recibe en promedio más de cuatro mil ataques por semana. Uno cada dos minutos y medio. Antes de que termine esta presentación, el reloj de arriba va a marcar uno.',
    value: 4151,
    k: 'Colombia · octubre de 2026',
    big: 'ataques por semana contra cada organización.',
    sub: '≈ uno cada <b>2,4 minutos</b>. Míralo en el reloj.',
    src: 'Check Point Research · promedio por organización',
  },
  {
    id: 'noise', name: 'El ruido', t: 16,
    notes: 'El problema no es que no veamos. Vemos demasiado. Dieciocho mil vulnerabilidades, doce herramientas, y ninguna conversa con la otra. Vemos señales. No vemos exposición.',
    counts: [
      { n: 18392, l: 'vulnerabilidades' },
      { n: 12,    l: 'fuentes' },
      { n: 0,     l: 'conexiones entre ellas' },
    ],
    big: 'Vemos señales. <em>No vemos exposición.</em>',
    line: 'El reto no es ver más. Es saber qué importa.',
  },
  {
    id: 'expia', name: 'EXPIA', t: 26,
    notes: 'Eso es EXPIA. Toma todas las señales y las conecta en una sola historia: desde Internet, por el firewall, al servidor de nómina, a la vulnerabilidad, a la cuenta privilegiada, hasta la base de datos. Automatiza lo repetitivo, agentes especialistas investigan cada dimensión, la IA explica con evidencia y el analista decide.',
    title: 'EXPIA',
    sub: 'Exposure & Intelligence Platform',
    big: 'Conecta las señales en una <em>ruta de exposición</em>.',
    chain: [
      { l: 'Internet',         s: 'Origen externo',          c: 'red' },
      { l: 'Firewall',         s: 'Regla 443 abierta',       c: 'yellow' },
      { l: 'SRV-PS-014',       s: 'Servidor de nómina',      c: 'ink' },
      { l: 'CVE crítica',      s: 'RCE · en catálogo KEV',   c: 'red' },
      { l: 'svc_peoplesoft',   s: 'Cuenta con admin local',  c: 'violet' },
      { l: 'BD de nómina',     s: 'Recurso sensible',        c: 'orange' },
    ],
    pillars: [
      { k: '01', l: 'Automatiza',  s: 'lo repetitivo: recopilar, correlacionar, deduplicar' },
      { k: '02', l: 'Investiga',   s: 'con agentes especialistas: ARGUS · AGORA · AEGIS' },
      { k: '03', l: 'Explica',     s: 'con IA y evidencia trazable' },
      { k: '04', l: 'Decide',      s: 'el analista, con contexto' },
    ],
    note: 'Caso ilustrativo',
  },
  {
    id: 'result', name: 'De ruido a decisión', t: 18,
    notes: 'El resultado: de dieciocho mil señales a tres exposiciones críticas que alguien puede atender hoy. Y no es solo eficiencia: usar IA y automatización en seguridad reduce en casi dos millones de dólares el costo promedio de una brecha.',
    funnel: [
      { n: 18392, l: 'señales' },
      { n: 1136,  l: 'exposiciones' },
      { n: 24,    l: 'relevantes' },
      { n: 3,     l: 'críticas', hot: true },
    ],
    money: [
      { n: 'USD 4,99 M', l: 'costo promedio de una brecha en 2026' },
      { n: '− USD 1,93 M', l: 'con uso extensivo de IA y automatización en seguridad', good: true },
    ],
    src: 'IBM Cost of a Data Breach 2026 · embudo ilustrativo',
    line: 'Menos ruido. <b>Más decisión.</b>',
  },
  {
    id: 'close', name: 'Cierre', t: 10,
    notes: 'Tres minutos. El mundo no se detuvo, y nuestra exposición tampoco. EXPIA la mantiene en el radar.',
    a: 'En tres minutos el mundo no se detuvo.',
    b: 'Nuestra exposición tampoco.',
    c: 'EXPIA la mantiene <em>en el radar</em>.',
    ask: 'Hagamos de nuestra organización el ejemplo.',
  },
];

SX.sources = [
  'Verizon · Data Breach Investigations Report 2026',
  'Mandiant · M-Trends 2026',
  'IBM · Cost of a Data Breach Report 2026',
  'Check Point Research · Colombia, octubre 2026',
  'GreyNoise · explotación de PaperCut, septiembre 2026',
  'Prensa internacional 2026 (Canvas, Minnesota, Corea, KelpDAO, Irán, Dinamarca)',
];
