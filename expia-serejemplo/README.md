# EXPIA · En el radar — presentación de 3 minutos

Abrir `expia-serejemplo/index.html` en Google Chrome (no requiere servidor ni conexión).
Es independiente de `expia/` (la experiencia completa de 39 escenas) y de la raíz del repositorio.

## La idea
Una presentación que **es un reloj**. Al iniciar, arriba a la derecha empieza a correr un cronómetro
de 3:00 y un medidor de "intentos de ataque a una organización en Colombia desde que empezamos"
(4.151 intentos semanales por organización → uno cada ≈ 2,4 min, Check Point, oct 2026).
Alrededor de 2:26, durante la escena de EXPIA, el medidor salta a **1** y aparece un impacto en el radar: el argumento ocurre en vivo.

Todo sucede sobre **un radar persistente**: primero detecta los incidentes de 2026 en la banca,
después se llena de ruido, el ruido converge en EXPIA (sus fuentes y sus agentes) y al final aparece la ruta hasta el core.

## Audiencia y enfoque
Pensada para **vicepresidentes**: sin términos técnicos y con foco en la **banca y el core bancario**.
Habla de clientes, dinero, confianza y proveedores, no de CVE, parches ni herramientas.

## Las 13 escenas (180 s)
Primero el mundo y la banca (≈ 1:40), luego **EXPIA, la solución** (≈ 1:20).

| # | Escena | s | Mensaje |
|---|---|---|---|
| 01 | Tres minutos | 10 | Tenemos 3 minutos. Un atacante necesita menos. |
| 02 | La banca, en la mira | 20 | JPMorgan, BBVA y Nu, banca de Corea, TruStage… La puerta estaba abierta. |
| 03 | Lo que cuesta | 12 | USD 6,29 M por brecha financiera; USD 3 M de rescate exigido a la banca. |
| 04 | La puerta no siempre es nuestra | 12 | 48 % de las brechas entra por un proveedor (antes 30 %). |
| 05 | La carrera | 13 | Atacan 7 días antes de la solución; tardamos 43 días en cerrar. |
| 06 | El atacante ya automatizó | 13 | Ellos ya trabajan con agentes de IA. ¿Y nosotros? |
| 07 | Aquí | 12 | Colombia: 4.151 intentos de ataque semanales por organización. Mire el reloj. |
| 08 | Sin mapa | 11 | 18.392 alertas, 12 herramientas, 0 visión de conjunto. |
| 09 | **Qué es EXPIA** | 22 | El primer orquestador de agentes de ciberseguridad. El ruido converge en EXPIA, conectado a vulnerabilidades, controles CIS, excepciones, firewall, GRC, activos, identidades y amenazas. |
| 10 | **Un equipo de agentes** | 20 | Un director de orquesta y especialistas: ARGUS, AEGIS, AGORA, Identidad, Amenazas, Activos. |
| 11 | **El camino al core** | 16 | El camino de un atacante hasta el core y los clientes. Ve · Prioriza · Explica · Decide. |
| 12 | De ruido a decisión | 10 | De 18.392 alertas a 3 decisiones para hoy. −USD 1,93 M con IA. |
| 13 | Cierre | 9 | El reloj se detiene. "EXPIA la mantiene en el radar." |

## Controles
- `→` / espacio / scroll: avanzar · `←`: retroceder · `F`: pantalla completa
- `N`: mostrar el guion de la escena (notas del presentador)
- `A`: modo automático (cada escena dura su tiempo asignado; total 3:00)
- `R`: reiniciar el reloj · `#N` en la URL salta a la escena N
- La barra inferior muestra el presupuesto de tiempo de cada escena y se llena mientras hablas.

## Estructura
- `js/data.js` — **todo el texto**, cifras, tiempos y guion (editar solo aquí)
- `js/radar.js` — el radar (lienzo): barrido, incidentes, ruido, ruta y ataques en vivo
- `js/app.js` — escenas, reloj, contadores y navegación
- `css/styles.css` — identidad visual de EXPIA
- `GUION.md` — guion completo y fuentes

Las cifras globales vienen de fuentes públicas de 2026 (ver `GUION.md`). La ruta de exposición,
el embudo y las alertas de la organización son ilustrativos.
