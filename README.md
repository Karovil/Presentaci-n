# Identity Risk Intelligence — Experiencia interactiva

Abrir `index.html` en Google Chrome (no requiere servidor ni conexión).

**Navegación:** scroll / flechas / espacio / PageUp-PageDown (compatible con presentador) · `F` pantalla completa · `#N` en la URL salta a la escena N.
En las escenas con secuencias automáticas (02, 05, 06, 07, 09, 10, 11), avanzar completa o acelera la secuencia en lugar de saltarla.

**Parte 1 — El problema (01–04):** activación · una identidad · el caos · revelación.

**Parte 2 — La solución (05–15):** la alerta · investigación manual · el tiempo (03 días) · otra pregunta · automatización · la capa de IA · puntaje de riesgo · el analista decide · 3 días → 5 minutos · arquitectura · el futuro.

**Estructura**
- `index.html` — estructura de las 15 escenas
- `css/` — `base.css` (tokens y sistema de escenas), `hud.css`, `scenes.css` (parte 1), `part2.css` (parte 2)
- `js/data.js`, `js/data-part2.js` — todo el texto y la configuración narrativa
- `js/scenes/` — lógica de cada escena · `js/controller.js` — navegación por pasos
- `assets/fonts/` — Inter y JetBrains Mono (OFL)
