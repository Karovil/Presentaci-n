/* ==========================================================================
   EXPIA · SER EJEMPLO — TEXTOS, DATOS Y GUION
   Audiencia: vicepresidentes. Lenguaje de negocio, sin tecnicismos.
   Foco: la banca y el core bancario en el radar de los atacantes.

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
    id: 'hook', type: 'hook', name: 'Tres minutos', t: 12,
    notes: 'Tenemos tres minutos. Les pido que miren el reloj de arriba a la derecha: va a contar algo mientras hablamos.',
  },
  {
    id: 'world', type: 'world', name: 'La banca, en la mira', t: 24,
    notes: 'Este es el radar de 2026 para la banca. JPMorgan, Visa y Mastercard: datos de clientes publicados en noviembre. Aquí en Colombia, BBVA y Nu, en marzo. Dieciséis entidades financieras en Corea atacadas con inteligencia artificial. Cooperativas en Estados Unidos con servicios caídos durante meses. Bancos distintos, países distintos, un mismo patrón: la puerta estaba abierta.',
    events: [
      { a: -58, d: 0.64, c: 'red',    label: 'JPMorgan · Visa · Mastercard', sub: 'Datos de 16.000 clientes publicados · nov', third: true },
      { a: -14, d: 0.86, c: 'orange', label: 'BBVA y Nu · Colombia',         sub: 'Datos de clientes expuestos · mar', third: true },
      { a: 30,  d: 0.56, c: 'violet', label: 'Banca · Corea del Sur',        sub: '16 entidades atacadas con IA · oct' },
      { a: 70,  d: 0.80, c: 'red',    label: 'TruStage · EE. UU.',           sub: 'Servicios a cooperativas caídos por meses', third: true },
      { a: 118, d: 0.66, c: 'yellow', label: 'KelpDAO',                      sub: 'USD 293 M robados en un ataque · abr' },
      { a: 160, d: 0.86, c: 'orange', label: 'River Bank & Trust',           sub: 'Sistemas secuestrados · jun' },
      { a: 206, d: 0.60, c: 'red',    label: 'Dos bancos · EE. UU.',          sub: 'Atacados a través de un proveedor · abr', third: true },
      { a: 248, d: 0.80, c: 'violet', label: 'Colombia',                     sub: '+30 incidentes en la ola de mayo' },
    ],
    title: '2026: la banca, en la mira.',
    line: 'Bancos distintos. Países distintos. Un mismo patrón: <b>la puerta estaba abierta</b>.',
  },
  {
    id: 'money', type: 'stat', name: 'Lo que cuesta', t: 16,
    notes: 'Y abrir esa puerta cuesta: más de seis millones de dólares por brecha en el sector financiero. Y para liberar los sistemas secuestrados de un banco, los atacantes piden en promedio tres millones: más que a cualquier otra industria.',
    k: 'Sector financiero · 2026',
    prefix: 'USD', value: 6.29, dec: 2, unit: 'M',
    big: 'cuesta en promedio una brecha en una entidad financiera.',
    sub: 'Solo el sector salud cuesta más. Y por liberar sus sistemas, a la banca le piden <b>USD 3 M</b>: más que a cualquier otra industria.',
    src: 'IBM Cost of a Data Breach 2026 · Sophos 2026',
    tone: 'orange',
  },
  {
    id: 'third', type: 'stat', name: 'La puerta no siempre es nuestra', t: 16,
    notes: 'Y la puerta no siempre es nuestra: casi la mitad de las brechas entra por un proveedor o un aliado. Así les pasó a BBVA y Nu en Colombia, y a JPMorgan este mes.',
    k: 'La puerta no siempre es nuestra',
    value: 48, from: 30, unit: '%',
    big: 'de las brechas entra por un proveedor o un aliado.',
    sub: 'Un año antes era <s>30 %</s>. Así llegaron a <b>BBVA, Nu y JPMorgan</b> en 2026.',
    src: 'Verizon DBIR 2026',
    tone: 'violet',
  },
  {
    id: 'race', type: 'race', name: 'La carrera', t: 16,
    notes: 'Y es una carrera. Los atacantes usan una falla, en promedio, una semana antes de que exista la solución. Nosotros tardamos cuarenta y tres días en cerrarla. Ellos se mueven en días; nosotros, en semanas.',
    att: { n: '7', u: 'días antes', l: 'de que exista la solución, los atacantes ya están usando la falla', src: 'Mandiant M-Trends 2026' },
    def: { n: '43', u: 'días', l: 'tardamos en cerrar las fallas que ya se están usando para atacar', src: 'Verizon DBIR 2026' },
    patch: 'Llega la solución',
    line: 'Ellos se mueven en días. <b>Nosotros, en semanas.</b>',
  },
  {
    id: 'ai', type: 'ai', name: 'El atacante ya automatizó', t: 16,
    notes: 'Y ya automatizaron: cientos de agentes de inteligencia artificial atacaron casi cuatrocientas organizaciones en cuarenta y ocho países, en días. Ellos no revisan un sistema a la vez. ¿Por qué nosotros sí?',
    stats: [
      { n: 395, l: 'organizaciones' },
      { n: 48,  l: 'países' },
      { n: 1,   l: 'sola falla' },
    ],
    k: 'Septiembre de 2026',
    big: 'Cientos de agentes de IA. Un solo ataque coordinado.',
    side: '<b>1 de cada 4</b> brechas ya usa inteligencia artificial',
    sideSrc: 'IBM 2026',
    src: 'GreyNoise, sep 2026',
    line: 'Ellos no revisan un sistema a la vez. <b>¿Por qué nosotros sí?</b>',
  },
  {
    id: 'here', type: 'stat', name: 'Aquí', t: 14,
    notes: 'Y no es un problema de otros. En Colombia, cada organización recibe más de cuatro mil intentos de ataque por semana: uno cada dos minutos y medio. Antes de terminar, ese reloj marcará uno.',
    k: 'Colombia · octubre de 2026',
    value: 4151,
    big: 'intentos de ataque por semana contra cada organización.',
    sub: 'Uno cada <b>2,4 minutos</b>. Mírelo en el reloj <span class="arrow-up">↗</span>',
    src: 'Check Point Research · promedio por organización',
    tone: 'red',
  },
  {
    id: 'noise', type: 'noise', name: 'Sin mapa', t: 14,
    notes: 'El problema no es que no tengamos información. Tenemos demasiada. Miles de alertas, en doce herramientas que no conversan entre sí. Tenemos datos. No tenemos el mapa.',
    counts: [
      { n: 18392, l: 'alertas abiertas' },
      { n: 12,    l: 'herramientas' },
      { n: 0,     l: 'visión de conjunto' },
    ],
    big: 'Tenemos datos. <em>No tenemos el mapa.</em>',
    line: 'El reto no es ver más. Es saber qué importa para el negocio.',
  },
  {
    id: 'expia', type: 'expia', name: 'EXPIA', t: 24,
    notes: 'Eso es EXPIA. Conecta toda esa información y nos muestra el camino que un atacante recorrería hasta lo que más importa: de Internet, por la banca en línea, hasta el core bancario y nuestros clientes. Ve todo en un mapa, prioriza por impacto al negocio, lo explica en lenguaje claro, y la decisión queda en nuestro equipo.',
    title: 'EXPIA',
    sub: 'Exposure & Intelligence Platform',
    big: 'Muestra el camino que un atacante recorrería <em>hasta el core</em>.',
    chain: [
      { l: 'Internet',            s: 'Cualquier persona',        c: 'red' },
      { l: 'Banca en línea',      s: 'Canal abierto al público', c: 'yellow' },
      { l: 'Falla sin cerrar',    s: 'Ya se usa en ataques',     c: 'red' },
      { l: 'Acceso privilegiado', s: 'Una llave maestra',        c: 'violet' },
      { l: 'Core bancario',       s: 'Sistema crítico',          c: 'ink' },
      { l: 'Clientes',            s: 'Datos · saldos · confianza', c: 'orange' },
    ],
    pillars: [
      { k: '01', l: 'Ve',        s: 'toda nuestra exposición en un solo mapa' },
      { k: '02', l: 'Prioriza',  s: 'por impacto real en el negocio' },
      { k: '03', l: 'Explica',   s: 'en lenguaje claro y con evidencia' },
      { k: '04', l: 'Decide',    s: 'nuestro equipo, rápido y con contexto' },
    ],
    note: 'Caso ilustrativo',
  },
  {
    id: 'result', type: 'result', name: 'De ruido a decisión', t: 12,
    notes: 'El resultado: de dieciocho mil alertas a tres decisiones que podemos tomar hoy. Y las organizaciones que usan IA y automatización en seguridad reducen en casi dos millones de dólares el costo de una brecha.',
    funnel: [
      { n: 18392, l: 'alertas' },
      { n: 1136,  l: 'riesgos posibles' },
      { n: 24,    l: 'riesgos reales' },
      { n: 3,     l: 'decisiones para hoy', hot: true },
    ],
    money: [
      { n: 'USD 6,29 M', l: 'costo promedio de una brecha financiera' },
      { n: '− USD 1,93 M', l: 'con IA y automatización en seguridad', good: true },
    ],
    src: 'IBM Cost of a Data Breach 2026 · embudo ilustrativo',
    line: 'Menos ruido. <b>Más decisión.</b>',
  },
  {
    id: 'close', type: 'close', name: 'Cierre', t: 12,
    notes: 'Tres minutos. El mundo no se detuvo, y nuestra exposición tampoco. La confianza de nuestros clientes depende de verla a tiempo. EXPIA la mantiene en el radar.',
    a: 'En tres minutos el mundo no se detuvo.',
    b: 'Nuestra exposición tampoco.',
    c: 'EXPIA la mantiene <em>en el radar</em>.',
    ask: 'Hagamos de nuestra organización el ejemplo.',
  },
];

SX.sources = [
  'IBM · Cost of a Data Breach 2026',
  'Verizon · DBIR 2026',
  'Mandiant · M-Trends 2026',
  'Sophos · ransomware en servicios financieros 2026',
  'Check Point Research · Colombia, oct 2026',
  'GreyNoise · sep 2026',
  'Prensa 2026 (Reuters, Euronews, Washington Post, Portafolio, Infobae, SecurityWeek)',
];
