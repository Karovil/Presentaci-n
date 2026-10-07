# EXPIA · Exposure & Intelligence Platform — experiencia interactiva

Abrir `expia/index.html` en Google Chrome (no requiere servidor ni conexión).
Es independiente de la experiencia de Identity Risk Intelligence (raíz del repositorio).

**Navegación:** scroll / flechas / espacio / PageUp-PageDown · `F` pantalla completa · `#N` en la URL salta a la escena N.
En la escena 01 la plataforma se activa **manteniendo presionado** el control central (o con Enter / →).

**Construido hasta ahora (01–04):** activación · el mapa de la organización · una vulnerabilidad · la señal y su contexto.

**Estructura**
- `index.html` — capas de interfaz de cada escena
- `css/` — `tokens.css` (identidad visual), `hud.css` (marco cartográfico), `graph.css` (anotaciones y sonda), `scenes.css`
- `js/data/` — `narrative.js` (todo el texto), `org.js` (organización, activo, CVE y contexto de demostración)
- `js/core/` — utilidades, HUD y controlador de pasos
- `js/graph/` — `world.js` (lienzo persistente, cámara, nodos y relaciones), `org-map.js` (regiones y terreno), `anno.js` (anotaciones ancladas al mapa), `case.js` (activo y CVE del caso)
- `js/scenes/` — una escena por archivo
- `assets/fonts/` — Space Grotesk e IBM Plex Mono (OFL)
