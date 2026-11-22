# EXPIA · En el radar — presentación de 3 minutos

Abrir `expia-serejemplo/index.html` en Google Chrome (no requiere servidor ni conexión).
Es independiente de `expia/` (la experiencia completa de 39 escenas) y de la raíz del repositorio.

## La idea
Una presentación que **es un reloj**. Al iniciar, arriba a la derecha empieza a correr un cronómetro
de 3:00 y un medidor de "ataques a una organización en Colombia desde que empezamos"
(4.151 ataques semanales por organización → uno cada ≈ 2,4 min, Check Point, oct 2026).
Alrededor de 2:26 el medidor salta a **1** y aparece un impacto en el radar: el argumento ocurre en vivo.

Todo sucede sobre **un radar persistente**: primero detecta los grandes incidentes de 2026,
después se llena de ruido y al final EXPIA lo convierte en una sola ruta de exposición.

## Las 10 escenas (180 s)
| # | Escena | s | Mensaje |
|---|---|---|---|
| 01 | Tres minutos | 12 | Tienes 3 minutos. Un atacante necesita menos. |
| 02 | 2026 en el radar | 24 | Ocho incidentes del año aparecen con el barrido. Patrón común: lo expuesto. |
| 03 | La puerta principal | 18 | 31 % de las brechas empieza explotando una vulnerabilidad (Verizon DBIR 2026). |
| 04 | La carrera | 20 | −7 días para explotar vs. 43 días para remediar. Solo 26 % se remedia por completo. |
| 05 | El atacante ya automatizó | 20 | Agentes de IA: 440 servidores, 48 países. 1 de cada 4 brechas usa IA. |
| 06 | Aquí | 16 | Colombia: 4.151 ataques semanales por organización. Mira el reloj. |
| 07 | El ruido | 16 | 18.392 vulnerabilidades, 12 fuentes, 0 conexiones. Vemos señales, no exposición. |
| 08 | EXPIA | 26 | El ruido colapsa en una ruta de exposición. Automatiza · Investiga · Explica · Decide. |
| 09 | De ruido a decisión | 18 | 18.392 → 3 críticas. USD 4,99 M por brecha; −1,93 M con IA y automatización. |
| 10 | Cierre | 10 | El reloj se detiene. "EXPIA la mantiene en el radar." |

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

Las cifras globales vienen de fuentes públicas de 2026 (ver `GUION.md`). La ruta de exposición
y el embudo de la organización son ilustrativos.
