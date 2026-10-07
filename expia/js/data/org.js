/* ==========================================================================
   EXPIA · DATOS DE DEMOSTRACIÓN
   Organización ficticia, activo protagonista y su contexto.
   Las cifras son ilustrativas; los nombres de fuentes vienen del proyecto.
   ========================================================================== */
window.EX = window.EX || {};

/* Estados con significado (usar con moderación) */
EX.palette = {
  ink:      [226, 232, 244],
  asset:    [176, 192, 222],
  server:   [214, 226, 248],
  cyan:     [94, 226, 255],
  violet:   [150, 128, 255],
  green:    [61, 220, 151],
  yellow:   [255, 209, 102],
  orange:   [255, 138, 61],
  red:      [255, 69, 88],
};

EX.org = {
  /* Clusters dispuestos como regiones de un mapa (unidades del mundo) */
  clusters: [
    { key: 'devices',  label: 'Dispositivos',   count: 260, real: 1284, x: -760, y:  250, sx: 330, sy: 210 },
    { key: 'users',    label: 'Usuarios',       count: 200, real:  612, x: -820, y: -330, sx: 260, sy: 170 },
    { key: 'servers',  label: 'Servidores',     count: 130, real:  412, x:  -40, y:  -60, sx: 230, sy: 190, color: 'server' },
    { key: 'apps',     label: 'Aplicaciones',   count: 110, real:  236, x:  640, y: -330, sx: 250, sy: 160 },
    { key: 'cloud',    label: 'Nube',           count:  90, real:  187, x:  880, y:  220, sx: 230, sy: 170 },
    { key: 'db',       label: 'Bases de datos', count:  50, real:   64, x:  260, y:  430, sx: 190, sy: 120 },
    { key: 'networks', label: 'Redes',          count:  40, real:   52, x: -240, y:  470, sx: 260, sy:  90 },
  ],
  /* Enlaces entre regiones (dependencias de alto nivel) */
  bridges: [
    ['users', 'devices'], ['devices', 'networks'], ['networks', 'servers'], ['servers', 'db'],
    ['servers', 'apps'], ['apps', 'cloud'], ['cloud', 'db'], ['users', 'apps'], ['networks', 'cloud'], ['users', 'servers'],
  ],

  /* El activo protagonista */
  hero: {
    id: 'SRV-PS-014',
    kind: 'Servidor de aplicaciones',
    zone: 'DMZ · Zona expuesta',
    cluster: 'servers',
  },

  cve: {
    id: 'CVE-2026-35273',
    severity: 'Crítica',
    score: 'CVSS 9.8',
    detail: 'Ejecución remota de código · sin autenticación',
  },

  /* Contexto que convierte la señal en riesgo.
     state: neutral | green | yellow | orange | red
     leaves: relaciones de segundo grado (paso 3 de la escena 04) */
  context: [
    { key: 'asset',    title: 'Activo',                value: 'Servidor PeopleSoft · DMZ',          source: 'CMDB',                 state: 'neutral', leaves: 2 },
    { key: 'owner',    title: 'Responsable',           value: 'Equipo ERP · Nómina',                source: 'CMDB',                 state: 'neutral', leaves: 2 },
    { key: 'critical', title: 'Criticidad de negocio', value: 'Alta · procesos de nómina',          source: 'CMDB',                 state: 'orange',  leaves: 1 },
    { key: 'exposure', title: 'Exposición',            value: 'Publicado a Internet',               source: 'Cortex Cloud',         state: 'red',     leaves: 2 },
    { key: 'controls', title: 'Controles',             value: 'WAF en modo solo detección',         source: 'Controles de seguridad', state: 'yellow', leaves: 2 },
    { key: 'baseline', title: 'Línea base',            value: 'CIS · 76 % de cumplimiento',         source: 'Línea base CIS',       state: 'yellow',  leaves: 3 },
    { key: 'exception',title: 'Excepciones',           value: 'Vigente · sin control compensatorio', source: 'GRC · Excepciones',   state: 'orange',  leaves: 1 },
    { key: 'software', title: 'Software',              value: 'Oracle PeopleSoft 8.58',             source: 'Tenable',              state: 'neutral', leaves: 2 },
    { key: 'privilege',title: 'Privilegios',           value: 'Cuenta de servicio con admin local', source: 'Directorio Activo',    state: 'orange',  leaves: 2 },
    { key: 'relations',title: 'Relaciones',            value: '14 activos conectados',              source: 'CMDB · Landing Zone',  state: 'neutral', leaves: 5 },
  ],
};
