# EXPIA · Exposure & Intelligence Platform — experiencia interactiva

Abrir `expia/index.html` en Google Chrome (no requiere servidor ni conexión).
Es independiente de la experiencia de Identity Risk Intelligence (raíz del repositorio).

**Navegación:** scroll / flechas / espacio / PageUp-PageDown · `F` pantalla completa · `#N` en la URL salta a la escena N · el medidor de la izquierda también navega.
En la escena 01 la plataforma se activa **manteniendo presionado** el control central (o con Enter / →).
En las escenas con secuencias automáticas, avanzar completa la secuencia en lugar de saltarla.

## La historia (39 escenas)
| Bloque | Escenas |
|---|---|
| Inicio | 01 Activación · 02 El mapa · 03 Una vulnerabilidad · 04 La señal y su contexto |
| 1 · Fragmentación | 05 Datos fragmentados · 06 La superficie crece · 07 Una superficie viva · 08 El volumen de señales · 09 EXPIA recibe todo |
| 2 · Automatización | 10 Motor de automatización · 11 El código detrás · 12 No todo es igual |
| 3 · Multi-agente | 13 Nacen los agentes · 14 ARGUS · 15 AGORA · 16 AEGIS · 17 Más especialistas · 18 Delegación · 19 Colaboración |
| 4 · Exposición | 20 Grafo de exposición · 21 De vulnerabilidad a exposición · 22 Ruta de exposición · 23 Mismo CVE, dos contextos · 24 Priorización · 25 Inteligencia, no alertas |
| 5 · IA y decisión | 26 La IA como capa · 27 De datos a explicación · 28 Primero la evidencia · 29 Puntaje de exposición · 30 El humano decide |
| 6 · Alcance | 31 Capacidades · 32 Un caso, muchas miradas · 33 La superficie completa · 34 Del inventario a la inteligencia · 35 El ciclo multi-agente · 36 Automatización continua |
| 7 · Cierre | 37 El futuro · 38 Un sistema de inteligencia · 39 Cierre → "¿Cómo construimos esto?" |

## Estructura
- `index.html` — capas de interfaz de las escenas 01–04 y carga de módulos (las escenas 05–39 crean su propia capa)
- `css/` — `tokens.css` (identidad visual), `hud.css` (marco cartográfico), `graph.css` (anotaciones y sonda), `scenes.css` (01–04), `story.css` (05–39)
- `js/data/` — `narrative.js` (textos 01–04), `org.js` (organización, activo, CVE y contexto), `story.js` (textos y datos 05–39, estaciones del mundo)
- `js/core/` — utilidades, HUD y controlador de pasos
- `js/graph/` — `world.js` (lienzo persistente, cámara, nodos y relaciones), `org-map.js` (regiones y terreno), `anno.js`, `case.js`, `kit.js` (piezas de escena: flujos, mensajes, anillos, cadenas, frases), `core.js` (núcleo EXPIA), `agents.js` (especialistas con estados), `team.js` (disposición de agentes), `pipeline.js` (motor de automatización)
- `js/scenes/` — una escena por archivo
- `assets/fonts/` — Space Grotesk e IBM Plex Mono (OFL)

Todas las cifras, nombres de activos y hallazgos son ilustrativos.
