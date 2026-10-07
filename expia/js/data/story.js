/* ==========================================================================
   EXPIA · HISTORIA (escenas 05–39)
   Texto y datos de demostración de toda la experiencia ampliada.
   Las cifras son ilustrativas. Para cambiar un mensaje, edita solo aquí.
   ========================================================================== */
EX.text.scenes.push(
  /* Bloque 1 · fragmentación */
  { id: 'sources',    code: '05', name: 'Datos fragmentados',          layer: 'Fuentes', hint: 'Pasa el cursor por cada fuente' },
  { id: 'grow',       code: '06', name: 'La superficie crece',         layer: 'Ecosistema' },
  { id: 'alive',      code: '07', name: 'Una superficie viva',         layer: 'Ecosistema' },
  { id: 'volume',     code: '08', name: 'El volumen de señales',       layer: 'Señales' },
  { id: 'intake',     code: '09', name: 'EXPIA recibe todo',           layer: 'Núcleo', hint: 'Pasa el cursor por cada perspectiva' },
  /* Bloque 2 · automatización */
  { id: 'engine',     code: '10', name: 'Motor de automatización',     layer: 'Automatización' },
  { id: 'code',       code: '11', name: 'El código detrás',            layer: 'Automatización' },
  { id: 'specialists',code: '12', name: 'No todo es igual',            layer: 'Núcleo' },
  /* Bloque 3 · multi-agente */
  { id: 'agents',     code: '13', name: 'Nacen los agentes',           layer: 'Multi-agente', hint: 'Pasa el cursor o haz clic en un agente' },
  { id: 'argus',      code: '14', name: 'ARGUS',                       layer: 'Agente' },
  { id: 'agora',      code: '15', name: 'AGORA',                       layer: 'Agente' },
  { id: 'aegis',      code: '16', name: 'AEGIS',                       layer: 'Agente' },
  { id: 'more',       code: '17', name: 'Más especialistas',           layer: 'Multi-agente', hint: 'Pasa el cursor por cada especialista' },
  { id: 'delegate',   code: '18', name: 'Delegación',                  layer: 'Orquestación' },
  { id: 'collab',     code: '19', name: 'Los agentes colaboran',       layer: 'Orquestación' },
  /* Bloque 4 · exposición */
  { id: 'xgraph',     code: '20', name: 'El grafo de exposición',      layer: 'Grafo', hint: 'Pasa el cursor por el grafo' },
  { id: 'transform',  code: '21', name: 'De vulnerabilidad a exposición', layer: 'Contexto' },
  { id: 'path',       code: '22', name: 'Ruta de exposición',          layer: 'Ruta', hint: 'Pasa el cursor por la ruta' },
  { id: 'twin',       code: '23', name: 'Mismo CVE, dos contextos',    layer: 'Contexto' },
  { id: 'priority',   code: '24', name: 'Priorización',                layer: 'Priorización' },
  { id: 'insight',    code: '25', name: 'Inteligencia, no alertas',    layer: 'Inteligencia' },
  /* Bloque 5 · IA y decisión */
  { id: 'ai',         code: '26', name: 'La IA como capa',             layer: 'IA' },
  { id: 'explain',    code: '27', name: 'De datos a explicación',      layer: 'IA' },
  { id: 'evidence',   code: '28', name: 'Primero la evidencia',        layer: 'Evidencia', hint: 'Pasa el cursor por la explicación' },
  { id: 'score',      code: '29', name: 'Puntaje de exposición',       layer: 'Prioridad' },
  { id: 'human',      code: '30', name: 'El humano decide',            layer: 'Decisión', hint: 'Elige una decisión' },
  /* Bloque 6 · alcance y continuidad */
  { id: 'teams',      code: '31', name: '¿Y todo lo demás?',           layer: 'Capacidades', hint: 'Pasa el cursor por cada capacidad' },
  { id: 'lenses',     code: '32', name: 'Un caso, muchas miradas',     layer: 'Contexto' },
  { id: 'surface',    code: '33', name: 'La superficie completa',      layer: 'Organización', hint: 'Pasa el cursor por las zonas' },
  { id: 'evolve',     code: '34', name: 'Del inventario a la inteligencia', layer: 'Organización' },
  { id: 'loop',       code: '35', name: 'El ciclo multi-agente',       layer: 'Ciclo' },
  { id: 'continuous', code: '36', name: 'Automatización continua',     layer: 'Ciclo' },
  /* Bloque 7 · visión y cierre */
  { id: 'future',     code: '37', name: 'El futuro',                   layer: 'Horizonte' },
  { id: 'engine2',    code: '38', name: 'Un sistema de inteligencia',  layer: 'Sistema' },
  { id: 'close',      code: '39', name: 'Cierre',                      layer: 'EXPIA' },
);

