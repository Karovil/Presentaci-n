# EXPIA · En el radar — presentación de 3 minutos

Abrir `expia-serejemplo/index.html` en Google Chrome (no requiere servidor ni conexión).
Es independiente de `expia/` (la experiencia completa de 39 escenas) y de la raíz del repositorio.

## La idea
Una presentación que **es un reloj**. Al iniciar, arriba a la derecha empieza a correr un cronómetro
de 3:00 y un medidor de "intentos de ataque a una organización en Colombia desde que empezamos"
(4.151 intentos semanales por organización → uno cada ≈ 2,4 min, Check Point, oct 2026).
Alrededor de 2:26, durante la escena de EXPIA, el medidor salta a **1** y aparece un impacto en el radar: el argumento ocurre en vivo.

Todo sucede sobre **un radar persistente**: primero detecta los incidentes de 2026 en la banca,
después se llena de ruido y al final EXPIA lo convierte en una sola ruta de exposición.

## Audiencia y enfoque
Pensada para **vicepresidentes**: sin términos técnicos y con foco en la **banca y el core bancario**.
Habla de clientes, dinero, confianza y proveedores, no de CVE, parches ni herramientas.

## Las 11 escenas (180 s)
| # | Escena | s | Mensaje |
|---|---|---|---|
| 01 | Tres minutos | 12 | Tenemos 3 minutos. Un atacante necesita menos. |
| 02 | La banca, en la mira | 24 | JPMorgan, BBVA y Nu, banca de Corea, TruStage… La puerta estaba abierta. |
| 03 | Lo que cuesta | 16 | USD 6,29 M por brecha financiera; USD 3 M de rescate exigido a la banca. |
| 04 | La puerta no siempre es nuestra | 16 | 48 % de las brechas entra por un proveedor (antes 30 %). |
| 05 | La carrera | 16 | Atacan 7 días antes de la solución; tardamos 43 días en cerrar. |
| 06 | El atacante ya automatizó | 16 | Agentes de IA: 395 organizaciones, 48 países. ¿Por qué nosotros no? |
| 07 | Aquí | 14 | Colombia: 4.151 intentos de ataque semanales por organización. Mire el reloj. |
| 08 | Sin mapa | 14 | 18.392 alertas, 12 herramientas, 0 visión de conjunto. |
| 09 | EXPIA | 24 | El camino de un atacante hasta el core y los clientes. Ve · Prioriza · Explica · Decide. |
| 10 | De ruido a decisión | 12 | De 18.392 alertas a 3 decisiones para hoy. −USD 1,93 M con IA. |
| 11 | Cierre | 12 | El reloj se detiene. "EXPIA la mantiene en el radar." |

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