/* Estaciones: lugares del mundo donde ocurre cada parte de la historia.
   El mapa de la organización está en el origen; el "motor" está debajo. */
EX.stations = {
  core:     { x: 0,     y: 3200 },
  pipeline: { x: -3400, y: 3200 },
  agents:   { x: 0,     y: 3200 },
  twin:     { x: 3600,  y: 3200 },
  transform:{ x: 3600,  y: 1500 },
  path:     { x: -3600, y: 1500 },
  funnel:   { x: 3600,  y: 5000 },
  insight:  { x: 0,     y: 5000 },
  ai:       { x: -3400, y: 5000 },
  human:    { x: 0,     y: 6600 },
  future:   { x: 0,     y: 3200 },
};

EX.story = {

  /* ---------- 05 · FUENTES ---------- */
  sources: {
    title: 'Datos de seguridad fragmentados',
    line: 'Cada fuente produce sus propias señales. Ninguna ve a las demás.',
    list: [
      { key: 'tenable',  name: 'Tenable',                    signals: 'Vulnerabilidades · CVE · CVSS' },
      { key: 'cortex',   name: 'Cortex Cloud',               signals: 'Exposición cloud · configuraciones' },
      { key: 'cmdb',     name: 'CMDB',                       signals: 'Activos · responsables · criticidad' },
      { key: 'ad',       name: 'Directorio Activo',          signals: 'Cuentas · grupos · privilegios' },
      { key: 'grc',      name: 'GRC · Excepciones',          signals: 'Excepciones · riesgos aceptados' },
      { key: 'cis',      name: 'Línea base CIS',             signals: 'Cumplimiento de configuración' },
      { key: 'fw',       name: 'Firewall',                   signals: 'Reglas · puertos publicados' },
      { key: 'posture',  name: 'Postura de seguridad',       signals: 'Debilidades · puntaje de postura' },
      { key: 'ti',       name: 'Inteligencia de amenazas',   signals: 'Explotación activa · KEV · campañas' },
      { key: 'vm',       name: 'Gestión de vulnerabilidades', signals: 'Seguimiento · SLA · remediación' },
      { key: 'am',       name: 'Gestión de activos',         signals: 'Inventario · ciclo de vida' },
      { key: 'iam',      name: 'Identidad',                  signals: 'Identidades cloud · cuentas de servicio' },
    ],
  },

  /* ---------- 06 · LA SUPERFICIE CRECE ---------- */
  grow: {
    lines: ['La superficie no son 2.847 activos.', 'Un activo no existe aislado.', 'Cada activo pertenece a un ecosistema.'],
    count: 16040,
    countLabel: 'entidades',
    facets: [
      { label: 'Vulnerabilidades', color: 'orange' },
      { label: 'Configuraciones',  color: 'yellow' },
      { label: 'Controles',        color: 'green' },
      { label: 'Exposición',       color: 'red' },
      { label: 'Software',         color: 'ink' },
      { label: 'Privilegios',      color: 'violet' },
      { label: 'Conexiones',       color: 'cyan' },
    ],
  },

  /* ---------- 07 · SUPERFICIE VIVA ---------- */
  alive: {
    kicker: 'Superficie de ataque · siempre cambiando',
    line: 'El riesgo no es estático.',
    events: [
      { label: 'Nuevo activo',            color: 'ink' },
      { label: 'Nueva vulnerabilidad',    color: 'orange' },
      { label: 'Control fallido',         color: 'yellow' },
      { label: 'Exposición detectada',    color: 'red' },
      { label: 'Cambio de privilegio',    color: 'violet' },
      { label: 'Nuevo software',          color: 'ink' },
      { label: 'Señal de amenaza',        color: 'violet' },
      { label: 'Configuración incorrecta', color: 'yellow' },
      { label: 'Excepción',               color: 'yellow' },
    ],
  },

  /* ---------- 08 · VOLUMEN ---------- */
  volume: {
    types: [
      { label: 'Vulnerabilidades',          color: 'orange', max: 18392 },
      { label: 'Brechas de control',        color: 'yellow', max: 4212 },
      { label: 'Señales de exposición',     color: 'red',    max: 1136 },
      { label: 'Señales de amenaza',        color: 'violet', max: 2870 },
      { label: 'Señales de identidad',      color: 'cyan',   max: 3644 },
      { label: 'Problemas de configuración', color: 'ink',   max: 6051 },
    ],
    lines: ['Demasiadas señales.', '¿Cuáles importan?'],
  },

  /* ---------- 09 · EXPIA RECIBE TODO ---------- */
  intake: {
    line: 'Siete perspectivas del mismo entorno.',
    perspectives: [
      { name: 'Tenable',                  sees: 'qué es vulnerable' },
      { name: 'Cortex Cloud',             sees: 'qué está expuesto' },
      { name: 'CMDB',                     sees: 'qué es y de quién' },
      { name: 'GRC',                      sees: 'qué riesgo se aceptó' },
      { name: 'Directorio Activo',        sees: 'quién tiene acceso' },
      { name: 'Líneas base',              sees: 'cómo debería estar configurado' },
      { name: 'Inteligencia de amenazas', sees: 'qué se está explotando' },
    ],
  },

  /* ---------- 10 · MOTOR DE AUTOMATIZACIÓN ---------- */
  engine: {
    title: 'Motor de automatización',
    line: 'Primero automatizamos el trabajo repetitivo.',
    stages: ['Recopilar', 'Filtrar', 'Normalizar', 'Emparejar', 'Enriquecer', 'Correlacionar', 'Validar', 'Deduplicar', 'Construir contexto'],
  },

  /* ---------- 11 · EL CÓDIGO DETRÁS ---------- */
  code: {
    line: 'Automatización determinística.',
    lines: [
      ['Recopilar',      'signals = [src.fetch(since=last_run) for src in sources]'],
      ['Filtrar',        'signals = [s for s in signals if s.asset_id and s.is_active]'],
      ['Normalizar',     's = normalize(s, schema="expia.signal.v1")'],
      ['Emparejar',      'asset = cmdb.match(s.asset_id)'],
      ['Enriquecer',     's.enrich(kev=threat.kev(s.cve), owner=asset.owner)'],
      ['Correlacionar',  'graph.relate(s, asset, by=["software", "network", "identity"])'],
      ['Validar',        'assert rules.validate(s)'],
      ['Deduplicar',     'graph.dedupe(key=("asset", "cve"))'],
      ['Construir contexto', 'context = graph.context(asset, depth=2)'],
    ],
    rule: [
      { k: 'Si ocurre',  v: 'CVE en KEV + activo expuesto a Internet' },
      { k: 'Ejecuta',    v: 'consultar controles y excepciones del activo' },
      { k: 'Obtén',      v: 'contexto listo para investigar' },
    ],
  },

  /* ---------- 12 · NO TODO ES IGUAL ---------- */
  specialists: {
    kinds: [
      { label: 'Vulnerabilidad', needs: 'versiones, explotabilidad, parches', color: 'orange' },
      { label: 'Postura',        needs: 'configuración, debilidades',        color: 'cyan' },
      { label: 'Control',        needs: 'líneas base, excepciones',          color: 'green' },
      { label: 'Exposición',     needs: 'superficie, alcance externo',       color: 'red' },
      { label: 'Identidad',      needs: 'cuentas, privilegios, accesos',     color: 'violet' },
      { label: 'Amenaza',        needs: 'campañas, técnicas, KEV',           color: 'violet' },
      { label: 'Activo',         needs: 'inventario, criticidad, relaciones', color: 'ink' },
    ],
    lines: ['No todas las investigaciones son iguales.', 'EXPIA necesita especialistas.'],
  },

  /* ---------- 13–19 · AGENTES ---------- */
  agents: {
    core: [
      { id: 'argus', name: 'ARGUS', domain: 'Inteligencia de vulnerabilidades', color: 'orange',
        desc: 'Investiga vulnerabilidades: versiones, explotabilidad, evidencia y amenazas asociadas.' },
      { id: 'agora', name: 'AGORA', domain: 'Postura de seguridad', color: 'cyan',
        desc: 'Evalúa postura: configuración, exposición, debilidades y estado de los activos.' },
      { id: 'aegis', name: 'AEGIS', domain: 'Controles y líneas base', color: 'green',
        desc: 'Valida controles CIS, líneas base, excepciones y cumplimiento técnico.' },
    ],
    more: [
      { id: 'asset',    name: 'Activos',     domain: 'Inteligencia de activos',     color: 'ink',    desc: 'Inventario, criticidad y dependencias.' },
      { id: 'identity', name: 'Identidad',   domain: 'Inteligencia de identidad',   color: 'violet', desc: 'Cuentas, grupos, privilegios y accesos.' },
      { id: 'threat',   name: 'Amenazas',    domain: 'Inteligencia de amenazas',    color: 'violet', desc: 'Campañas, técnicas y explotación activa.' },
      { id: 'network',  name: 'Red',         domain: 'Inteligencia de red',         color: 'cyan',   desc: 'Segmentos, reglas y alcance.' },
      { id: 'exposure', name: 'Exposición',  domain: 'Inteligencia de exposición',  color: 'red',    desc: 'Qué es alcanzable desde fuera.' },
      { id: 'software', name: 'Software',    domain: 'Aplicaciones no estándar',    color: 'yellow', desc: 'Versiones, software no estándar y su riesgo.' },
    ],
    /* Posiciones relativas al núcleo (unidades del mundo) */
    layout: {
      argus: [-430, -150], agora: [430, -150], aegis: [0, 330],
      identity: [-840, 170], asset: [-660, -470], threat: [660, -470], network: [840, 170], exposure: [-440, 560], software: [440, 560],
    },
    intro: ['Para resolver esto, EXPIA necesita especialistas.', 'Especialistas, no módulos.'],
    moreLine: 'No un cerebro que lo hace todo: especialistas en cada dimensión.',
  },

  argus: {
    task: 'CVE-2026-35273',
    facets: [
      ['Versión vulnerable', 'PeopleSoft 8.58'],
      ['Activo afectado', 'SRV-PS-014'],
      ['Criticidad', 'Alta · nómina'],
      ['Exposición', 'Publicado a Internet'],
      ['Software', 'Oracle PeopleSoft'],
      ['Explotabilidad', 'KEV · RCE sin autenticación'],
      ['Evidencia', 'Detección autenticada · 2 fuentes'],
      ['Contexto', '14 activos relacionados'],
    ],
    out: 'Inteligencia de vulnerabilidad',
    note: 'ARGUS no decide el riesgo. Construye inteligencia especializada.',
  },
  agora: {
    task: 'Postura de SRV-PS-014',
    facets: [
      ['Postura', '62 / 100'],
      ['Configuración', 'TLS débil · servicios innecesarios'],
      ['Exposición', 'Puerto 443 publicado'],
      ['Debilidades', '3 hallazgos de configuración'],
      ['Relaciones', 'Alcanza la red interna de nómina'],
      ['Estado', 'Activo · en producción'],
    ],
    axes: ['Configuración', 'Exposición', 'Parches', 'Segmentación', 'Identidad', 'Monitoreo'],
    values: [0.45, 0.25, 0.4, 0.55, 0.6, 0.75],
    out: 'Inteligencia de postura',
    note: 'Cada agente conoce profundamente su dominio.',
  },
  aegis: {
    task: 'Controles de SRV-PS-014',
    controls: [
      { label: 'CIS 4.1 · Configuración segura', state: 'ok' },
      { label: 'CIS 7.4 · Parches automáticos',   state: 'fail' },
      { label: 'CIS 13.10 · Filtrado de aplicación (WAF)', state: 'partial' },
      { label: 'CIS 5.4 · Privilegios restringidos', state: 'fail' },
      { label: 'CIS 8.2 · Registro de auditoría', state: 'ok' },
      { label: 'CIS 12.2 · Segmentación de red',  state: 'absent' },
      { label: 'Excepción GRC-311',               state: 'exception' },
    ],
    legend: { ok: 'Implementado', fail: 'Fallido', partial: 'Parcial', absent: 'Ausente', exception: 'Excepción' },
    out: 'Inteligencia de controles',
    note: 'Qué significa cada brecha en este activo específico.',
  },

  delegate: {
    query: 'CVE-2026-35273',
    steps: ['Consulta', 'Análisis de contexto', 'Capacidades requeridas'],
    asks: [
      { agent: 'argus',    need: 'Necesito vulnerabilidad' },
      { agent: 'agora',    need: 'Necesito postura' },
      { agent: 'aegis',    need: 'Necesito controles' },
      { agent: 'identity', need: 'Necesito contexto de identidad' },
    ],
    line: 'EXPIA no lo ejecuta todo. Orquesta.',
    word: 'Orquestación',
  },

  collab: {
    script: [
      { at: 'argus', find: 'El activo es vulnerable.' },
      { from: 'argus', to: 'agora', msg: 'Necesito contexto de postura' },
      { at: 'agora', find: 'El activo está expuesto.' },
      { from: 'agora', to: 'aegis', msg: 'Necesito contexto de controles' },
      { at: 'aegis', find: 'El control requerido no está implementado.' },
    ],
    lines: ['Los agentes no trabajan aislados.', 'Colaboran a través del contexto.'],
  },

  /* ---------- 20 · GRAFO DE EXPOSICIÓN ---------- */
  xgraph: {
    nodes: [
      { key: 'cve',      label: 'CVE',         sub: 'CVE-2026-35273',          kind: 'Vulnerabilidad', color: 'red',    at: [46, 30],   from: 'hero' },
      { key: 'software', label: 'Software',    sub: 'PeopleSoft 8.58',         kind: 'Software',       color: 'ink',    at: [-70, 70],  from: 'hero' },
      { key: 'user',     label: 'Usuario',     sub: 'svc_peoplesoft',          kind: 'Identidad',      color: 'violet', at: [-150, -40], from: 'software' },
      { key: 'priv',     label: 'Privilegios', sub: 'Admin local',             kind: 'Identidad',      color: 'violet', at: [-210, -120], from: 'user' },
      { key: 'net',      label: 'Red',         sub: 'DMZ → nómina',            kind: 'Red',            color: 'cyan',   at: [80, -110], from: 'hero' },
      { key: 'fw',       label: 'Firewall',    sub: 'Regla 443 abierta',       kind: 'Control de red', color: 'yellow', at: [190, -170], from: 'net' },
      { key: 'app',      label: 'Aplicación',  sub: 'Portal de nómina',        kind: 'Aplicación',     color: 'ink',    at: [-40, -150], from: 'hero' },
      { key: 'control',  label: 'Control',     sub: 'WAF solo detección',      kind: 'Control',        color: 'yellow', at: [170, 60],  from: 'cve' },
      { key: 'exposure', label: 'Exposición',  sub: 'Alcanzable desde Internet', kind: 'Exposición',   color: 'red',    at: [250, -40], from: 'fw' },
      { key: 'threat',   label: 'Amenaza',     sub: 'Explotación activa (KEV)', kind: 'Amenaza',       color: 'violet', at: [150, 160], from: 'cve' },
    ],
    dims: ['Superficie', 'Vulnerabilidad', 'Identidad', 'Postura', 'Controles', 'Exposición', 'Amenazas'],
    lines: ['Todo empieza a conectarse.', 'Superficie, vulnerabilidad, identidad, postura, controles, exposición y amenazas.'],
  },

  /* ---------- 21 · DE VULNERABILIDAD A EXPOSICIÓN ---------- */
  transform: {
    stages: ['CVE', 'Vulnerabilidad', 'Contexto', 'Exposición', 'Señal de riesgo'],
    factors: ['Dónde está', 'Qué activo afecta', 'Qué tan expuesto está', 'Qué controles existen', 'Qué privilegios tiene', 'Qué software involucra', 'Qué amenazas existen', 'Qué relaciones tiene'],
    lines: ['Una vulnerabilidad es solo el comienzo.', 'La exposición depende del contexto.'],
  },

  /* ---------- 22 · RUTA DE EXPOSICIÓN ---------- */
  path: {
    chain: [
      { label: 'Internet',           sub: 'Origen externo',          color: 'red' },
      { label: 'Firewall',           sub: 'Regla 443 abierta',        color: 'yellow' },
      { label: 'Aplicación',         sub: 'Portal de nómina',         color: 'ink' },
      { label: 'SRV-PS-014',         sub: 'Servidor PeopleSoft',      color: 'ink', hero: true },
      { label: 'Vulnerabilidad',     sub: 'CVE-2026-35273',           color: 'red' },
      { label: 'Usuario privilegiado', sub: 'svc_peoplesoft · admin', color: 'violet' },
      { label: 'Recurso sensible',   sub: 'Base de datos de nómina',  color: 'orange' },
    ],
    title: 'Ruta de exposición',
    note: 'Representación conceptual de relaciones de exposición',
  },

  /* ---------- 23 · DOS CONTEXTOS ---------- */
  twin: {
    cve: 'CVE-2026-35273',
    a: { title: 'Contexto A', items: ['Interno', 'Privilegio bajo', 'Controlado', 'Exposición limitada'], verdict: 'Prioridad menor', color: 'green' },
    b: { title: 'Contexto B', items: ['Expuesto a Internet', 'Activo crítico', 'Acceso privilegiado', 'Brecha de control', 'Amenaza relacionada'], verdict: 'Prioridad mayor', color: 'red' },
    lines: ['La vulnerabilidad es la misma.', 'El contexto cambia. El resultado cambia.'],
  },

  /* ---------- 24 · PRIORIZACIÓN ---------- */
  priority: {
    levels: [
      { label: 'Ruido',                   count: 1000 },
      { label: 'Señales',                 count: 180 },
      { label: 'Exposiciones relevantes', count: 24 },
      { label: 'Exposiciones críticas',   count: 3 },
    ],
    title: 'Priorización',
    line: 'No todas las señales importan.',
  },

  /* ---------- 25 · INTELIGENCIA ---------- */
  insight: {
    before: { n: 500, label: 'vulnerabilidades' },
    items: [
      { n: 3,  label: 'rutas de exposición críticas',      color: 'red' },
      { n: 7,  label: 'brechas de control prioritarias',    color: 'yellow' },
      { n: 12, label: 'identidades expuestas',              color: 'violet' },
      { n: 4,  label: 'activos con señales combinadas',     color: 'orange' },
    ],
    lines: ['EXPIA no entrega más ruido.', 'Entrega contexto.'],
  },

  /* ---------- 26 · IA ---------- */
  ai: {
    layers: ['Automatización', 'Agentes', 'Contexto', 'IA'],
    verbs: ['Interpretar', 'Resumir', 'Explicar', 'Relacionar', 'Encontrar patrones', 'Generar hipótesis', 'Responder preguntas'],
    lines: ['La automatización y los agentes ya hicieron el trabajo pesado.', 'La IA trabaja sobre el contexto, no sobre el ruido.'],
  },

  /* ---------- 27 · EXPLICACIÓN ---------- */
  explain: {
    from: '500 señales',
    mid: 'Contexto',
    ai: 'Análisis de IA',
    question: '¿Por qué importa?',
    answer: 'Esta vulnerabilidad afecta un servidor crítico expuesto a Internet, donde el control requerido no está implementado y existe acceso privilegiado.',
  },

  /* ---------- 28 · EVIDENCIA ---------- */
  evidence: {
    /* La explicación por fragmentos: cada uno apunta a una evidencia */
    parts: [
      { t: 'Esta ' },
      { t: 'vulnerabilidad', ref: 'cve' },
      { t: ' afecta un ' },
      { t: 'servidor crítico', ref: 'asset' },
      { t: ' ' },
      { t: 'expuesto a Internet', ref: 'exposure' },
      { t: ', donde el ' },
      { t: 'control requerido no está implementado', ref: 'control' },
      { t: ' y existe ' },
      { t: 'acceso privilegiado', ref: 'identity' },
      { t: ', en medio de ' },
      { t: 'explotación activa', ref: 'threat' },
      { t: '.' },
    ],
    items: [
      { key: 'cve',      label: 'CVE',       sub: 'CVE-2026-35273 · Tenable',           color: 'red' },
      { key: 'asset',    label: 'Activo',    sub: 'SRV-PS-014 · CMDB',                  color: 'ink' },
      { key: 'control',  label: 'Control',   sub: 'CIS 13.10 parcial · Línea base',     color: 'yellow' },
      { key: 'identity', label: 'Identidad', sub: 'svc_peoplesoft · Directorio Activo', color: 'violet' },
      { key: 'exposure', label: 'Exposición', sub: 'Publicado a Internet · Cortex',     color: 'red' },
      { key: 'threat',   label: 'Amenaza',   sub: 'En catálogo KEV · Intel. de amenazas', color: 'violet' },
    ],
    line: 'La inteligencia debe ser explicable.',
  },

  /* ---------- 29 · PUNTAJE ---------- */
  score: {
    title: 'Puntaje de exposición',
    value: 87,
    factors: [
      { label: 'Activo crítico',            w: 16 },
      { label: 'Expuesto a Internet',       w: 18 },
      { label: 'Vulnerabilidad presente',   w: 15 },
      { label: 'Brecha de control',         w: 14 },
      { label: 'Acceso privilegiado',       w: 12 },
      { label: 'Señal de amenaza relacionada', w: 12 },
    ],
    why: '¿Por qué?',
    chain: ['Señales', 'Contexto', 'Evidencia', 'Análisis', 'Prioridad'],
    note: 'Valor conceptual · no es una fórmula definitiva',
  },

  /* ---------- 30 · HUMANO ---------- */
  human: {
    chain: ['EXPIA', 'Inteligencia', 'Analista', 'Decisión'],
    gives: ['Contexto', 'Evidencia', 'Exposición', 'Relaciones', 'Explicación', 'Prioridad'],
    options: ['Remediar', 'Aceptar', 'Investigar', 'Monitorear'],
    lines: ['La tecnología acelera la comprensión.', 'La decisión sigue siendo humana.'],
    equation: ['Automatización', 'IA', 'Humano', 'Inteligencia'],
  },

  /* ---------- 31 · CAPACIDADES ---------- */
  teams: {
    list: [
      { name: 'SOC',                          use: 'Monitoreo y respuesta con contexto' },
      { name: 'Riesgo',                       use: 'Exposición medida frente al apetito de riesgo' },
      { name: 'Ethical hacking',              use: 'Rutas a validar ofensivamente' },
      { name: 'Gestión de vulnerabilidades',  use: 'Qué remediar primero' },
      { name: 'Ciberfraude',                  use: 'Superficie que habilita fraude' },
      { name: 'Respuesta a incidentes',       use: 'Contexto inmediato del activo' },
      { name: 'Ingeniería de seguridad',      use: 'Brechas estructurales a cerrar' },
      { name: 'Control y cumplimiento',       use: 'Líneas base y excepciones con evidencia' },
    ],
    line: 'Una inteligencia. Muchas capacidades de seguridad.',
  },

  /* ---------- 32 · MIRADAS ---------- */
  lenses: {
    list: [
      { label: 'Vulnerabilidad', team: 'Gestión de vulnerabilidades', sees: 'CVE crítica',          color: 'orange' },
      { label: 'Postura',        team: 'Ingeniería de seguridad',     sees: 'Configuración débil',  color: 'cyan' },
      { label: 'Controles',      team: 'Control y cumplimiento',      sees: 'WAF parcial',          color: 'yellow' },
      { label: 'Identidad',      team: 'IAM',                         sees: 'Cuenta privilegiada',  color: 'violet' },
      { label: 'Exposición',     team: 'Ethical hacking',             sees: 'Publicado a Internet', color: 'red' },
      { label: 'Amenazas',       team: 'SOC',                         sees: 'Explotación activa',   color: 'violet' },
    ],
    one: 'Un contexto',
    lines: ['Cada equipo ve una señal distinta.', 'EXPIA conecta el contexto.'],
  },

  /* ---------- 33 · SUPERFICIE COMPLETA ---------- */
  surface: {
    line: 'Ahora sí podemos ver nuestra superficie de ataque.',
    legend: [
      { label: 'Exposición crítica', color: 'red' },
      { label: 'Exposición alta',    color: 'orange' },
      { label: 'Atención',           color: 'yellow' },
      { label: 'Controlado',         color: 'green' },
    ],
    hotspots: [
      { cluster: 'servers', label: 'Servidores DMZ',         level: 'Crítica' },
      { cluster: 'apps',    label: 'Aplicaciones publicadas', level: 'Alta' },
      { cluster: 'users',   label: 'Cuentas privilegiadas',  level: 'Alta' },
    ],
  },

  /* ---------- 34 · EVOLUCIÓN ---------- */
  evolve: {
    stages: [
      { label: 'Inventario de activos', q: 'Qué tenemos.' },
      { label: 'Superficie de ataque',  q: 'Qué está expuesto.' },
      { label: 'Exposición',            q: 'Por qué importa.' },
      { label: 'Inteligencia',          q: 'Qué está relacionado.' },
      { label: 'Decisión',              q: 'Qué investigar primero.' },
    ],
  },

  /* ---------- 35 · CICLO ---------- */
  loop: {
    steps: ['Orquestar', 'Agentes', 'Investigar', 'Delegar', 'Correlacionar', 'Construir contexto', 'IA', 'Explicar', 'Priorizar', 'Analista', 'Decidir'],
    inputs: ['Nueva señal', 'Nuevo activo', 'Nueva CVE', 'Cambio de control'],
    line: 'Un ciclo continuo, no una línea que termina.',
  },

  /* ---------- 36 · CONTINUIDAD ---------- */
  continuous: {
    chain: ['Nuevo activo', 'Nueva CVE', 'Cambio de control', 'Nueva exposición', 'Nueva amenaza', 'Reevaluar'],
    colors: ['ink', 'orange', 'yellow', 'red', 'violet', 'cyan'],
    line: 'EXPIA sigue observando.',
    sub: 'No solo responde cuando alguien pregunta.',
  },

  /* ---------- 37 · FUTURO ---------- */
  future: {
    today: ['Activos', 'Vulnerabilidades', 'Controles', 'Postura', 'Identidades', 'Exposición', 'Amenazas'],
    tomorrow: ['Identidades humanas', 'Identidades no humanas', 'Agentes de IA', 'Aplicaciones', 'Cargas de trabajo', 'Cuentas de servicio', 'Máquinas', 'Recursos cloud', 'Entidades de red'],
    todayLabel: 'Hoy',
    tomorrowLabel: 'Horizonte',
    line: 'El futuro de la inteligencia de exposición.',
    note: 'Visión de evolución · no capacidades implementadas hoy',
  },

  /* ---------- 38 · SISTEMA ---------- */
  engine2: {
    words: ['De señales', 'a contexto', 'a exposición', 'a inteligencia', 'a decisión'],
  },

  /* ---------- 39 · CIERRE ---------- */
  close: {
    lines: ['El riesgo no está en una señal.', 'Está en la relación entre ellas.', 'EXPIA convierte esas relaciones en inteligencia accionable.'],
    question: '¿Cómo construimos esto?',
    enter: 'Entrar a la arquitectura',
  },
};
